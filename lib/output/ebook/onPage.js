'use strict';

var WebsiteGenerator = require('../website');
var Modifiers = require('../modifiers');

/**
 * Write a page for ebook output. It renders it just as the website generator
 * except that it inline assets.
 *
 * @param {Output} output
 * @param {Output} output
 */
function onPage(output, page) {
    var options = output.getOptions();

    // Inline assets
    return Modifiers.modifyHTML(page, [Modifiers.inlineAssets(options.get('root'), page.getFile().getPath())])

    // Write page using website generator
    .then(function (resultPage) {
        return WebsiteGenerator.onPage(output, resultPage);
    });
}

module.exports = onPage;
//# sourceMappingURL=onPage.js.map