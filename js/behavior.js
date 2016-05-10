// var cuisineTypes = ['Restaurants', 'Income', 'Property Value', 'Subway Stops'];
var cuisineTypes = ['Chinese', 'Japanese', 'Vietnamese', 'Thai', 'Korean',
					'American','Southern','Soul Food','Cajun', 'Jamaican',
					'Irish','Scottish','English','Pub Food','Fast Food', 'African',
					'Cuban','German','Other'];

var main = function() {

	for (var i=0; i<cuisineTypes.length; i++) {
		$('.cuisine-panel').append('<a class="cuisine" href="#"><p>'+cuisineTypes[i]+'</p></a>');
	}


	$('.cuisine-panel > a').click(function() {
		console.log("CUISINE CHOSEN");
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
		$('#map').css('opacity','0.05');
		$('#right').css('opacity','0.05');
		$('.filter-help-panel').show();
	});

	$('#filter-help-hide').click(function() {
		$('.filter-help-panel').hide();
		$('#map').css('opacity','1.0');
		$('#right').css('opacity','1.0');
	});

}

$(document).ready(main());
