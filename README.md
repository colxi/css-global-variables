![](https://img.shields.io/badge/cdn-cdn.rawgit-green.svg)


# css-var : CSS3 Variables Manipulation with JS (ES6)
`cssVar` allows easy manipulation (get & set) of your **GLOBAL (:root) CSS3 variables**, simplifing the templating related scenarios & tasks, providing a natural interface:

```javascript
// set the CSS global --myVariableName value  to "myVariableNewValue"
cssVar.myVariableName = "myVariableNewValue";
```

## Features:
- All your CSS global (:root selector) **variables are stored in the cssVar Object as properties**. Any change on them will be instantly reflected into the CSS realm.
- **The `--` variable name prefix , is not required** when setting or getting variables using `cssVar`. It is included automatically by the library when not provided. This automatization provides a more **natural & fast coding**. (However is still required on the CSS realm)
- Automagically **detects any new CSS attachment** in the document, performed after the initial load.

## Limitations :
- `cssVar` only operates with Global (:root) CSS Variables. Any definition/overewritting done inside another CSS selector will not be detected, and could affect the proper behavior of cssVar.
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

3- Install it using npm and dynamically import it(unsafe! not available in all browsers yet)
 ```bash
$ npm install css-var
```
```javascript
import("./css-var.js")
```

Once he library is attached/imported with any of the previous methods, the global Object `cssVar` will be available, and ready for usage!

### Usage
The `cssVar` Object behaves as a regular Js Object.  Any regular Object operation can be performed in `cssvar`. We are going to focus here, only in the most usefull and interesting ones : **enumeration , getters , setters**

**Enumrate** all declared CSS3 global variables iterating the cssVar Object :
```javascript
for(let v in cssVar){
    if ( cssVar.hasOwnProperty(v) ) console.log(v);
}
```
**Set** a new value to a  CSS3 Global variabe :
```javascript
/* The following assigmenents behave equally, and are all valid */
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
You can see the live example here

style.css
```css
:root{
    /* declaration of some global variables */
    --primaryColor : #F2A2BB;
    --SecondaryColor : blue;
    --textSize : 12;
}
body{
    /* Body background color will be specifed by the CSS variable --primaryColor */
    background-color: var(--primarColor);
    /* tezt color is set by --secondaryColor */ 
    color: var(--secondaryColor);
    /* Trick : Multiplying * 1px the value of th var, will add the sufix "px" automatically
    font-size: calc( var(--textSize) * 1px );
}
```

demo.js
```javscript

```
 
index.html
```html
<html>
    <head>
         <script src="https://cdn.rawgit.com/colxi/css-var/master/css-var.js"></script>
         <link rel="stylesheet" href="style.css" />
         <script src="demo.js"></script>
    </head>
     <body>
        <button id="randomize">Randomize!</button>
     </body>
 <html>
 ```
