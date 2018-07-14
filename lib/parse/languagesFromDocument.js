'use strict';

var _require = require('markup-it'),
    BLOCKS = _require.BLOCKS;

var Languages = require('../models/languages');

var _require2 = require('./summaryFromDocument'),
    listArticles = _require2.listArticles;

var isList = function isList(node) {
    return node.type === BLOCKS.OL_LIST || node.type === BLOCKS.UL_LIST;
};

/**
 * Parse a languages listing from a document.
 * @param  {Document} document
 * @return {Languages} languages
 */
function languagesFromDocument(document) {
    var nodes = document.nodes;


    var list = nodes.find(isList);

    if (!list) {
        return new Languages();
    }

    var articles = listArticles(list);

    return Languages.createFromList(articles.filter(function (article) {
        return article.ref;
    }).map(function (article) {
        return { title: article.title, path: article.ref };
    }));
}

module.exports = languagesFromDocument;
//# sourceMappingURL=languagesFromDocument.js.map