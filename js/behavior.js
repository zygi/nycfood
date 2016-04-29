var cuisineTypes = ['Chinese','Vietnamese','Japanese','Korean','Thai','American','Southern',
					'Barbecue','Soul Food','Cajun','Jamaican','Irish','Scottish','English',
					'Diner Food','Pub Food','Americana','Continental','African'];

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
}

$(document).ready(main());