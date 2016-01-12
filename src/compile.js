var fs = require('fs');
var _ = require('lodash');
var util = require('./util.js');
var mu = require('mu2');

var inputDir = __dirname + '/input';
var outputDir = __dirname + '/output';

var states = util.readCsv(inputDir + '/states.csv');
var stateLookup = _.indexBy(states, function(d){return d.key;});
var matrix = util.readCsvWithoutHeader(inputDir + '/map.csv');

var cells = util.convertMatrixToList(matrix).map(function(cell){
  return _.extend({
    x: cell.col,
    y: cell.row
  }, stateLookup[cell.value]);
});

console.log(cells);

fs.writeFileSync(outputDir + '/gridmap-layout-usa.json', JSON.stringify(cells));
fs.writeFileSync(outputDir + '/gridmap-layout-usa.csv', ['x,y,key,name'].concat(cells.map(function(cell){
  return [cell.x, cell.y, cell.key, cell.name].join(',');
})).join('\n'));

var txt = '';
mu.compileAndRender(__dirname + '/template.mustache', {data: JSON.stringify(cells, null, 2)})
  .on('data', function(data){
    txt += data.toString();
  })
  .on('end', function(output){
    fs.writeFileSync(outputDir + '/gridmap-layout-usa.js', txt);
  });