'use strict';

var Parse = require('../parse');
var Promise = require('../utils/promise');
var parseURIIndexFromPages = require('../parse/parseURIIndexFromPages');

/**
 * List and parse all pages, then create the urls mapping.
 *
 * @param {Output}
 * @return {Promise<Output>}
 */
function preparePages(output) {
    var book = output.getBook();
    var logger = book.getLogger();
    var readme = book.getReadme();

    if (book.isMultilingual()) {
        return Promise(output);
    }

    return Parse.parsePagesList(book).then(function (pages) {
        logger.info.ln('found', pages.size, 'pages');
        var urls = parseURIIndexFromPages(pages);

        // Readme should always generate an index.html
        urls = urls.append(readme.getFile().getPath(), 'index.html');

        return output.merge({
            pages: pages,
            urls: urls
        });
    });
}

module.exports = preparePages;
//# sourceMappingURL=preparePages.js.map