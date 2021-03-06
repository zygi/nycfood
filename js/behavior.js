// var cuisineTypes = ['Restaurants', 'Income', 'Property Value', 'Subway Stops'];
var cuisineTypes = ['All', 'Ice Cream','Mexican','Cafe','Latin',
'Sandwiches','Pizza','Japanese','Spanish','Italian','Chinese',
'Chicken','French','Donuts','Bakery','American',
'Delicatessen','Caribbean','Other','Unknown'];

window.hideLoading = function() {
	$(".loader-wrapper").fadeOut();
	$('.welcome-panel').fadeIn();
}

var hideWelcome = function() {
	$('.welcome-panel').hide();
	$('#map').removeClass('faded');
	$('#right').removeClass('faded');
}

var activateCuisine = function(name) {
	var cuisines = document.getElementsByClassName("cuisine");
	for (var i=0; i<cuisines.length; i++) {
		if (cuisines.item(i).firstChild.innerHTML == name) {
			cuisines.item(i).className = 'cuisine active';
		}
	}
	window.redrawThings({
		cuisine: name,
		add: true
	});
}

var activateDataset = function(name) {
	var dsets = document.getElementsByClassName("dataset");
	for (var i=0; i<dsets.length; i++) {
		if (dsets.item(i).innerHTML.indexOf(name) > -1) {
			dsets.item(i).previousSibling.className = 'checkbox check is-checked';
		}
	}
	window.redrawThings({
		dataset: name,
		add: true
	});
}

var main = function() {

	// INITIALIZE CUISINE CHOICES

	for (var i=0; i<cuisineTypes.length; i++) {
		$('.cuisine-panel').append('<a class="cuisine" href="#"><p>'+cuisineTypes[i]+'</p></a>');
	}

	// FILTER PANEL

	$('.cuisine-panel > a').click(function() {
		var chosen = document.getElementsByClassName("cuisine active");
		var numChosen = chosen.length;

		if (!$(this).hasClass('active')) { //selecting an item
			// if (numChosen >= 1) { //switch selection
			// 	for (var i=0; i<chosen.length; i++) {
			// 		if (chosen.item(i).className.indexOf('active') > -1) {
			// 			chosen.item(i).className = 'cuisine';
			// 		}
			// 	}
			// };
			$(this).addClass('active')
			window.redrawThings({
				cuisine: $(this).text(),
				add: true
			});
			// activateDataset(chosen.innerHTML);
		} else { //deselecting an item
			$(this).removeClass('active');
			window.redrawThings({
				cuisine: $(this).text(),
				remove: true
			});
		}
	});

	$('.checkbox').click(function() {
		var checks = document.getElementsByClassName("checkbox is-checked");
		var numChecked = checks.length;
		if (!$(this).hasClass('is-checked')) { //selecting an item
			if (numChecked >= 1) { //switch selection
				for (var i=0; i<checks.length; i++) {
					if (checks.item(i).className.indexOf('is-checked') > -1) {
						checks.item(i).className = 'checkbox check';
					}
				}
			}
			$(this).toggleClass('is-checked');
			window.redrawThings({
				dataset: $(this).next("p").clone().children().remove().end().text()
			});
		} else { //deselecting an item
			$(this).removeClass('is-checked');
			window.redrawThings({
				dataset: null
			});
		}
	});

	// HELP PANELS

	$('#filter-help').click(function() {
		$('#map').addClass('faded');
		$('#right').addClass('faded');
		$('.filter-help-panel').show();
	});
	$('#filter-help-hide').click(function() {
		$('.filter-help-panel').hide();
		$('#map').removeClass('faded');
		$('#right').removeClass('faded');
	});

	$('#map-help').click(function() {
		$('#map').addClass('faded');
		$('#right').addClass('faded');
		$('.map-help-panel').show();
	});
	$('#map-help-hide').click(function() {
		$('.map-help-panel').hide();
		$('#map').removeClass('faded');
		$('#right').removeClass('faded');
	});

	// WELCOME PANEL

	$('#fast-food-preset').click(function() {
		activateCuisine('Chicken');
		activateCuisine('Pizza');
		activateCuisine('Donuts');
		activateCuisine('Sandwiches');
		activateDataset('Property Value');
		hideWelcome();
	});

	$('#italian-preset').click(function() {
		activateCuisine('Cafe');
		activateDataset('Subway Stops');
		hideWelcome();
	});

	$('#scratch-preset').click(function() {
		window.redrawThings({});
		hideWelcome();
	});
}

$(document).ready(main());
