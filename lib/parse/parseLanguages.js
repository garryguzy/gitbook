'use strict';

var lookupStructureFile = require('./lookupStructureFile');
var languagesFromDocument = require('./languagesFromDocument');

/**
 * Parse languages list from book
 *
 * @param {Book} book
 * @return {Promise<Book>}
 */
function parseLanguages(book) {
    var logger = book.logger;

    var fs = book.getContentFS();

    return lookupStructureFile(book, 'langs').then(function (file) {
        if (!file) {
            return book;
        }

        logger.debug.ln('languages index found at ' + file.path);

        return file.parse(fs).then(function (document) {
            var languages = languagesFromDocument(document);
            languages = languages.merge({ file: file });

            logger.info.ln('parsing multilingual book, with ' + languages.list.size + ' languages');

            return book.set('languages', languages);
        });
    });
}

module.exports = parseLanguages;
//# sourceMappingURL=parseLanguages.js.map