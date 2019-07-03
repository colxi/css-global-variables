/*
*
* @Package: css-global-variables (CSSGlobalVariables)
* @Url: https://github.com/colxi/css-global-variables/
* @Author: colxi
* @Email: colxi.kl@gmail.com
* @Date:  2018-03-18
* @License: MIT
*
*/

import './main.js';

let _temp = window.CSSGlobalVariables;

delete window.CSSGlobalVariables;

export {_temp as CSSGlobalVariables};
