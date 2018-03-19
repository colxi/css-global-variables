// on document ready...
document.addEventListener('DOMContentLoaded', function(){
	// ...attach click event to te body
	document.body.addEventListener('click', function(){
		/* Generate and assign random color */
		cssVar.primaryColor = '#'+Math.random().toString(16).substr(-6);
		/* Generate and assign random size, betwen 15 and 45 */
		cssVar.textSize = Math.floor( Math.random()*30+15 );
	})
} , false);

