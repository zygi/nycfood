var cuisineTypes = ['Restaurants', 'Income', 'Property Value', 'Subway Stops'];

var main = function() {

	for (var i=0; i<cuisineTypes.length; i++) {
		$('.cuisine-panel').append('<a href="#"><p>'+cuisineTypes[i]+'</p></a>');
	}


	$('.cuisine-panel > a').click(function() {
		console.log("CUISINE CHOSEN");
		if (!$(this).hasClass('active')) {
			$(this).addClass('active');
		} else {
			$(this).removeClass('active');
		}

	});

	$('.checkbox').click(function() {
		$(this).toggleClass('is-checked');
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
