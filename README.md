![](https://img.shields.io/badge/cdn-cdn.rawgit-green.svg)
![](https://img.shields.io/badge/Javascript-ES6-orange.svg)
![](https://img.shields.io/badge/markup-CSS3-blue.svg)

# CSS3 Variables Manipulation with JS (ES6)
The CSSGlobalVariables helper function provides a fast manipulation interface for your **GLOBAL ( only those declared with `:root` selector ) [CSS3 variables](https://www.w3.org/TR/css-variables-1/)**, simplifying the templating related scenarios & tasks, through a natural interface, in **less than 3Kb**.

```javascript
// set the CSS global --myVariableName value  to "myVariableNewValue"
let cssVar = new CSSGlobalVariables();
cssVar.myVariableName = "myVariableNewValue";
```

## Syntax:

> new CSSGlobalVariables( [autoPrefix], [filterSelector], [declareGlobal] )

> new CSSGlobalVariables( [configObject] )


#### Parameters:
* **`autoPrefix`** :
When set to `true` allows acces to the CSS variables names without specifing the `--` prefix on the name. (*Boolean. Optional. Default:`true`*)

* **`filterSelector`** :
Allows to filter wich Style Elements should be scanned and ignnored, through regular CSS Selector strings. When set to `false`, everything is scanned. (*String|false. Optional. Default:`false`*)

* **`declareGlobal`** :
Declares a window global variable. Meant for debugging purposes. (String|false. Optional. Default : '*__cssGlobals__'*)

* **`configObject`** :
An Object containing any of the previous parameters as properties.

#### Return value:
The CSSGlobalVariables() Constructor returns an Proxy Object coantaining a **live Collection** of all the CSS global variables, as properties.

---

## Description:

This helper method, **collects** all CSS3 global variables into a single **live object, as properties**. Any change on their values will instantly be reflected back into your CSS, and as a consecuence in the DOM render, and any read will return the current computed value of the variable.

- When autoPrefixer is enabled (default) will add automatically add the `--` variable name prefix for you. This provides a more **natural & fast coding** experience. (However the prefix is still required on the CSS declaration in the stylesheet)
- Automatically **detects any new CSS attachment** in the document, performed after the initial load/construction.
- Allows **custom selectors**, wich let you to choose which Style Elements should be analized or ignored. This helps to dismiss non relevant Style Nodes, reducing the instance construction time (in scenarios with large CSS files)


## Installation :

You can choose betwen any of the following available options/distribution channels :

1- Clone the repository locally, and attach the library to your Html document
 ```html
<script src="path/to/css-global-variables.min.js"></script>
```

2- Use the online delivery network
 ```html
<script src="https://cdn.rawgit.com/colxi/css-global-variables/master/src/css-global-variables.min.js"></script>
```

3- Install it using npm and import it. (unsafe! Not available in all browsers)
 ```bash
$ npm install css-global-variables
```
```javascript
// static import
import 'path/to/css-global-variables.js';
// or dynamic import inside an async function
await import("path/to/css-global.variables.js")
```

Once he library is attached/imported with any of the previous methods, the global Constructor `CSSGlobalVariables` becomes available, and ready for usage!

## Usage
The Construcyor returns a Proxy Object. Any regular Object operation can be performed on it. It couldn't be easier. We are going to focus here, only in the most useful and interesting ones : **construction, enumeration , set , get**

**Construction** returns the live Objec:
```javascript
let cssVar = new CSSGLlobalVariables();
```

**Enumeration** of all declared CSS3 global variables, iterating the returned Object :
```javascript
for(let v in cssVar){
    if ( cssVar.hasOwnProperty(v) ) console.log(v);
}
```

**Set** a new value to a CSS3 Global variabe :
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

---

## Examples
The following example (available in ./examples), randomizes the background color, and the font size, each time receives a click.
You can test it [here](https://colxi.github.io/css-global-variables/examples/demo-simple.html)

demo-simple.css
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

demo-simple.js
```javascript
// on document ready...
document.addEventListener('DOMContentLoaded', function(){
    let cssVar = new CSSGLlobalVariables();
    // ...attach click event to te body
    document.body.addEventListener('click', function(){
        /* Generate and assign random color */
        cssVar.primaryColor = '#'+Math.random().toString(16).substr(-6);
        /* Generate and assign random size, betwen 15 and 45 */
        cssVar.textSize = Math.floor( Math.random()*30 + 15 );
    })
} , false);
```

demo-simple.html
```html
<html>
    <head>
         <script src="https://cdn.rawgit.com/colxi/css-global-variables/master/src/css-global-variables.js"></script>
         <link rel="stylesheet" href="./demo-simple.css" />
         <script src="./demo-simple.js"></script>
    </head>
    <body>
        <div>Randomize!</div>
    </body>
 <html>
 ```

---
#### Note:
*When you check the value of any of the CSS Variables in the returned Proxy Object, **it will always display an updated value**, because in each acces, it performs internally a scan & update, before retuning anything.*

*However if you send to the console the **whole Object**, its contents values may not be updated (if you attached a new Style Element, or modified the value in the DOM Inspector, for example).*

**This behavior is caused by the way the Browser Console overrides the methods to acces the Proxy members.**

Workarround: With the`declareGlobal` configuration parameter, you can force the generation of a global variable, wich is not affected by this issue.

#### License :
GPL 3.0   