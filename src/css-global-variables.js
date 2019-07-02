/*
*
* @Package: css-global-variables (CSSGlobalVariables)
* @Url: https://github.com/colxi/css-global-variables/
* @Author: colxi
* @Email: colxi.kl@gmail.com
* @Date:   2018-03-18 21:32:45
* @Last Modified by:   colxi
* @Last Modified time: 2019-03-23 16:09:54
*

*/

// private ID counter
let __identifierCounter__ = 0;

// Returns public __constructor__() function
const CSSGlobalVariables = function( { filterSelector, autoPrefix, transformFunc }={} ){

    if( !(this instanceof CSSGlobalVariables) ) throw new Error('calling CSSGlobalVariables constructor without new is forbidden');

    /**
     *
     * __config__  : Object containing the instance configurqtion
     * @type {Object}
     *
     */
    const __config__ = {};

    /**
     *
     * __varsCache__ : Contains internally the CSS variables and values.
     * @type {Object}
     *
     */
    const __varsCache__ = {};


    /**
     *
     * __constructor__() : Public constructor, returns a Proxy Object, wich
     * properties are the CSS Global Variables detected. Allows configuration
     * through parameters.
     *
     * @param  {[string|false|Object]}  filterSelector
     * @param  {[boolean]}              autoPrefix
     *
     * @return {[Proxy Object]}
     *
     */
    function __constructor__( filterSelector, autoPrefix, transformFunc ){
        // if filterSelector is an object , asume is configuration,
        // otherwhise fill the configuration object with the provided arguments
        if( typeof filterSelector === 'object' ) Object.assign( __config__, filterSelector );
        else{
            __config__.filterSelector = filterSelector;
            __config__.autoPrefix     = autoPrefix;
        }
        if( typeof transformFunc === 'function' ) __config__.transformFunc = transformFunc
        else{
            console.warn('transformFunc must be a function')
        }
        // default values
        if( typeof __config__.filterSelector === 'undefined') __config__.filterSelector = false;
        if( typeof __config__.autoPrefix === 'undefined') __config__.autoPrefix = true;
        if( typeof __config__.transformFunc !== 'function') __config__.transformFunc = null;

        // validate values
        if( typeof __config__.filterSelector !== 'string' && __config__.filterSelector !== false) throw new Error('"filterSelector" parameter must be a String or false');
        if( typeof __config__.autoPrefix !== 'boolean') throw new Error('"autoPrefix" parameter must be a Boolean');



        if( __config__.filterSelector ){
            try{ document.querySelectorAll( __config__.filterSelector ) }
            catch(e){
                throw new Error('Provided "filterSelector" is an invalid selector ("'+filterSelector+'")');
            }
        }

        __identifierCounter__++;
        __config__.id = __identifierCounter__;

        return;
    }


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
            // before returning any  
            //updateVarsCache();
            name = normalizeVariableName( name );
            return Reflect.get(target,name);
        },
        set: function(target, name, value){
            //updateVarsCache();
            name = normalizeVariableName( name );
            value = String(value);
            // set the variable value
            document.documentElement.style.setProperty( name, value );
            // update th cache object
            return Reflect.set(target, name, value);
        },
        deleteProperty: function () {
            /* not allowed */
            //updateVarsCache();
            return false;
        },
        ownKeys: function (target) {
            //updateVarsCache();
            return Reflect.ownKeys(target);
        },
        has: function (target, name) {
            //updateVarsCache();
            name = normalizeVariableName( name );
            return Reflect.has(target,name);
        },
        defineProperty: function (target, name, attr) {
            //
            // it only allows to set the value
            //
            //updateVarsCache();
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
            //updateVarsCache();
            name = normalizeVariableName( name );
            return Reflect.getOwnPropertyDescriptor(target, name);
        }
    });

    /**
     *
     * normalizeVariableName()  Forces name to be a String, and attach the
     * mandatory '--' prefix when autoPrefixer is Enabled
     *
     * @param  {[String]} name  Name of thw requested variable
     *
     * @return {[String]}
     *
     */
    function normalizeVariableName( name = '' ){
        name = String(name);
        if( __config__.transformFunc !== null ){
            name = __config__.transformFunc( name )
        }
        if( name.substring(0,2) !=='--' ){
            if(__config__.autoPrefix ) name = '--' + name;
            else throw new Error('Invalid CSS Variable name. Name must start with "--" (autoPrefix=false)');
        }
        
        return name;
    }


    /**
     *
     * updateVarsCache() : Updates the variables and values cache object. Inspects
     * STYLE elements and attached stylesheets, ignoring those that have been
     * previously checked. Finally checks the inline CSS variables declarations.
     * Analized Elements will be Flagged wth an Htmlmattribute
     *
     * @return {[boolean]} Returns true
     *
     */
    function updateVarsCache(){
        // iterate all CSS files attached to document, and extract all the
        // varibles set inside the :root selector
        [].slice.call(document.styleSheets).reduce( (prev,_styleSheet)=>{
            // if filters have been provided to constructor...
            if( __config__.filterSelector ){
                // get all style type elements, and ignore current if not
                // been selected by the provided filter
                let s = document.querySelectorAll( __config__.filterSelector );
                let isSelected = false;
                for( let i in s ) if( s.hasOwnProperty(i) && _styleSheet.ownerNode === s[i] ){
                    isSelected = true;
                }
                if(!isSelected) return;
            }
            // if Style element has been previously analized ignore it, if
            // not mark element as analized to prevent future analysis
            let  ids = _styleSheet.ownerNode.getAttribute('css-global-vars-id');

            if( String(ids).split(',').includes( String(__config__.id) ) ) return;
            else{
                // not cached yet!
                let value = _styleSheet.ownerNode.getAttribute('css-global-vars-id');
                // check if is null or empty (crossbrowser solution), and
                // attach the new instance id
                if( value === null || value === '' ) value = __config__.id;
                else value += ',' + __config__.id;
                // set the new value to the object
                _styleSheet.ownerNode.setAttribute('css-global-vars-id', value);
            }

            // ***** BUG Note :
            // Detected an error in the next line of code, that affects Firefox 66 , 
            // when trying to read CSS rules. A reference to this error is referenced also in :
            // https://github.com/uber/react-vis/issues/682
            // No workarrounds or fixes to it can be found anywhere. 
            // ( It only affects in local execution mode )

            // iterate each CSS rule (if found)
            let rules
            try{
                rules = _styleSheet.rules || _styleSheet.cssRules
            }catch(e){
                console.warn( e )
            }

            if (!rules) return;
            else return prev + [].slice.call(rules).reduce( (prev, cssRule)=>{
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


    // Create a mutation observer. When new styles are attached to the DOM (Style or Link element) 
    // will pperform an update of the document CSS variables
    var observer = new MutationObserver( mutations=>{
        let update = false;
        mutations.forEach( mutation=>{
            if( mutation.type === 'childList' ){
                for(let i=0;i<mutation.addedNodes.length;i++){
                    if( mutation.addedNodes[i].tagName === 'STYLE' || mutation.addedNodes[i].tagName === 'LINK' ) update= true;
                }
                for(let i=0;i<mutation.removedNodes.length;i++){
                    if( mutation.removedNodes[i].tagName === 'STYLE' || mutation.removedNodes[i].tagName === 'LINK' ) update= true;
                }
            }
        });    
        if(update){ 
            // update needs to be scheduled to garanted that the new styles
            // are visible through the document.styleSheets API
            setTimeout( updateVarsCache, 500 );
        }
    });
    // Initialize the observer. Set the target and the config
    observer.observe(document.documentElement,  { 
        attributes: false, 
        childList: true, 
        characterData: true,
        subtree: true
    });




    // call the constructor, analize the document style elements to generate
    // the collection of css variables, and return the proxy object
    __constructor__( filterSelector, autoPrefix, transformFunc );
    updateVarsCache();
    return varsCacheProxy;
};

export {CSSGlobalVariables};

