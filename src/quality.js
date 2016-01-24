var d3 = require('d3');
var topojson = require('topojson');
var _ = require('lodash');
var util = require('./util.js');

function neighborKey(source, target){
  return [source, target].sort().join(',');
}

function computeAngle(region1, region2){
  return (Math.atan2(region2.y-region1.y, region2.x-region1.x) * 180 / Math.PI + 360) %360;
}

function computeCentroid(features, projection){
  var path = d3.geo.path().projection(projection);

  return features.map(function(feature){
    var centroid = path.centroid(feature);
    feature.x = centroid[0];
    feature.y = centroid[1];
    return feature;
  });
}

function computeNeighbors(objects){
  var neighbors = topojson.neighbors(objects);
  var neighborLookup = {};
  neighbors.forEach(function(nb, i){
    if(nb.length>0){
      var source = objects[i];
      nb.forEach(function(j){
        var target = objects[j];
        neighborLookup[neighborKey(source.properties.key, target.properties.key)] = true;
      });
    }
  });
  return neighborLookup;
}

function computePairs(neighborLookup, featureLookup){
  return Object.keys(neighborLookup).map(function(d){
    var regions = d.split(',').map(function(key){return featureLookup[key];});
    var region1 = regions[0];
    var region2 = regions[1];
    var angle = computeAngle(region1, region2);
    return {
      key: d,
      region1: region1.properties.key,
      region2: region2.properties.key,
      angle: angle
    };
  });
}

function qc(cells, realPairs){
  var cellLookup = _.keyBy(cells, function(d){return [d.x,d.y].join(',');});

  var numStates = _.uniq(cells.map(function(d){return d.key;})).length;
  console.log('numStates', numStates);

  var pairs = [];
  cells.forEach(function(cell){
    var candidates = [
      [cell.x+1, cell.y],
      [cell.x, cell.y+1],
      [cell.x+1, cell.y+1],
      [cell.x-1, cell.y+1]
    ].map(function(d){
      return cellLookup[d.join(',')];
    })
    .filter(function(d){return d;})
    .forEach(function(d, i){
      var regions = [cell.key, d.key].sort();
      var region1 = regions[0]===cell.key ? cell : d;
      var region2 = regions[1]===cell.key ? cell : d;
      var angle = computeAngle(region1, region2);
      var key = regions.join(',');
      pairs.push({
        key: regions.join(','),
        region1: region1.key,
        region2: region2.key,
        angle: angle,
        secondary: i>1
      });
    });
  });
  var pairLookup = _.keyBy(pairs, function(d){return d.key;});

  var diff1 = _.differenceBy(realPairs, pairs, function(d){return d.key;});
  var diff2 = _.differenceBy(pairs.filter(function(d){return !d.secondary;}), realPairs, function(d){return d.key;});
  var intersection = _.intersectionBy(realPairs, pairs, function(d){return d.key;}).map(function(original){
    var pair = pairLookup[original.key];
    return {
      key: original.key,
      region1: original.region1,
      region2: original.region2,
      realAngle: original.angle,
      angle: pair.angle,
      diffAngle: (original.angle - pair.angle + 180) % 360 -180,
      secondary: pair.secondary
    };
  });

  var primary = intersection.filter(function(d){return !d.secondary;});
  var secondary = intersection.filter(function(d){return d.secondary;});
  var rows = d3.max(cells, function(d){return d.x;}) + 1;
  var cols = d3.max(cells, function(d){return d.y;}) + 1;
  var misdirections = intersection.filter(function(pair){
    return pair.diffAngle > 45;
  }).sort(function(a,b){ return b.diffAngle - a.diffAngle; });

  return {
    realNeighbors: realPairs,
    neighbors: pairs,

    valid: intersection,
    primary: primary,
    secondary: secondary,
    missing: diff1,
    invalid: diff2,
    misdirections: misdirections,

    rows: rows,
    cols: cols,
    area: rows * cols,
    recall: intersection.length / realPairs.length,
    primaryrecall: primary.length / realPairs.length,
    secondaryrecall: secondary.length / realPairs.length,
    inaccuracy: diff2.length / pairs.length,
    misdirection: misdirections.length / intersection.length
  };
}

function formatPercent(percent){
  return (percent*100).toFixed(2);
}

var realPairs = (function(){
  var usa = require(__dirname + '/input/usa.topo.json');
  var states = util.readCsv(__dirname + '/input/states.csv');
  var stateLookup = _.keyBy(states, function(d){return d.name.toLowerCase();});

  var stateObjects = usa.objects.units.geometries.map(function(o){
    o.properties.key = stateLookup[o.properties.name.toLowerCase()].key;
    return o;
  });

  var neighborLookup = computeNeighbors(stateObjects);
  var projection = d3.geo.albersUsa();
  var features = computeCentroid(topojson.feature(usa, usa.objects.units).features, projection);
  var featureLookup = _.keyBy(features, function(d){return d.properties.key;});

  return computePairs(neighborLookup, featureLookup);
}());

var qualities = ['nyt', 'npr', 'guardian', 'wp', '538', 'bloomberg'].map(function(source){
  var cells = require('./output/gridmap-layout-usa-'+source+'.json');
  // These two sources did not include DC
  var original = source==='bloomberg' || source==='538' ? realPairs.filter(function(d){
    return d.region1!='DC' && d.region2!='DC';
  }) : realPairs;
  var metrics = qc(cells, original);
  metrics.source = source=='538' ? 'fivethirtyeight' : source;
  return metrics;
});

// Report
// console.log('realPairs', realPairs);

qualities.forEach(function(q){
  console.log('');
  console.log('##' + q.source);
  console.log('');
  console.log('- area:', q.area, '('+q.cols +'x'+ q.rows+')');
  console.log('- recall:', q.valid.length + '/' + q.realNeighbors.length + '(' + formatPercent(q.recall) + '%)');
  console.log('- primaryrecall:', formatPercent(q.primaryrecall)+'%');
  console.log('- secondaryrecall:', formatPercent(q.secondaryrecall)+'%');
  console.log('- inaccuracy:', formatPercent(q.inaccuracy)+'%');
  console.log('- misdirection:', formatPercent(q.misdirection)+'%');
  console.log('- missing', q.missing.length, ':', q.missing.map(function(d){return d.key;}).join('  '));
  console.log('- inaccuracy', q.invalid.length, ':', q.invalid.map(function(d){return d.key;}).join('  '));
  console.log('- misdirection', q.misdirections.length, ':', q.misdirections.map(function(d){return d.key + '('+ Math.round(d.realAngle) + ',' +Math.round(d.angle) +')';}).join('  '));
});

var output2 = [['source', 'metric', 'value']];
var output = [['source', 'area', 'recall', 'primary', 'secondary', 'inaccuracy', 'misdirection']].concat(qualities.map(function(q){
  ['area', 'recall', 'primaryrecall', 'secondaryrecall', 'inaccuracy', 'misdirection'].forEach(function(metric){
    output2.push([q.source, metric, q[metric]]);
  });
  return [q.source, q.area, q.recall, q.primaryrecall, q.secondaryrecall, q.inaccuracy, q.misdirection];
}));

util.saveAsCsv(__dirname + '/output/quality-data.csv', output);
util.saveAsCsv(__dirname + '/output/quality-data2.csv', output2);