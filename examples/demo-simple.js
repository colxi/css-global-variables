/* Globals declaration for Linter */
/* globals CSSGlobalVariables     */

document.addEventListener('DOMContentLoaded', function(){
    let cssVar = new CSSGlobalVariables();
    // ...attach click event to te body
    setInterval(function(){
        /* Generate and assign random color */
        cssVar.primaryColor = '#'+Math.random().toString(16).substr(-6);
        /* Generate and assign random size, betwen 15 and 45 */
        cssVar.textSize = Math.floor( Math.random()*30+15 );
    },50);
} , false);


