'use strict';
/*global $:false, d3: false*/

var DISTRICT_PATH = 'data/community_districts.geojson';
var RESTAURANT_POINT_PATH = 'data/restaurants/restaurants_with_cats.geojson';
var SUBWAY_PATH = 'data/subway_stations.geojson';
var NEIGHBORHOOD_NAME_PATH = 'data/neighborhood_names.geojson';
var FARMERS_MARKET_PATH = 'data/farmers_market_final.geojson';
var MEDIAN_INCOMES_PATH = 'data/incomes_proc2.geojson';

var projection;
var svg;
var zoom;
var path;
var dataG;

function drawRestaurantHeatmap(dataG, projection, restJson) {
  drawHeatmap(dataG, projection, restJson, '#ff0000', State.cuisine);
}

function drawSubwayNodes(dataG, projection) {
  var subwayPath = d3.geo.path()
    .projection(projection)
    .pointRadius(function(d) { return 2; });

  dataG.append('g').selectAll('path').data(Data.subway.features).enter().append('path')
      .attr('d', subwayPath)
      .style('fill', 'blue')
      .style('stroke-width', '0.5')
      .style('stroke', 'black');

  // drawHeatmap(dataG, projection, dataJson, '#0000ff');
}

function drawFarmersMarketNodes(dataG, projection) {
  var path = d3.geo.path()
    .projection(projection)
    .pointRadius(function(d) { return 2; });

  dataG.append('g').selectAll('path').data(Data.farmersMarkets.features).enter().append('path')
      .attr('d', path)
      .style('fill', 'blue')
      .style('stroke-width', '0.5')
      .style('stroke', 'black');
}

function drawMedianIncomeOverlay(dataG, projection) {
  var medInc = d3.geo.path()
    .projection(projection);

  var vals = Data.census.features.map(function(a) {return a.properties.MHI;}).filter(function(a) {return a > 0});
  var max = 60000//Math.max.apply(Math, vals);
  var min = Math.min.apply(Math, vals);
  dataG.append('g').selectAll('path').data(Data.census.features).enter().append('path')
      .attr('d', medInc)
      .style('fill', function(a) {
        return d3.interpolateRgb("#ffffff", "#cccccc")((a.properties.MHI - min) / (max - min))
      })
      .style('stroke', 'black');
}

function drawNeighborhoods(dataG, projection) {
  var mypath = d3.geo.path()
    .projection(projection);
  dataG.append('g').selectAll('.label').data(Data.neighborhoods.features).enter()
          .append('svg:text')
          // .attr('d', mypath)
          .attr("class", "halo")
          .attr("transform", function (d) { return "translate(" + mypath.centroid(d) + ")rotate(30)"; })
          .style('text-anchor', 'middle')
          .attr('font-size', '5pt')
          .text(function(d) {
              return d.properties.name
          });
}

function drawPropertyValueOverlay(dataG, projection) {
  var medInc = d3.geo.path()
    .projection(projection);

  var vals = Data.census.features.map(function(a) {return a.properties.MED_VAL;}).filter(function(a) {return a > 0});
  var max = Math.max.apply(Math, vals) / 2.5;
  var min = Math.min.apply(Math, vals);
  dataG.append('g').selectAll('path').data(Data.census.features).enter().append('path')
      .attr('d', medInc)
      .style('fill', function(a) {
        return d3.interpolateRgb("#ffffff", "#cccccc")((a.properties.MED_VAL - min) / (max - min))
      })
      .style('stroke', 'black');
}

function drawStateBoundaries(dataG, _path, projection) {
  var medInc = d3.geo.path()
    .projection(projection);

  dataG.append('g').selectAll('path').data(Data.census.features).enter().append('path')
      .attr('d', medInc)
      .style('fill', "transparent")
      .style('stroke', 'black');
}

var Data = {
  restaurants: null,
  coarseBoundaries: null,
  census: null,
  farmersMarkets: null,
  subway: null,
  neighborhoods: null
};

var State = {
  cuisine: {},
  dataset: null
}

window.loaded = false;

window.redrawThings = function(params) {
  if ('cuisine' in params && params.add) {
    State.cuisine[params.cuisine] = true;
  } else if ('cuisine' in params && params.remove) {
    delete State.cuisine[params.cuisine];
  }
  if ("dataset" in params) {
    State.dataset = params.dataset
  }

  console.log(State);

  dataG.selectAll('g').remove();

  drawStateBoundaries(dataG, path, projection, Data.coarseBoundaries);

  if (State.dataset && State.dataset.trim() == "Farmer's Markets".trim()) {
    drawFarmersMarketNodes(dataG, projection)
  } else if (State.dataset && State.dataset.trim() == "Subway Stops".trim()) {
    drawSubwayNodes(dataG, projection)
  } else if (State.dataset && State.dataset.trim() == "Income ".trim()) {
    drawMedianIncomeOverlay(dataG, projection)
  } else if (State.dataset && State.dataset.trim() == "Property Value ".trim()) {
    drawPropertyValueOverlay(dataG, projection)
  } else if (State.dataset && State.dataset.trim() == "Neighborhoods".trim()) {
    drawNeighborhoods(dataG, projection)
  }



  if (!jQuery.isEmptyObject(State.cuisine)) {
    drawRestaurantHeatmap(dataG, projection, Data.restaurants);
  }
}

function zoomed() {
  dataG.attr('transform', 'translate(' + zoom.translate() + ')scale(' + (zoom.scale()) + ')rotate(-30)');
}

function setupMap() {
  // remove all existing maps for cleanup

  $('svg').remove();

  var width = $('#map').width();
  var height = $('#map').height() - 30;name

  svg = d3.select($('#map')[0])
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('margin-top', '15px');

  dataG = svg.append('g');

  d3.json(DISTRICT_PATH, function(districtJson) {
    // centering approach taken from
    // https://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object

    var center = d3.geo.centroid(districtJson);
    var scale  = 100000;
    var offset = [width, height * 2 / 3.0];
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
        .scale(2.5)
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
            d3.json(NEIGHBORHOOD_NAME_PATH, function(neighbJson) {
              Data.restaurants = restJson;
              Data.subway = subwayJson;
              Data.census = medIncJson;
              Data.farmersMarkets = farmersMarketJson;
              Data.coarseBoundaries = districtJson;
              Data.neighborhoods = neighbJson;
              window.loaded = true;
              window.hideLoading();
              // drawSubwayNodes(dataG, projection, subwayJson);
              // drawFarmersMarketNodes(dataG, projection, farmersMarketJson)
            });
          });
        });
      });
    });
  });
}


$(function(){
  setupMap();
});
