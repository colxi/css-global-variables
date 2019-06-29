![](https://img.shields.io/badge/Javascript-ES6-orange.svg)
![](https://img.shields.io/badge/markup-CSS3-blue.svg)

# CSS3 Variables Manipulation with JS (ES6)

CSSGlobalVariables provides a natural interface for fast manipulation of **GLOBAL  [CSS3 variables](https://www.w3.org/TR/css-variables-1/)** ( those declared with `:root` selector ), simplifying those tasks related to templating, and general CSS styles manipulation in javascript.

```javascript
import {CSSGlobalVariables} from './css-global-variables.js';

// set the CSS global --myColor value to "green"
let cssVar = new CSSGlobalVariables();
cssVar.myVariableName = "green";
```
Demo : See it in action [here](https://colxi.github.io/css-global-variables/examples/demo-simple.html)

# Syntax:

> new CSSGlobalVariables( [autoPrefix=true], [filterSelector=false] )



#### Parameters:
* **`autoPrefix`** :
When set to `true` allows acces to the CSS variables names without specifing the `--` prefix on the name. (*Boolean. Optional. Default:`true`*)

* **`filterSelector`** :
Allows to filter wich Style Elements should be scanned and ignnored, through regular CSS Selector strings. When set to `false`, everything is scanned. (*String|false. Optional. Default:`false`*)


#### Return value:
The CSSGlobalVariables() Constructor returns a Proxy Object containing a **live Collection** with the found CSS global variables, as properties.


# Installation :

You can choose betwen any of the following available options/distribution channels :

1- Clone the repository locally using git ( or download the latest release [here](https://github.com/colxi/css-global-variables/archive/master.zip) )
 ```html
 $ git clone https://github.com/colxi/css-global-variables.git
```

2- Install it using npm and import it. (unsafe! Not available in all browsers)
 ```bash
$ npm install css-global-variables -s
```



# Usage
The Constructor returns a Proxy Object. Any regular Object operation can be performed on it. It couldn't be easier. We are going to focus here, only in the most useful and interesting ones : **construction, enumeration , set , get**

**Importing** the library
```javascript
import {CSSGlobalVariables} from './css-global-variables.js';
```

**Construction** returns the live Object:
```javascript
let cssVar = new CSSGlobalVariables();
```

**Enumeration** of all declared CSS3 global variables, through iteration :
```javascript
for(let v in cssVar){
    if ( cssVar.hasOwnProperty(v) ) console.log(v);
}
```

**Set** a new value to a CSS3 Global variabe :
```javascript
/* The following assigments to '--myVariable' behave equally, and are all valid */
cssVar.myVariable = 'newValue';
cssVar['myVariable'] = 'newValue';
cssVar['--myVariable'] = 'newValue';
```

**Get** the value of a CSS3 Global variabe :
```javascript
/* The following value retrievals for '--myVariable' behave equally, and are all valid */
console.log( cssVar.myVariable );
console.log( cssVar['myVariable'] );
console.log( cssVar['--myVariable'] );
```

---
# DOM changes:

The library uses a DOM Mutation Observer to detect new inclusion or removals in the document. Thanks to this observer, new CSS variables are available automatically, when new styles are attached to the document.  


 