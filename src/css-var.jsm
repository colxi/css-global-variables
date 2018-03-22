/*
*
* @Author: colxi
* @Email: colxi.kl@gmail.com
* @Date:   2018-03-18 21:32:45
* @Last Modified by:   colxi
* @Last Modified time: 2018-03-21 20:47:42
* @License : GPL-3.0

*
* @Description : Returns a live collection, for easy manipulation (get & set)  top level (:root)
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

// TODO : refactory to Class, to allow multiple instances (right now, configuration
// objectbis shared betwen all instances , with the last one provided , dominating )
window.CSSGlobalVariables = (function(){
    'use strict';

    /**
     *
     * __varsCache__ : Contains internally the CSS variables and values.
     *
     * @type {Object}
     *
     */
    const __varsCache__ = {};

    const __config__ = {
        declareGlobal  : '__cssGlobals__',
        filterSelector : 'style, link[rel="stylesheet"]',
        autoPrefix     : true,
    };

    /**
     *
     * varsCacheProxy (Proxy Object) : Public Proxy object containing the CSS
     * variables and their values. Provides bindeºd methods for live getting and
     * setting, the variables values.
     *
     * @type {Proxy Object}
     *
     */
    const varsCacheProxy = new Proxy( __varsCache__ , {
        get: function( target, name ){
            // check if there is any new CSS declarations to be considered
            // before returning any value
            updateVarsCache();
            name = normalizeVariableName( name );
            return Reflect.get(target,name);
        },
        set: function(target, name, value){
            updateVarsCache();
            name = normalizeVariableName( name );
            value = String(value);
            // set the variable value
            document.documentElement.style.setProperty( name, value );
            // update th cache object
            Reflect.set(target, name, value);
        },
        deleteProperty: function (target, name) {
            /* not allowed */
            updateVarsCache();
            return false;
        },
        ownKeys: function (target) {
            updateVarsCache();
            return Reflect.ownKeys(target)
        },
        has: function (target, name) {
            updateVarsCache();
            name = normalizeVariableName( name );
            return Reflect.has(target,name);
        },
        defineProperty: function (target, name, attr) {
            //
            // it only allows to set the value
            //
            updateVarsCache();
            name = normalizeVariableName( name );
            if( typeof attr==='object' && attr.hasOwnProperty('value') ){
                let value = String(attr.value);
                // set the CSS variable value
                document.documentElement.style.setProperty( name , value );
                // update the cache
                Reflect.set(target, name, value);
            }
            return target;
        },
        getOwnPropertyDescriptor: function(target, name) {
            updateVarsCache();
            name = normalizeVariableName( name );
            return Reflect.getOwnPropertyDescriptor(target, name)
        }
    });

    /**
     *
     * [normalizeVariableName description]
     * @param  {[type]} name [description]
     *
     * @return {[type]}      [description]
     *
     */
    function normalizeVariableName( name = '' ){
        name = String(name);
        if(__config__.autoPrefix && name.substring(0,2) !=='--') name = '--' + name;
        return name;
    }

    /**
     *
     * updateVarsCache() : Updates the variables and values cache objec. Inspects
     * STYLE elements and attached stylesheets, ignoring those that have been
     * previously checked. Finally checks the inline CSS variables declarations.
     * Analized Elements will be Flagged wth the attribute data-css-var-cached
     *
     * @return {[boolean]} Returns true
     *
     */
    function updateVarsCache(){
        // iterate all CSS files attached to document, and extract all the
        // varibles set inside the :root selector
        [].slice.call(document.styleSheets).reduce( (prev,styleSheet)=>{
            // if filters have been provided to constructor...
            if( __config__.filterSelector ){
                // get all style type elements, and ignore current if not
                // been selected by the provided filter
                let s = document.querySelectorAll( __config__.filterSelector );
                let isSelected = false;
                for( let i in s ) if( s.hasOwnProperty(i) && styleSheet.ownerNode === s[i] ){
                    isSelected = true;
                }
                if(!isSelected) return;
            }
            // if Style element has been previously analized ignore it, if
            // not mark element as analized to prevent future analysis
            //
            // TODO: because can exist many instances, with diferent filtering rules
            // each instance should have an ID, that should be reflected in the
            // CHECK flag of the element , to allow other instances analize the
            // contents of element
            //
            if( styleSheet.ownerNode.hasAttribute('data-global-vars-checked') ) return;
            else styleSheet.ownerNode.setAttribute('data-global-var-checked', true);
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
                            __varsCache__[ prop[0].trim() ] = prop[1].trim();
                        }
                    }
                }
            }, '');
        }, '');
        // After collecting all the variables definitions, check their computed
        // values, consulting the :root element inline style definitions,
        // and and assigning those values to the variables, in cache
        for( let p in __varsCache__){
            if( __varsCache__.hasOwnProperty(p) ){
                __varsCache__[p] = window.getComputedStyle(document.documentElement,null).getPropertyValue(p).trim();
            }
        }
        // done !
        return true;
    }

    /**
     *
     * [__constructor__ description]
     * @param  {[type]} declareGlobal  [description]
     * @param  {[type]} autoPrefix     [description]
     * @param  {[type]} filterSelector [description]
     *
     * @return {[type]}                [description]
     */
    function __constructor__( declareGlobal, autoPrefix, filterSelector ){
        let instanceConfig = {};
        // if declareGlobal is an object , asume is configuration,
        // otherwhise fill the configuration object with the provided arguments
        if( typeof declareGlobal === 'object' ) Object.assign( instanceConfig, declareGlobal );
        else{
            instanceConfig.declareGlobal  = declareGlobal;
            instanceConfig.autoPrefix     = autoPrefix;
            instanceConfig.filterSelector = filterSelector;
        }
        // default values
        if( typeof instanceConfig.declareGlobal === 'undefined') instanceConfig.declareGlobal = ' ';
        if( typeof instanceConfig.autoPrefix === 'undefined') instanceConfig.autoPrefix = true;
        if( typeof instanceConfig.filterSelector === 'undefined') instanceConfig.filterSelector = false;

        // validate values
        if( typeof instanceConfig.declareGlobal !== 'string' && instanceConfig.declareGlobal !== false) throw new Error('TODO');
        if( typeof instanceConfig.autoPrefix !== 'boolean') throw new Error('TODO');;
        if( typeof instanceConfig.filterSelector !== 'string' && instanceConfig.filterSelector !== false) throw new Error('TODO');;

        Object.assign( __config__ , instanceConfig );

        if( __config__.declareGlobal ){
            // Ensure the contents of the cache are up to date, when the cache object is
            // requested, using a getter.
            // It also declares the public window.cssVar reference, for user interaction

            Object.defineProperty( window , __config__.declareGlobal  , {
                get : function(){
                    updateVarsCache();
                    return varsCacheProxy;
                },
                configurable : true
            });
        }

        if( __config__.filterSelector ){
            try{ document.querySelectorAll( __config__.filterSelector ) }
            catch(e){
                throw new Error();
            }
        }

        updateVarsCache();
        return varsCacheProxy;
    }

    return __constructor__;
})();


