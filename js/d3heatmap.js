'use strict';
/*global $:false, d3: false*/

/* Array.filter polyfill, taken from
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter */
if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun/*, thisArg*/) {
    'use strict';

    if (this === void 0 || this === null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t) {
        var val = t[i];

        // NOTE: Technically this should Object.defineProperty at
        //       the next index, as push can be affected by
        //       properties on Object.prototype and Array.prototype.
        //       But that method's new, and collisions should be
        //       rare, so use the more-compatible alternative.
        if (fun.call(thisArg, val, i, t)) {
          res.push(val);
        }
      }
    }

    return res;
  };
}

var cellSizeX = 0.002;
var cellSizeY = 0.002;

var leftXBound = -74.268;
var rightXBound = -73.70;
var topYBound = 40.966;
var bottomYBound = 40.490;

var wi = rightXBound - leftXBound;
var he = topYBound - bottomYBound;

var xCells = Math.ceil(wi / cellSizeX);
var yCells =  Math.ceil(he / cellSizeY);

function insertToBin(bins, binX, binY, value) {
  if(!(binX in bins)) { bins[binX] = {}; }
  if(!(binY in bins[binX])) { bins[binX][binY] = []; }
  bins[binX][binY].push(value);
}

function countPoints(json) {
  var elems = json.features;
  var bins = {};

  for (var i = 0; i < elems.length; i++) {
    var e = elems[i];
    var coords = e.geometry.coordinates;
    var xCell = Math.round((coords[0] - leftXBound) / cellSizeX);
    var yCell = Math.round((coords[1] - bottomYBound) / cellSizeY);
    insertToBin(bins, xCell, yCell, true);
  }

  return bins;
}

function drawHeatmap(group, proj, oldJson, color, filterBy) {
  console.log(filterBy)
  var json = {
    type: 'FeatureCollection',
    features: oldJson.features.filter(function(e) {
      if ('All' in filterBy) { return true; }
      return (e.properties.cuisine in filterBy);
    })
  };
  var bins = countPoints(json);

  var max = 0;
  for (var cX = 0; cX < xCells; cX++) {
    for (var cY = 0; cY < yCells; cY++) {
      if (cX in bins && cY in bins[cX] && bins[cX][cY].length > max) {
        max = bins[cX][cY].length;
      }
    }
  }

  var heatmapGraph = group.append('g');

  for (var cX = 0; cX < xCells; cX++) {
    for (var cY = 0; cY < yCells; cY++) {
      var count = 0;
      if (cX in bins && cY in bins[cX]) {
        count = bins[cX][cY].length;
      }

      if (count === 0) continue;

      // var color = d3.interpolateRgb('#ffffff', '#cc0000')(count*1.0 / max*1.0);

      var x = leftXBound + cX * cellSizeX;
      var y = bottomYBound + cY * cellSizeY;

      var tPos = proj([x, y]);

      var x1 = leftXBound + (cX+1) * cellSizeX;
      var y1 = bottomYBound + (cY+1) * cellSizeY;

      var tNewPos = proj([x1, y1]);

      // heatmapGraph.append('rect').
      // attr('x', tPos[0]).
      // attr('y', tPos[1]).
      // attr('width', tNewPos[0] - tPos[0]).
      // attr('height', tPos[1] - tNewPos[1]).
      // attr('fill', color).
      // attr('opacity', d3.interpolateNumber(0.3, 1.0)(count*1.0 / max));

      heatmapGraph.
      append('circle').
      attr('cx', tPos[0]).
      attr('cy', tPos[1]).
      attr('r', (tNewPos[0] - tPos[0])).
      attr('fill', color).
      attr('opacity', d3.interpolateNumber(0.3, 1.0)(count*1.0 / max));

      // heatmapGraph.append('circle').
      // attr('cx', tPos[0]).
      // attr('cy', tPos[1]).
      // attr('r', (tNewPos[0] - tPos[0])/ 2).
      // attr('fill', color).
      // attr('opacity', d3.interpolateNumber(0.2, 0.6)(count*1.0 / max));

    }
  }
}
