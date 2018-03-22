// on document ready...
let cssVar;
document.addEventListener('DOMContentLoaded', function(){
	cssVar = new CSSGlobalVariables();
	// ...attach click event to te body
	setInterval(function(){
		/* Generate and assign random color */
		cssVar.primaryColor = '#'+Math.random().toString(16).substr(-6);
		/* Generate and assign random size, betwen 15 and 45 */
		cssVar.textSize = Math.floor( Math.random()*30+15 );
	},50);
} , false);

