var d3 = require('d3');
var topojson = require('topojson');
var _ = require('lodash');
var util = require('./util.js');

function neighborKey(source, target){
  return [source, target].sort().join(',');
}

var realPairs = (function(){

  var usa = require('./input/usa.topo.json');
  var states = util.readCsv('./input/states.csv');
  var stateLookup = _.keyBy(states, function(d){return d.name.toLowerCase();});

  var stateObjects = usa.objects.units.geometries.map(function(o){
    o.properties.key = stateLookup[o.properties.name.toLowerCase()].key;
    return o;
  });
  console.log('stateObjects', stateObjects);

  // Find neighbors
  var neighbors = topojson.neighbors(stateObjects);

  var neighborLookup = {};
  neighbors.forEach(function(nb, i){
    if(nb.length>0){
      var source = stateObjects[i];
      nb.forEach(function(j){
        var target = stateObjects[j];
        neighborLookup[neighborKey(source.properties.key, target.properties.key)] = true;
      });
    }
  });

  // Compute centroids
  var width = 960, height = 600;

  var projection = d3.geo.albersUsa()
    .scale(1280)
    .translate([width / 2, height / 2]);

  var path = d3.geo.path()
    .projection(projection);

  var features = topojson.feature(usa, usa.objects.units).features.map(function(feature){
    var centroid = path.centroid(feature);
    feature.x = centroid[0];
    feature.y = centroid[1];
    return feature;
  });

  var featureLookup = _.keyBy(features, function(d){return d.properties.key;});

  var pairs = Object.keys(neighborLookup).map(function(d){
    var regions = d.split(',').map(function(key){return featureLookup[key];});
    var region1 = regions[0];
    var region2 = regions[1];
    var angle = Math.atan((region1.y-region2.y)/(region1.x-region2.x));
    return {
      region1: region1.properties.key,
      region2: region2.properties.key,
      angle: angle * 180 / Math.PI
    };
  });

  console.log('pairs', pairs);
  return pairs;
}());


function qc(input){
  var cells = require(input);
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
    .forEach(function(d){
      var regions = [cell.key, d.key].sort();
      var region1 = regions[0]===cell.key ? cell : d;
      var region2 = regions[1]===cell.key ? cell : d;
      var angle = Math.atan((region1.y-region2.y)/(region1.x-region2.x));
      pairs.push({
        region1: region1.key,
        region2: region2.key,
        angle: angle * 180 / Math.PI
      });
    });
  });

  // console.log('pairs', pairs);

  var diff1 = _.differenceBy(realPairs, pairs, function(d){return [d.region1, d.region2].join(',');});
  var diff2 = _.differenceBy(pairs, realPairs, function(d){return [d.region1, d.region2].join(',');});
  console.log('diff', diff1.length, diff2.length, pairs.length, realPairs.length);
}

['538', 'nyt', 'npr', 'guardian', 'bloomberg', 'wp'].forEach(function(source){
  console.log('source:', source);
  qc('./output/gridmap-layout-usa-'+source+'.json');
});

