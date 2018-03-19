![](https://img.shields.io/badge/cdn-cdn.rawgit-green.svg)
![](https://img.shields.io/badge/Javascript-ES6-orange.svg)
![](https://img.shields.io/badge/markup-CSS3-blue.svg)

# css-var : CSS3 Variables Manipulation with JS (ES6)
The `cssVar` helper provides easy manipulation of your **GLOBAL (:root) CSS3 variables**, simplifying the templating related scenarios & tasks, through a natural interface:

```javascript
// set the CSS global --myVariableName value  to "myVariableNewValue"
cssVar.myVariableName = "myVariableNewValue";
```

## Features:
- All your CSS global (:root selector) **variables are stored in the cssVar Object as properties**. Any change on them will be instantly reflected into the CSS realm.
- **The `--` variable name prefix , is not required** when setting or getting variables using `cssVar`. It is included automatically by the library when not explicitly set. This provides a more **natural & fast coding** experience. (However is still required on the CSS realm)
- Automagically **detects any new CSS attachment** in the document, performed after the initial load.

## Limitations :
- `cssVar` only operates with Global (:root) CSS Variables. Any definition/overwritting done inside another CSS selector will not be detected, and could affect the proper behavior of cssVar.
- When `cssVar` library is loaded into the document, can generate a small delay, if the document has extensive CSS definitions.

## Installation :

1- Clone the repository locally, and attach the library to your Html document
 ```html
<script src="path/to/css-var.js"></script>
```

2- Use the online delivery network
 ```html
<script src="https://cdn.rawgit.com/colxi/css-var/master/css-var.js"></script>
```

3- Install it using npm and dynamically import it. (unsafe! Not available in all browsers)
 ```bash
$ npm install css-var-helper
```
```javascript
import("./css-var.js")
```

Once he library is attached/imported with any of the previous methods, the global Object `cssVar` will be available, and ready for usage!

## Usage
The `cssVar` Object behaves as a regular Js Object.  Any regular Object operation can be performed in `cssvar`. We are going to focus here, only in the most useful and interesting ones : **enumeration , getters , setters**

**Enumerate** all declared CSS3 global variables iterating the cssVar Object :
```javascript
for(let v in cssVar){
    if ( cssVar.hasOwnProperty(v) ) console.log(v);
}
```
**Set** a new value to a  CSS3 Global variabe :
```javascript
/* The following assigments behave equally, and are all valid */
cssVar.myVariable = 'newValue';
cssVar['myVariable'] = 'newValue';
cssVar['--myVariable'] = 'newValue';
```
**Get** the value of a CSS3 Global variabe :
```javascript
/* The following value retrievals behave equally, and are all valid */
console.log( cssVar.myVariable );
console.log( cssVar['myVariable'] );
console.log( cssVar['--myVariable'] );
```

### Example
The following example (available in ./demo), randomizes the background color, and the font size, each time receives a click.
You can test it [here](https://colxi.github.io/css-var/demo/)

style.css
```css
:root{
    /* declaration of some CSS3 global variables */
    --primaryColor : #F2A2BB;
    --textSize : 12;
}

body{
    /* Body background color will be set by the CSS variable --primaryColor */
    background-color: var(--primaryColor);
    /* Some extra styling ... */
    text-align:center;
    margin: 0;
    height: 100%;
    cursor:pointer;
}

div{
    /* The size of the text is set by --textSize */
    /* Trick : Multiplying * 1px the value of th var, will add the needd "px" sufix */
    font-size: calc( var(--textSize) * 1px );
    /* Some extra styling ... */
    position: relative;
    top: 50%;
}
```

demo.js
```javascript
// on document ready...
document.addEventListener('DOMContentLoaded', function(){
    // ...attach click event to te body
    document.body.addEventListener('click', function(){
        /* Generate and assign random color */
	cssVar.primaryColor = '#'+Math.random().toString(16).substr(-6);
	/* Generate and assign random size, betwen 15 and 45 */
	cssVar.textSize = Math.floor( Math.random()*30 + 15 );
    })
} , false);
```

index.html
```html
<html>
    <head>
         <script src="https://cdn.rawgit.com/colxi/css-var/master/css-var.js"></script>
         <link rel="stylesheet" href="./style.css" />
         <script src="./demo.js"></script>
    </head>
     <body>
        <div>Randomize!</div>
     </body>
 <html>
 ```
