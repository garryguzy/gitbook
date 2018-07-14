'use strict';

var encodeSummaryArticle = require('./encodeSummaryArticle');

/**
 * Encode a SummaryPart to JSON.
 *
 * @param  {SummaryPart} part
 * @param  {URIIndex} urls
 * @return {JSON} json
 */
function encodeSummaryPart(part, urls) {
    return {
        title: part.getTitle(),
        articles: part.getArticles().map(function (article) {
            return encodeSummaryArticle(article, urls);
        }).toJS()
    };
}

module.exports = encodeSummaryPart;
//# sourceMappingURL=encodeSummaryPart.js.map