// var cuisineTypes = ['Restaurants', 'Income', 'Property Value', 'Subway Stops'];
var cuisineTypes = ['Chinese', 'Japanese', 'Vietnamese', 'Thai', 'Korean',
					'American', 'Italian', 'Southern','Soul Food','Cajun', 'Jamaican',
					'Irish','Scottish','English','Pub Food','Fast Food', 'African',
					'Cuban','German','Other'];

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
}

var activateDataset = function(name) {
	var dsets = document.getElementsByClassName("dataset");
	for (var i=0; i<dsets.length; i++) {
		if (dsets.item(i).innerHTML.indexOf(name) > -1) {
			dsets.item(i).previousSibling.className = 'checkbox check is-checked';
		}
	}
}

var main = function() {

	for (var i=0; i<cuisineTypes.length; i++) {
		$('.cuisine-panel').append('<a class="cuisine" href="#"><p>'+cuisineTypes[i]+'</p></a>');
	}


	$('.cuisine-panel > a').click(function() {
		var chosen = document.getElementsByClassName("cuisine active");
		var numChosen = chosen.length;

		if (!$(this).hasClass('active')) {
			if (numChosen < 1) {$(this).addClass('active');}
			else {alert("Oops! You can only choose one cuisine type for now.");} //TODO
		} else {
			$(this).removeClass('active');
		}
	});

	$('.checkbox').click(function() {
		var checks = document.getElementsByClassName("checkbox is-checked");
		var numChecked = checks.length;
		if (!$(this).hasClass('is-checked')) {
			if (numChecked < 1) {$(this).toggleClass('is-checked');}
			else {alert("Oops! You can only choose one extra dataset for now.");} //TODO
		} else {
			$(this).removeClass('is-checked');
		}
	});

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

	$('#welcome-hide').click(function() {
		hideWelcome();
	});

	$('#fast-food-preset').click(function() {
		activateCuisine('Fast Food');
		activateDataset('Property Value');
		hideWelcome();
	});

	$('#italian-preset').click(function() {
		activateCuisine('Italian');
		activateDataset('Neighborhoods');
		hideWelcome();
	});

	$('#scratch-preset').click(function() {
		hideWelcome();
	});
}

$(document).ready(main());
