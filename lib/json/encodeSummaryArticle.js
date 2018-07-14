"use strict";

/**
 * Encode a SummaryArticle to JSON
 *
 * @param  {SummaryArticle} article
 * @param  {URIIndex} urls
 * @param  {Boolean} recursive
 * @return {Object}
 */
function encodeSummaryArticle(article, urls, recursive) {
    var articles = undefined;
    if (recursive !== false) {
        articles = article.getArticles().map(function (innerArticle) {
            return encodeSummaryArticle(innerArticle, urls, recursive);
        }).toJS();
    }

    return {
        title: article.getTitle(),
        level: article.getLevel(),
        depth: article.getDepth(),
        anchor: article.getAnchor(),
        url: urls.resolveToURL(article.getPath() || article.getUrl()),
        path: article.getPath(),
        ref: article.getRef(),
        articles: articles
    };
}

module.exports = encodeSummaryArticle;
//# sourceMappingURL=encodeSummaryArticle.js.map