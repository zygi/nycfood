'use strict';
/*global $:false, d3: false*/

var DISTRICT_PATH = 'data/community_districts.geojson';
var RESTAURANT_POINT_PATH = 'data/restaurants/restaurants.geojson';
var SUBWAY_PATH = 'data/subway_stations.geojson';
var FARMERS_MARKET_PATH = 'data/farmers_market_final.geojson';
var MEDIAN_INCOMES_PATH = 'data/incomes_proc2.geojson';

var projection;
var svg;
var zoom;
var path;
var dataG;

function drawRestaurantHeatmap(dataG, projection, restJson) {
  // var restPath = d3.geo.path()
  //   .projection(projection);
  drawHeatmap(dataG, projection, restJson, '#ff0000');
  // dataG.selectAll('path').data(restJson.features).enter().append('path')
  //     .attr('d', restPath)
  //     .style('fill', 'red')
  //     .style('stroke-width', '0.5')
  //     .style('stroke', 'black')
  //     .attr('opacity', 0.5);
      
}

function drawSubwayNodes(dataG, projection, dataJson) {
  var subwayPath = d3.geo.path()
    .projection(projection);
  
  dataG.append('g').selectAll('path').data(dataJson.features).enter().append('path')
      .attr('d', subwayPath)
      .style('fill', 'blue')
      .style('stroke-width', '1')
      .style('stroke', 'black');

  // drawHeatmap(dataG, projection, dataJson, '#0000ff');
}

function drawFarmersMarketNodes(dataG, projection, dataJson) {
  var path = d3.geo.path()
    .projection(projection);

  dataG.append('g').selectAll('path').data(dataJson.features).enter().append('path')
      .attr('d', path)
      .style('fill', 'yellow')
      .style('stroke-width', '1')
      .style('stroke', 'black');
}

function drawMedianIncomeOverlay(dataG, projection, dataJson) {
  var medInc = d3.geo.path()
    .projection(projection);

    // console.log(err);
  // console.log(medInc.features);
  dataG.append('g').selectAll('path').data(dataJson.features).enter().append('path')
      .attr('d', medInc)
      .style('fill', function(a) {
        return d3.interpolateRgb("#ffffff", "#cccccc")(a.properties.MHI / 60000.0)
      })
      // .style('fill', "white")
      // .style('stroke-width', '1')
      .style('stroke', 'black');
}

function drawStateBoundaries(dataG, _path, projection, dataJson) {
  var path = _path.projection(projection);

  dataG.append('g').selectAll('path').data(dataJson.features).enter().append('path')
      .attr('d', path)
      .style('fill', '#ffffcc')
      .style('stroke-width', '2')
      .style('stroke', 'black');
}

var Data = {
  restaurants: null,
  coarseBoundaries: null,
  census: null,
  farmersMarkets: null,
  subway: null
};

var State = {
  cuisine: null,
  dataset: null
}

window.loaded = false;

window.redrawThings = function(params) {
  if ("cuisine" in params) {
    State.cuisine = params.cuisine
  }
  if ("dataset" in params) {
    State.dataset = params.dataset
  }
  
  console.log(State);
  
  dataG.selectAll('g').remove();
  
  drawStateBoundaries(dataG, path, projection, Data.coarseBoundaries);
  drawMedianIncomeOverlay(dataG, projection, Data.census);
  drawRestaurantHeatmap(dataG, projection, Data.restaurants);
}

function zoomed() {
  // console.log(zoom.scale());
  // projection
  //   .translate(zoom.translate())
  //   .scale(zoom.scale());
  dataG.attr('transform', 'translate(' + zoom.translate() + ')scale(' + zoom.scale() + ')');
  // dataG.selectAll('g').selectAll('path')
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

  d3.json(DISTRICT_PATH, function(districtJson) {
    // centering approach taken from
    // https://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object

    var center = d3.geo.centroid(districtJson);
    var scale  = 100000;
    var offset = [width/2, height/2];
    projection = d3.geo.mercator().scale(scale).center(center)
        .translate(offset);

    path = d3.geo.path()
      .projection(projection);

    var bounds  = path.bounds(districtJson);
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

    
    d3.json(RESTAURANT_POINT_PATH, function(restJson) {
      d3.json(SUBWAY_PATH, function(subwayJson) {
        d3.json(FARMERS_MARKET_PATH, function(farmersMarketJson) {
          d3.json(MEDIAN_INCOMES_PATH, function(medIncJson) {
            Data.restaurants = restJson;
            Data.subway = subwayJson;
            Data.census = medIncJson;
            Data.farmersMarkets = farmersMarketJson;
            Data.coarseBoundaries = districtJson;
            window.loaded = true;
            // drawSubwayNodes(dataG, projection, subwayJson);
            // drawFarmersMarketNodes(dataG, projection, farmersMarketJson)
          });
        });
      });
    });
  });
}


$(function(){
  setupMap();
});
