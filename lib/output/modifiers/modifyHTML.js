'use strict';

var cheerio = require('cheerio');
var Promise = require('../../utils/promise');

/**
 * Apply a list of operations to a page and
 * output the new page.
 *
 * @param {Page} page
 * @param {List|Array<Transformation>} operations
 * @return {Promise<Page>} page
 */
function modifyHTML(page, operations) {
    var html = page.getContent();
    var $ = cheerio.load(html);

    return Promise.forEach(operations, function (op) {
        return op($);
    }).then(function () {
        var resultHTML = $.html();
        return page.set('content', resultHTML);
    });
}

module.exports = modifyHTML;
//# sourceMappingURL=modifyHTML.js.map