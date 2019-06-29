import {CSSGlobalVariables} from '../src/css-global-variables.js';
let cssVar = new CSSGlobalVariables();

setInterval(function(){
    /* Randomize color , size and rotation */
    cssVar.primaryColor = '#'+Math.random().toString(16).substr(-6);
    cssVar.textSize = Math.floor( Math.random()*30+15 );
    cssVar.rotation = Math.floor( Math.random()*360 )+'deg';
},500);
