'use strict';

var JSONUtils = require('../../json');
var Promise = require('../../utils/promise');
var writeFile = require('../helper/writeFile');
var render = require('../../browser/render');

/**
 * Finish the generation, write the languages index.
 *
 * @param {Output}
 * @return {Output}
 */
function onFinish(output) {
    var book = output.getBook();

    if (!book.isMultilingual()) {
        return Promise(output);
    }

    var plugins = output.getPlugins();

    // Generate initial state
    var initialState = JSONUtils.encodeState(output);

    // Render using React
    var html = render(plugins, initialState, 'browser', 'website:languages');

    return writeFile(output, 'index.html', html);
}

module.exports = onFinish;
//# sourceMappingURL=onFinish.js.map