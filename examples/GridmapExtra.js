(function(){

var DEFAULT_OPTIONS = {
  margin: {left: 10, right: 10, top: 10, bottom: 10},
  initialWidth: 500,
  initialHeight: 340,
  keyFn: undefined,
  row: function(d){return d.row;},
  col: function(d){return d.col;},
  text: function(d){return d.key;},
  textColor: '#222',
  stroke: '#222',
  fill: '#ccc',
  opacity: 1,
  textAnchor: 'middle',
  tileWidth: 40,
  tileHeight: 40,
  textSize: '12px',
  textYOffset: '0.35em'
};

var CUSTOM_EVENTS = [
  'tileClick',
  'tileMouseover',
  'tileMousemove',
  'tileMouseout'
];

d3Kit.GridmapExtra = d3Kit.factory.createChart(DEFAULT_OPTIONS, CUSTOM_EVENTS,
function constructor(skeleton){
  // alias
  var options = skeleton.options();
  var dispatch = skeleton.getDispatcher();
  var layers = skeleton.getLayerOrganizer();

  dispatch.on('resize',  visualize);
  dispatch.on('options', visualize);
  dispatch.on('data', visualize);

  layers.create(['tile', 'invalid', 'misdirection', 'missing']);

  function visualize(){
    if(!skeleton.hasData()){
      layers.get('tile').selectAll('g').remove();
      return;
    }

    var data = skeleton.data();
    drawTiles(data.tiles);
    drawInvalidNeighbors(data);
    drawMisdirections(data);
    drawMissing(data);
  }

  function drawTiles(tiles) {
    var selection = layers.get('tile').selectAll('g')
        .data(tiles, options.keyFn);

    var sEnter = selection.enter().append('g')
      .on('click', function(d, i){
        dispatch.tileClick(d, i);
      })
      .on('mouseover', function(d, i){
        dispatch.tileMouseover(d, i);
      })
      .on('mousemove', function(d, i){
        dispatch.tileMousemove(d, i);
      })
      .on('mouseout', function(d, i){
        dispatch.tileMouseout(d, i);
      })
      .attr('transform', function(d){
        return 'translate('+(xFn(d))+','+(yFn(d))+')';}
      );

    sEnter.append('rect')
      .attr('vector-effect', 'non-scaling-stroke')
      .attr('width', options.tileWidth)
      .attr('height', options.tileHeight)
      .style('opacity', options.opacity)
      .style('stroke', options.stroke)
      .style('fill', options.fill);

    sEnter.append('text')
      .attr('x', options.tileWidth/2)
      .attr('y', options.tileHeight/2)
      .attr('dy', options.textYOffset)
      .style('fill', options.textColor)
      .style('font-size', options.textSize)
      .style('text-anchor', options.textAnchor)
      .text(options.text);

    var sTrans = selection.transition()
      .attr('transform', function(d){
        return 'translate('+(xFn(d))+','+(yFn(d))+')';}
      );

    sTrans.select('rect')
      .attr('width', options.tileWidth)
      .attr('height', options.tileHeight)
      .style('opacity', options.opacity)
      .style('stroke', options.stroke)
      .style('fill', options.fill);

    sTrans.select('text')
      .attr('x', options.tileWidth/2)
      .attr('y', options.tileHeight/2)
      .attr('dy', options.textYOffset)
      .style('fill', options.textColor)
      .style('font-size', options.textSize)
      .style('text-anchor', options.textAnchor)
      .text(options.text);

    selection.exit().remove();
  }

  function drawInvalidNeighbors(data) {
    var tileLookup = data.tileLookup;
    var pairs = data.quality.invalid;

    const selection = layers.get('invalid').selectAll('rect')
      .data(pairs, function(d){return d.key;});

    const thickness = 4;

    selection.enter().append('rect')
      .attr('x', function(d){
        var t1 = tileLookup[d.region1];
        var t2 = tileLookup[d.region2];
        if(t1.y === t2.y) {
          return Math.max(xFn(t1), xFn(t2)) - thickness/2;
        }
        return xFn(t1);
      })
      .attr('y', function(d){
        var t1 = tileLookup[d.region1];
        var t2 = tileLookup[d.region2];
        if(t1.y === t2.y) {
          return yFn(t1);
        }
        return Math.max(yFn(t1), yFn(t2)) - thickness/2;
      })
      .attr('width', function(d){
        var t1 = tileLookup[d.region1];
        var t2 = tileLookup[d.region2];
        if(t1.y === t2.y) {
          return thickness;
        }
        return options.tileWidth;
      })
      .attr('height', function(d){
        var t1 = tileLookup[d.region1];
        var t2 = tileLookup[d.region2];
        if(t1.y === t2.y) {
          return options.tileHeight;
        }
        return thickness;
      })
  }

  function drawMisdirections(data){
    var tileLookup = data.tileLookup;
    var pairs = data.quality.misdirections;

    const selection = layers.get('misdirection').selectAll('line')
      .data(pairs, function(d){return d.key;});

    const thickness = 14;

    selection.enter().append('line')
      .style('stroke-width', thickness)
      .style('stroke', '#ed841e')
      .style('stroke-linecap', 'round')
      .style('mix-blend-mode', 'multiply')
      .attr('x1', function(d){
        return xFn(tileLookup[d.region1]) + options.tileWidth/2;
      })
      .attr('y1', function(d){
        return yFn(tileLookup[d.region1]) + options.tileHeight/2;
      })
      .attr('x2', function(d){
        return xFn(tileLookup[d.region2]) + options.tileWidth/2;
      })
      .attr('y2', function(d){
        return yFn(tileLookup[d.region2]) + options.tileHeight/2;
      })
  }

  function drawMissing(data){
    var tileLookup = data.tileLookup;
    var pairs = data.quality.missing;

    const selection = layers.get('missing').selectAll('path')
      .data(pairs, function(d){return d.key;});

    const thickness = 2;

    selection.enter().append('path')
      .style('stroke-width', thickness)
      .style('stroke', '#000')
      .style('fill', 'none')
      .style('opacity', 0.5)
      .style('stroke-linecap', 'round')
      // .style('mix-blend-mode', 'multiply')
      .attr('d', function(d){
        var t1 = tileLookup[d.region1];
        var t2 = tileLookup[d.region2];
        if(t1.x < t2.x) {
          var tmp = t2;
          t2 = t1;
          t1 = tmp;
        }
        var x1 = xFn(t1) + options.tileWidth/2;
        var x2 = xFn(t2) + options.tileWidth/2;
        var y1 = yFn(t1) + options.tileWidth/2;
        var y2 = yFn(t2) + options.tileWidth/2;
        var distance = Math.round(0.9 * Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)));
        var cx = (x1+x2)/2;
        var cy = (y1+y2)/2;
        return 'M'+x1+','+y1+' A'+distance+','+distance+' 0 0,0 '+x2+','+y2;
        // return 'M'+x1+','+y1+' Q'+cx+','+cy+' '+x2+','+y2;
      });
  }
  function xFn(tile) {
    return options.col(tile) * options.tileWidth;
  }

  function yFn(tile) {
    return options.row(tile) * options.tileHeight;
  }

  function resizeToFitMap(){
    if(!skeleton.hasData()){
      layers.get('tile').selectAll('g').remove();
      return;
    }

    var data = skeleton.data();

    var maxCol = d3.max(data.tiles, options.col) + 1;
    var maxRow = d3.max(data.tiles, options.row) + 1;
    var w = maxCol * options.tileWidth + options.margin.left + options.margin.right;
    var h = maxRow * options.tileHeight + options.margin.top + options.margin.bottom;

    skeleton.dimension([w, h]);
    return skeleton;
  }

  return skeleton.mixin({
    visualize: visualize,
    resizeToFitMap: resizeToFitMap
  });
});

}());
