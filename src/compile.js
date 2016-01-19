var fs = require('fs');
var _ = require('lodash');
var util = require('./util.js');
var mu = require('mu2');

var inputDir = __dirname + '/input';
var outputDir = __dirname + '/output';

var states = util.readCsv(inputDir + '/states.csv');
var stateLookup = _.indexBy(states, function(d){return d.key;});

function process(inputName, outputName){
  var matrix = util.readCsvWithoutHeader(inputName);
  var cells = util.convertMatrixToList(matrix).map(function(cell){
    return _.extend({
      x: cell.col,
      y: cell.row
    }, stateLookup[cell.value]);
  });

  // console.log(cells);

  fs.writeFileSync(outputDir + '/' + outputName + '.json', JSON.stringify(cells));
  fs.writeFileSync(outputDir + '/' + outputName + '.csv', ['x,y,key,name'].concat(cells.map(function(cell){
    return [cell.x, cell.y, cell.key, cell.name].join(',');
  })).join('\n'));

  var txt = '';
  mu.compileAndRender(__dirname + '/template.mustache', {data: JSON.stringify(cells, null, 2)})
    .on('data', function(data){
      txt += data.toString();
    })
    .on('end', function(output){
      fs.writeFileSync(outputDir + '/' + outputName + '.js', txt);
    });
}


['538', 'nyt', 'npr', 'guardian', 'bloomberg', 'wp'].forEach(function(source){
  process(inputDir + '/tiles_' + source + '.csv', 'gridmap-layout-usa-' + source);
});

process(inputDir + '/tiles_nyt.csv', 'gridmap-layout-usa');
