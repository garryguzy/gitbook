'use strict';

var juice = require('juice');

var JSONUtils = require('../../json');
var render = require('../../browser/render');
var Promise = require('../../utils/promise');

/**
 * Generate PDF header/footer templates
 *
 * @param {Output} output
 * @param {String} type ("footer" or "header")
 * @return {String} html
 */
function getPDFTemplate(output, type) {
    var outputRoot = output.getRoot();
    var plugins = output.getPlugins();

    // Generate initial state
    var initialState = JSONUtils.encodeState(output);
    initialState.page = {
        num: '_PAGENUM_',
        title: '_SECTION_'
    };

    // Render the theme
    var html = render(plugins, initialState, 'ebook', 'pdf:' + type);

    // Inline CSS
    return Promise.nfcall(juice.juiceResources, html, {
        webResources: {
            relativeTo: outputRoot
        }
    });
}

module.exports = getPDFTemplate;
//# sourceMappingURL=getPDFTemplate.js.map