(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("d3"), require("d3Kit"));
	else if(typeof define === 'function' && define.amd)
		define(["d3", "d3Kit"], factory);
	else if(typeof exports === 'object')
		exports["d3Kit"] = factory(require("d3"), require("d3Kit"));
	else
		root["d3Kit"] = factory(root["d3"], root["d3Kit"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var d3 = __webpack_require__(1);
	var d3Kit = __webpack_require__(2);

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

	d3Kit.Gridmap = d3Kit.factory.createChart(DEFAULT_OPTIONS, CUSTOM_EVENTS,
	function constructor(skeleton){
	  // alias
	  var options = skeleton.options();
	  var dispatch = skeleton.getDispatcher();
	  var layers = skeleton.getLayerOrganizer();

	  dispatch.on('resize',  visualize);
	  dispatch.on('options', visualize);
	  dispatch.on('data', visualize);

	  layers.create(['tile']);

	  function visualize(){
	    if(!skeleton.hasData()){
	      layers.get('tile').selectAll('g').remove();
	      return;
	    }

	    var data = skeleton.data();

	    var selection = layers.get('tile').selectAll('g')
	        .data(data, options.keyFn);

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
	        return 'translate('+(options.col(d)*options.tileWidth)+','+(options.row(d)*options.tileHeight)+')';}
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
	        return 'translate('+(options.col(d)*options.tileWidth)+','+(options.row(d)*options.tileHeight)+')';}
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

	  function resizeToFitMap(){
	    if(!skeleton.hasData()){
	      layers.get('tile').selectAll('g').remove();
	      return;
	    }

	    var data = skeleton.data();

	    var maxCol = d3.max(data, options.col) + 1;
	    var maxRow = d3.max(data, options.row) + 1;
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

	module.exports = d3Kit;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }
/******/ ])
});
;