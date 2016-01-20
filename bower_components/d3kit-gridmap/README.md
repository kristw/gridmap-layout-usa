**Introduction** |
[Demo](https://kristw.github.io/d3kit-gridmap/) |
[API Reference](https://github.com/kristw/d3kit-gridmap/blob/master/docs/api.md)

# d3Kit-gridmap

A tile grid map component built on top of d3Kit

<p align="center">
  <a href="http://kristw.github.io/d3kit-gridmap/" style="width:100%;">
    <img src="examples/thumbnail.png">
  </a>
</p>

### Install

```
npm install d3kit-gridmap --save
```

or

```
bower install d3kit-gridmap --save
```

### Example Usage

For example, to draw a grid map of the US, create a grid map component and pass [gridmap-layout-usa](https://github.com/kristw/gridmap-layout-usa) as the layout. View source of this [demo](https://kristw.github.io/d3kit-gridmap/) for example.

```javascript
var chart = new d3Kit.Gridmap('#usa', {
  col: function(d){return d.x;},
  row: function(d){return d.y;},
  fill: function(d){return color(d.name.length);}
})
  .data(gridmapLayoutUsa)
  .resizeToFitMap();
```

For more detailed usage please refer to the [API Reference](https://github.com/kristw/d3kit-gridmap/blob/master/docs/api.md).

### Layout

d3Kit-gridmap does not come with layout, which is an Array of tiles and their positions, which make it can be reused for a map of any region or country.

The layout has to be passed to the chart by calling `chart.data(layout)` for this component to show something on the screen.

In the simplest way, you can just pass a custom Array as your own layout.

```
chart.data([
  {key: 'region1', col: 1, row 2},
  {key: 'region2', col: 1, row 3},
  ...
]);
```

Or use these available layouts:

- [gridmap-layout-usa](https://github.com/kristw/gridmap-layout-usa)
- [gridmap-layout-thailand](https://github.com/kristw/gridmap-layout-thailand)

### Import into your project

##### Choice 1. Global

Adding this library via ```<script>``` tag is the simplest way. By doing this, ```d3Kit.Gridmap``` is available in the global scope.

```html
<script src="bower_components/d3/d3.min.js"></script>
<script src="bower_components/d3kit/dist/d3kit.min.js"></script>
<script src="bower_components/d3kit-gridmap/dist/d3kit-gridmap.min.js"></script>
```

##### Choice 2: AMD

If you use requirejs, this library support AMD out of the box.

```javascript
require.config({
  paths: {
    d3:    'path/to/d3',
    d3kit: 'path/to/d3kit',
    'd3kit-gridmap': 'path/to/d3kit-gridmap'
  }
});
require(['d3kit-gridmap'], function(d3Kit) {
  // do something with d3Kit.Gridmap
});
```

This module will be available as ```d3Kit.Gridmap```.

##### Choice 3: node.js / browserify

This library also supports usage in commonjs style.

```javascript
var d3Kit = require('d3kit-gridmap');
// do something with d3Kit.Gridmap
```

This module will be available as ```d3Kit.Gridmap```.

### Author

Krist Wongsuphasawat / [@kristw](https://twitter.com/kristw)

Copyright 2016 Krist Wongsuphasawat.
Licensed under the [Apache License Version 2.0](http://www.apache.org/licenses/LICENSE-2.0)