'use strict';

var summaryToDocument = require('./toDocument');
var parsers = require('../../parsers');
var error = require('../../utils/error');

/**
 * Return summary serialized as text.
 * @param  {Summary} summary
 * @param  {String} extension?
 * @return {String}
 */
function summaryToText(summary, extension) {
    var file = summary.file;

    var parser = extension ? parsers.getByExt(extension) : file.getParser();

    if (!parser) {
        throw error.FileNotParsableError({
            filename: file.path
        });
    }

    // Create a document representing the summary
    var document = summaryToDocument(summary);

    // Render the document as text
    return parser.toText(document);
}

module.exports = summaryToText;
//# sourceMappingURL=toText.js.map