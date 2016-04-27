'use strict';
/*global $:false, d3: false*/

var DISTRICT_PATH = 'data/community_districts.geojson';
var RESTAURANT_POINT_PATH = 'data/restaurants/restaurants.geojson';

var projection;
var svg;
var zoom;
var path;
var dataG;

function zoomed() {
  // console.log(zoom.scale());
  // projection
  //   .translate(zoom.translate())
  //   .scale(zoom.scale());
  dataG.attr('transform', 'translate(' + zoom.translate() + ')scale(' + zoom.scale() + ')');
  // dataG.selectAll('path')
  //     .attr('d', path);
}

function setupMap() {
  // remove all existing maps for cleanup

  $('svg').remove();

  var width = $('#map').width();
  var height = $('#map').height();

  svg = d3.select($('#map')[0])
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  dataG = svg.append('g');

  d3.json(DISTRICT_PATH, function(json) {
    // centering approach taken from
    // https://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object

    var center = d3.geo.centroid(json);
    var scale  = 100000;
    var offset = [width/2, height/2];
    projection = d3.geo.mercator().scale(scale).center(center)
        .translate(offset);

    path = d3.geo.path()
      .projection(projection);

    var bounds  = path.bounds(json);
    var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
    var vscale  = scale*height / (bounds[1][1] - bounds[0][1]);
    scale   = (hscale < vscale) ? hscale : vscale;
    scale /= 1.2;
    offset  = [width - (bounds[0][0] + bounds[1][0])/2,
                      height - (bounds[0][1] + bounds[1][1])/2];

    zoom = d3.behavior.zoom()
        // .translate([width / 2, height / 2])
        // .scale(scale)
        // .scaleExtent([scale, 20 * scale])
        .scaleExtent([1, 20])
        .on('zoom', zoomed);

    svg
      .call(zoom)
      .call(zoom.event);

    // new projection
    projection = d3.geo.mercator().center(center)
      .scale(scale).translate(offset);
    path = path.projection(projection);

    // svg.append('rect').attr('width', width).attr('height', height)
    //         .style('stroke', 'black').style('fill', 'red');
    // svg.append("rect").attr('width', width).attr('height', height)
    //     .style('stroke', 'black').style('fill', 'red');

    dataG.selectAll('path').data(json.features).enter().append('path')
        .attr('d', path)
        .style('fill', 'red')
        .style('stroke-width', '2')
        .style('stroke', 'black');

    d3.json(RESTAURANT_POINT_PATH, function(restJson) {
      var restPath = d3.geo.path()
        .projection(projection);

      dataG.selectAll('path').data(restJson.features).enter().append('path')
          .attr('d', restPath)
          .style('fill', 'white')
          .style('stroke-width', '1')
          .style('stroke', 'black');
    });
  });
}


$(function(){
  setupMap();
});
