'use strict';

var lookupStructureFile = require('./lookupStructureFile');
var glossaryFromDocument = require('./glossaryFromDocument');

/**
 * Parse glossary.
 *
 * @param {Book} book
 * @return {Promise<Book>}
 */
function parseGlossary(book) {
    var logger = book.logger;

    var fs = book.getContentFS();

    return lookupStructureFile(book, 'glossary').then(function (file) {
        if (!file) {
            logger.debug.ln('no glossary located');
            return book;
        }

        logger.debug.ln('glossary found at ' + file.path);
        return file.parse(fs).then(function (document) {
            var glossary = glossaryFromDocument(document);
            glossary = glossary.setFile(file);
            return book.set('glossary', glossary);
        });
    });
}

module.exports = parseGlossary;
//# sourceMappingURL=parseGlossary.js.map