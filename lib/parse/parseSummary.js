'use strict';

var Summary = require('../models/summary');
var lookupStructureFile = require('./lookupStructureFile');
var summaryFromDocument = require('./summaryFromDocument');
var SummaryModifier = require('../modifiers').Summary;

/**
 * Read the summary from a file.
 * @param {Book} book
 * @param {File} file
 * @return {Promise<Summary>} summary
 */
function readSummary(book, file) {
    var fs = book.getContentFS();

    return file.parse(fs).then(function (document) {
        var summary = summaryFromDocument(document);
        return summary.setFile(file);
    });
}

/**
 * Parse summary in a book, the summary can only be parsed
 * if the readme as be detected before.
 *
 * @param {Book} book
 * @return {Promise<Book>}
 */
function parseSummary(book) {
    var readme = book.readme,
        logger = book.logger;


    return lookupStructureFile(book, 'summary').then(function (file) {
        if (!file) {
            logger.warn.ln('no summary file in this book');
            return new Summary();
        } else {
            logger.debug.ln('summary file found at', file.path);
            return readSummary(book, file);
        }
    })

    // Insert readme as first entry if not in SUMMARY.md
    .then(function (summary) {
        var readmeFile = readme.getFile();
        var readmeArticle = summary.getByPath(readmeFile.path);

        if (readmeFile.exists() && !readmeArticle) {
            summary = SummaryModifier.unshiftArticle(summary, {
                title: 'Introduction',
                ref: readmeFile.path
            });
        }

        // Set new summary
        return book.setSummary(summary);
    });
}

module.exports = parseSummary;
//# sourceMappingURL=parseSummary.js.map