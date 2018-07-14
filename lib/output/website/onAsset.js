'use strict';

var path = require('path');
var fs = require('../../utils/fs');

/**
 * Copy an asset from the book to the output folder.
 *
 * @param {Output} output
 * @param {Page} page
 * @return {Output} output
 */
function onAsset(output, asset) {
    var book = output.getBook();
    var options = output.getOptions();
    var bookFS = book.getContentFS();

    var outputFolder = options.get('root');
    var outputPath = path.resolve(outputFolder, asset);

    return fs.ensureFile(outputPath).then(function () {
        return bookFS.readAsStream(asset).then(function (stream) {
            return fs.writeStream(outputPath, stream);
        });
    }).thenResolve(output);
}

module.exports = onAsset;
//# sourceMappingURL=onAsset.js.map