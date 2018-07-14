'use strict';

var Promise = require('../../utils/promise');
var copyPluginAssets = require('./copyPluginAssets');

/**
 * Initialize the generator
 *
 * @param {Output}
 * @return {Output}
 */
function onInit(output) {
  return Promise(output).then(copyPluginAssets);
}

module.exports = onInit;
//# sourceMappingURL=onInit.js.map