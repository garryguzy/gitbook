'use strict';

var Parse = require('../parse');

/**
 * List all assets in the book.
 *
 * @param {Output} output
 * @return {Promise<Output>} output
 */
function prepareAssets(output) {
    var book = output.getBook();
    var pages = output.getPages();
    var logger = output.getLogger();

    return Parse.listAssets(book, pages).then(function (assets) {
        logger.info.ln('found', assets.size, 'asset files');

        return output.set('assets', assets);
    });
}

module.exports = prepareAssets;
//# sourceMappingURL=prepareAssets.js.map