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
    excessive: diff2,
    misdirections: misdirections,

    rows: rows,
    cols: cols,
    area: rows * cols,
    coverage: intersection.length / realPairs.length,
    primaryCoverage: primary.length / realPairs.length,
    secondaryCoverage: secondary.length / realPairs.length,
    excess: diff2.length / realPairs.length,
    misdirection: misdirections.length / realPairs.length
  };
}

function formatPercent(percent){
  return (percent*100).toFixed(2);
}

var realPairs = (function(){
  var usa = require('./input/usa.topo.json');
  var states = util.readCsv('./input/states.csv');
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
  console.log('---------------------------------------------------');
  console.log(q.source);
  console.log('area:', q.area);
  console.log('coverage:', q.valid.length + '/' + q.realNeighbors.length + '(' + formatPercent(q.coverage) + '%)');
  console.log('primaryCoverage:', formatPercent(q.primaryCoverage)+'%');
  console.log('secondaryCoverage:', formatPercent(q.secondaryCoverage)+'%');
  console.log('excess:', formatPercent(q.excess)+'%');
  console.log('misdirection:', formatPercent(q.misdirection)+'%');
  console.log('missing', q.missing.length, ':', q.missing.map(function(d){return d.key;}).join('  '));
  console.log('excess', q.excessive.length, ':', q.excessive.map(function(d){return d.key;}).join('  '));
  console.log('misdirection', q.misdirections.length, ':', q.misdirections.map(function(d){return d.key + '('+ Math.round(d.realAngle) + ',' +Math.round(d.angle) +')';}).join('  '));
});
