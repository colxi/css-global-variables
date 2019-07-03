![](https://img.shields.io/badge/Javascript-ES6-orange.svg)
![](https://img.shields.io/badge/markup-CSS3-blue.svg)

# CSS Variables Manipulation with JS (ES6)

CSSGlobalVariables provides a natural interface for fast manipulation of **GLOBAL  [CSS variables](https://www.w3.org/TR/css-variables-1/)** (those declared with a `:root` selector), simplifying templating tasks, and manipulation of general CSS styles in javascript.

```javascript
import {CSSGlobalVariables} from './css-global-variables.js';

// set the CSS global --myColor value to "green"
let cssVar = new CSSGlobalVariables();
cssVar.myColor = "green";
```
Demo: See it in action [here](https://colxi.github.io/css-global-variables/examples/demo-simple.html)

# Syntax

```javascript
 new CSSGlobalVariables( [ configObject ] )
```

#### Parameters
A Config Object can be provided to customize internal behaviour. It can set any of the following properties:

* **`autoprefix`**:
When set to `true` allows access to the CSS variables names without specifing the `--` prefix on the name. (Boolean. Default:`true`)

* **`filter`**:
Allows to filter which Style Elements should be scanned (and which ignnored), through CSS selector strings. By default everything is scanned. (String. Default: `'*'`)

* **`normalize`**:
A user-provided transform-function that processes the CSS Variable names (before they get autoPrefixed). The function must return a String. This mechanism allows the usage of custom variable name formatting (eg. camelCase, snake_case, CONSTANT_CASE) in your code. A nice source of transform functions is [change-case](https://www.npmjs.com/package/change-case). (Function. Default: `none`)



#### Return value
The CSSGlobalVariables() Constructor returns a `Proxy Object` containing a **live Collection** with the found CSS global variables.


# Installation
You can choose between any of the following available distribution channels:

- **GIT**: Clone the repository locally using git (or download the latest release [here](https://github.com/colxi/css-global-variables/releases/latest))
 ```bash
 $ git clone https://github.com/colxi/css-global-variables.git
```

- **NPM**: Install it using npm and import it. 
 ```bash
$ npm install css-global-variables -s
```

- **CDN**: Include the script in your HTML header (`window.CSSGlobalVariables` will be created).
 ```html
<script src="https://colxi.info/css-global-variables/src/main.js"></script>
```

# Usage
The `Constructor` returns a `Proxy Object` and any regular Object operation can be performed on it (except property deletion). In the following list, you will find examples of the the most common operations and interactions: 

**Import and Construct**:
```javascript
import {CSSGlobalVariables} from './css-global-variables.js';
let cssVar = new CSSGlobalVariables();
```

**Set** a new value to a CSS Global variable:
```javascript
/* The following assigments to '--myVariable' behave equally, and are all valid */
cssVar.myVariable = 'newValue';
cssVar['myVariable'] = 'newValue';
cssVar['--myVariable'] = 'newValue';
```

**Get** the value of a CSS Global variable:
```javascript
/* The following value retrievals for '--myVariable' behave equally, and are all valid */
console.log( cssVar.myVariable );
console.log( cssVar['myVariable'] );
console.log( cssVar['--myVariable'] );
```


**Enumeration** of all declared CSS global variables, through iteration:
```javascript
for( let v in cssVar ){
    console.log( v , '=', cssVar[v] );
}
```

# Variable Name Normalize functions
`Normalize functions` (implemented by [@SebastianDuval](https://github.com/SebastianDuval) ) allow you to perform automatic transformations of the variable names, to make them more suitable for the javascript syntax, or to simply addapt them to your coding style and personal preferences.

In the following example a CSS variable declared using hyphens (`--my-css-variable`), can be accessed in Javascript using the widelly used camelCase style (`myCssVariable`), thanks to the `camelToHyphens` normalize function (and the native `autoprefixer`):

CSS:
```html
<style>
   :root{
        --my-css-variable: 'red';
    }
</style>
```
Javascript: 
```javascript
let camelToHyphens = function(name){
    return name.replace(/[A-Z]/g, m => "-" + m.toLowerCase() );
}
let cssVar = new CSSGlobalVariables( { normalize:camelToHyphens });

cssVar.myCssVariable = 'blue';
```



# DOM changes tracking

The library uses a DOM Mutation Observer to detect new inclusion in the document. Thanks to this observer, new CSS variables are available automatically when new styles are attached to the document.  


# CORS Restrictions
CSSGlovalVariables will face limitations when trying to extract the CSS definitions of a remote stylesheet (except for same-origin urls). Restrictions applied by the browser, based in the Cross Origin Policy will block any access attempt.

In such a scenario, a warning will be printed in the console, and the affected style element will be flagged and ignored by the library.

To prevent this restriction, add the `crossorigin` attribute to the `<link>` element:

```html
<link rel="stylesheet" crossorigin="anonymous" href="https://www.a-remote-server/styles.css">
```
If the server is configured to allow CORS (through the  **Access-Control-Allow-Origin** directive) the CORS restrictions should disapear.
