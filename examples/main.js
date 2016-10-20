// var color = d3.scale.category10();

var color = d3.scale.quantize()
  .domain([0, 180])
  .range(['#f1e5db','#f5d4bc','#f7c59e','#f7b480','#f5a462','#f29443','#ed841e']);

var names = {
  nyt: 'New York Times',
  npr: 'NPR',
  guardian: 'Guardian',
  wp: 'Washington Post',
  '538': 'FiveThirtyEight',
  bloomberg: 'Bloomberg'
};

var container = d3.select('.map-container');

d3.json('qualities.json', function(error, qualities) {
  const qualityBySource = _.keyBy(qualities, d => d.source);

  const misdirections = _(qualities)
    .keyBy(d => d.source)
    .mapValues(value => _(value.misdirections)
      .flatMap(d => [d.region1, d.region2])
      .uniq()
      .keyBy(d => d)
      .value()
    )
    .value();

  ['nyt', 'npr', 'guardian', 'wp', '538', 'bloomberg'].forEach(function(source){
    const sourceKey = source==='538' ? 'fivethirtyeight' : source;
    const info = misdirections[sourceKey];

    var block = container.append('div').classed('block', true);
    var title = block.append('div').classed('title', true).text(names[source]);
    var element = block.append('div').classed('map', true);
    var map = new d3Kit.GridmapExtra(element[0][0], {
      col: function(d){return +d.x;},
      row: function(d){return +d.y;},
      tileWidth: 21,
      tileHeight: 21,
      fill: function(d){
        return '#f1e5db';
        return color(d.name.length);
      }
    });

    d3.csv('dist/gridmap-layout-usa-'+source+'.csv', function(error, tiles){
      var data = {
        tiles: tiles,
        tileLookup: _.keyBy(tiles, t => t.key),
        quality: qualityBySource[sourceKey]
      };

      map.data(data).resizeToFitMap();
    });
  });
});

(function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
e=o.createElement(i);r=o.getElementsByTagName(i)[0];
e.src='//www.google-analytics.com/analytics.js';
r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
ga('create','UA-59971789-1');ga('send','pageview');
