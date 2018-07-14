'use strict';

var lookupStructureFile = require('./lookupStructureFile');
var Readme = require('../models/readme');
var error = require('../utils/error');

/**
 * Parse readme from book.
 *
 * @param {Book} book
 * @return {Promise<Book>}
 */
function parseReadme(book) {
    var logger = book.logger;


    return lookupStructureFile(book, 'readme').then(function (file) {
        if (!file) {
            throw new error.FileNotFoundError({ filename: 'README' });
        }

        logger.debug.ln('readme found at ' + file.path);

        return book.set('readme', Readme.create({ file: file }));
    });
}

module.exports = parseReadme;
//# sourceMappingURL=parseReadme.js.map