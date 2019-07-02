import {CSSGlobalVariables} from '../src/css-global-variables.js';

let output = document.getElementById('output');

function write(msg){
    let line = document.createElement('div');
    line.innerHTML = msg || '&nbsp';
    output.appendChild(line);
    console.log(msg || '')
}

function out(msg){ write(msg) } 
function warn(msg){ write(msg) } 


// TEST 1
out('- Test : Constructor -> requires "new" keyword')
try{ 
    CSSGlobalVariables();
    warn('FAIL')
 }
catch(e){ out('PASS')}
out();


// TEST 2
out('- Test : Configuration -> disable autoPrefix')
let a = new CSSGlobalVariables( {autoprefix : false} );
try{ 
    a.primaryColor = 'red';
    warn('FAIL')
}
catch(e){ out('PASS')}
out();


// TEST 3
out('- Test : Configuration -> filter CSS elements (.local-1)')
let b = new CSSGlobalVariables( {filter : '.local-1'} );
if( Object.keys( b ).length !== 3 || !b.primaryColor ) warn('FAIL (Expecting 3 items )')
else out('PASS')
out();


// TEST 4
out('- Test : Configuration -> filter CSS elements (.local-2)')
let c = new CSSGlobalVariables( {filter : '.local-2'} );
if( Object.keys( c ).length !== 1 || !c.secondaryColor ) warn('FAIL (Expecting 1 item)')
else out('PASS')
out();


// TEST 5
out('- Test : Configuration -> use normalize function (invertCase)')
let invertCase = n=> n.replace(/\w{1}/g, val=> val === val.toLowerCase() ? val.toUpperCase() : val.toLowerCase() ); 
let d = new CSSGlobalVariables( {normalize : invertCase} );
if( !d.PRIMARYcOLOR ) warn('FAIL ( d.PRIMARYcOLOR does not translate to d.primaryColor )')
else out('PASS')
out();
