
import {CSSGlobalVariables} from '../src/css-global-variables.js';

let output = document.getElementById('output');

function write(msg){
    let line = document.createElement('div');
    line.innerHTML = msg || '&nbsp';
    output.appendChild(line);
    console.log(msg || '');
}

function out(msg){ write(msg) } 
function warn(msg){ write(msg) } 


// TEST 0
out('- Test : Constructor -> requires "new" keyword');
try{ 
    CSSGlobalVariables();
    warn('FAIL');
}
catch(e){ out('PASS')}
out();


// TEST 1
out('- Test : Configuration -> disable autoPrefix');
let t1 = new CSSGlobalVariables( {autoprefix : false} );
try{ 
    t1.primaryColor = 'red';
    warn('FAIL');
}
catch(e){ out('PASS') }
out();


// TEST 2
out('- Test : Configuration -> filter CSS elements (.local-1)');
let t2 = new CSSGlobalVariables( {filter : '.local-1'} );
if( Object.keys( t2 ).length !== 3 || !t2.primaryColor ) warn('FAIL (Expecting 3 items )');
else out('PASS');
out();


// TEST 3
out('- Test : Configuration -> filter CSS elements (.local-2)');
let t3 = new CSSGlobalVariables( {filter : '.local-2'} );
if( Object.keys( t3 ).length !== 1 || !t3.secondaryColor ) warn('FAIL (Expecting 1 item)');
else out('PASS');
out();


// TEST 4
out('- Test : Configuration -> use normalize function (invertCase)');
let invertCase = n=> n.replace(/\w{1}/g, val=> val === val.toLowerCase() ? val.toUpperCase() : val.toLowerCase() ); 
let t4 = new CSSGlobalVariables( {normalize : invertCase} );
if( !t4.PRIMARYcOLOR ) warn('FAIL ( t4.PRIMARYcOLOR does not translate to t4.primaryColor )');
else out('PASS');
out();


// TEST 5
out('- Test : CORS -> Use "crossorigin"="anonymous" attribute');
new Promise((resolve) => {
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.className= 'remote';
    link.setAttribute( 'crossorigin', 'anonymous' ) ;
    link.onload = resolve;
    link.href = 'https://colxi.info/css-global-variables/test/test-remote.css';
    document.head.appendChild(link);
}).then( ()=>{ 
    let t5 = new CSSGlobalVariables();
    if( !t5.remoteProp ) warn('FAIL ( cannot find t5.remoteProp )');
    else out('PASS');
    console.log(t5)
});

