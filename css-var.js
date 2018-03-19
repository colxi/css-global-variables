/*
*
* @Author: colxi
* @Email: colxi.kl@gmail.com
* @Date:   2018-03-18 21:32:45
* @Last Modified by:   colxi
* @Last Modified time: 2018-03-19 12:13:42
* @License : GPL-3.0

*
* @Description : cssVar allows easy manipulation (get & set)  top level (:root)
* CSS variables, simplifing the CSS based templating.
*
* Notes:
* - The '--' variable name prefix , is not required when setting or getting
* variables. It will be included automatically when ot provided. This feature
* provides a more natural  & fast coding.
* - The first time cssvar object is called, can generate a small delay, if the
* document has extensive CSS definitions.
*
* Limitations :
* - cssVar only operates with top level (:root) CSS Variables, any
* definition/overewritting done with another CSS slector will not be
* detected, and could affect the proper behavior of cssVar.
*
* Eg.
* <html>
*     <style/>
*         :root{
*             --main-color : #F2A2BB;
*             --textSize : 12;
*         }
*     </style>
*     <script>
*         // Note: Assuming css-var.js has been already attached to the docment
*
*         console.log ( cssVar['--main-color'] , cssVar.textSize );
*         // output : "#F2A2BB" , "12"
*
*         cssVar['--main-color'] = 'red';
*         cssVar.textSize = 20;
*         console.log ( cssVar['--main-color'], cssVar.textSize );
*         // output : "red" , "20"
*     </script>
* <html>
*
*
*/
(function(){
    'use strict';
    /**
     *
     * _cache  (Proxy) : Contains internally the CSS variables and values.
     *
     * @type {Proxy Object}
     *
     */
    let _cache = {};
    let _cssVar = {
        /**
         *
         * cache (Proxy Object) : Public Proxy object containing the CSS variables and
         * their values. Provides binded methods for live getting and setting, the
         * variables values.
         *
         * @type {Proxy Object}
         *
         */
        cache : new Proxy( _cache , {
            get: function( target, name ){
                // check if there is any new CSS declarations to be considered
                // before returning any value
                _cssVar.updateCache();
                if(name.substring(0,2) !=='--') name = '--' + name;
                return Reflect.get(target,name);
            },
            set: function(target, name, value){
                // ensure the varia le name is set properly.
                if(name.substring(0,2) !=='--') name = '--' + name;
                // update the css definitiins cace
                _cssVar.updateCache();
                value = String(value);
                // set the variable value
                document.documentElement.style.setProperty( name, value );
                // update th cache object
                Reflect.set(target, name, value);
            }
        }),
        /**
         *
         * updateCache() : Updates the variables and values cache objec. Inspects
         * STYLE elements and attached stylesheets, ignoring those that have been
         * previously checked. Finally checks the inline CSS variables declarations.
         * Analized Elements will be Flagged wth the attribute data-css-var-cached
         *
         * @return {[boolean]} Returns true
         *
         */
        updateCache : function(){
            // iterate all CSS files attached to document, and extract all the
            // varibles set inside the :root selector
            [].slice.call(document.styleSheets).reduce( (prev,styleSheet)=>{
                // if Style element has been previously analized ignore it, if
                // not mark element as analized to prevent future analysis
                if( styleSheet.ownerNode.hasAttribute('data-css-var-cached') ) return;
                else styleSheet.ownerNode.setAttribute('data-css-var-cached', true);
                // iiterateneach CSS rule (if found)
                if (!styleSheet.cssRules) return;
                else return prev + [].slice.call(styleSheet.cssRules).reduce( (prev, cssRule)=>{
                    // select only the :root entries
                    if ( cssRule.selectorText === ':root' ) {
                        let css = cssRule.cssText.split( '{' );
                        css = css[1].replace( '}' , '' ).split( ';' );
                        // iterate each :root CSS property
                        for (let i = 0; i < css.length; i++) {
                            let prop = css[i].split(':');
                            // if is a varIABLE property, insert in in cache
                            if (prop.length === 2 && prop[0].indexOf('--') === 1){
                                _cache[ prop[0].trim() ] = prop[1].trim();
                            }
                        }
                    }
                }, '');
            }, '');
            // After collecting all the variables definitions, check their computed
            // values, consulting the :root element inline style definitions,
            // and and assigning those values to the variables, in cache
            for( let p in _cache){
                if( _cache.hasOwnProperty(p) ){
                    _cache[p] = window.getComputedStyle(document.documentElement,null).getPropertyValue(p).trim();
                }
            }
            // done !
            return true;
        }
    };
    // build the cache  for first time (delay expected if high ammount of
    // CSS declarations are found in the document)
    _cssVar.updateCache();
    // Ensure the contents of the cache are up to date, when the cache object is
    // requested, using a getter.
    // It also declares the public window.cssVar reference, for user interaction
    Object.defineProperty( window , 'cssVar' , {
        get : function(){
            _cssVar.updateCache();
            return _cssVar.cache;
        }
    });
})();
