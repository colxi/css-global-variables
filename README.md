# css-var : CSS Variables Manipulation via JS
`cssVar` allows easy manipulation (get & set) of your **GLOBAL (:root) CSS variables**, simplifing the templating related scenarios & tasks, providing a natural interface:

```javascript
// set the CSS global --myVariableName value  to "myVariableNewValue"
cssVar.myVariableName = "myVariableNewValue";
```

## Features:
- All your CSS global (:root selector) **variables are stored in the cssVar Object as properties**. Any change on them will be instantly reflected into the CSS realm.
- **The `--` variable name prefix , is not required** when setting or getting variables using `cssVar`. It is included automatically by the library when not provided. This automatization provides a more **natural & fast coding**. (However is still required on the CSS realm)
- Automagically **detects any new CSS attachment** in the document, performed after the initial load.

### Limitations :
- `cssVar` only operates with Global (:root) CSS Variables. Any definition/overewritting done inside another CSS selector will not be detected, and could affect the proper behavior of cssVar.
- When `cssVar` library is loaded into the document, can generate a small delay, if the document has extensive CSS definitions.

## Installation :

npm


### Usage / Examples
```html
 <html>
     <style/>
         :root{
             --main-color : #F2A2BB;
             --textSize : 12;
         }
     </style>
     <script>
         // Note: Assuming css-var.js has been already attached to the docment

         console.log ( cssVar['--main-color'] , cssVar.textSize );
         // output : "#F2A2BB" , "12"

         cssVar['--main-color'] = 'red';
         cssVar.textSize = 20;
         console.log ( cssVar['--main-color'], cssVar.textSize );
         // output : "red" , "20"
     </script>
 <html>
 ```
