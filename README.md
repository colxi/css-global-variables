# css-var : CSS Variables Manipulation via JS
cssVar allows easy manipulation (get & set) of your top level (:root) CSS variables, simplifing the templating related scenarios.

## Features:
- All your :root variables are stored in the cssVar Object as properties. Any change on them will be instantanlly reflected into the CSS realm.
- The mandatory '--' variable name prefix , is not required when setting or getting variables when using cssVar. It will be included automatically when not provided. This automatization provides a more natural & fast coding. (However are still required on te CSS side variable declarations)
- Detects any new CSS attachment in the document, performed after the initial load.

###Limitations :
- cssVar only operates with top level (:root) CSS Variables. -any definition/overewritting done with another CSS selector will not be detected, and could affect the proper behavior of cssVar.
- When cssVar library is loaded into the document, can generate a small delay, if the document has extensive CSS definitions.

## Installation :

npm


### Usage / Examples

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
