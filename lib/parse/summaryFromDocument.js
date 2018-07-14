'use strict';

var Summary = require('../models/summary');

var _require = require('markup-it'),
    BLOCKS = _require.BLOCKS,
    INLINES = _require.INLINES;

var _require2 = require('immutable'),
    List = _require2.List;

var isList = function isList(node) {
    return node.type === BLOCKS.OL_LIST || node.type === BLOCKS.UL_LIST;
};
var isLink = function isLink(node) {
    return node.type === INLINES.LINK;
};

/**
 * Create a summary article from a list item.
 * @param  {Block} item
 * @return {SummaryArticleLike | Null} article
 */
function createArticleFromItem(item) {
    var nodes = item.nodes;

    // Find the link that represents the article's title

    var linkParent = nodes.filterNot(isList).find(function (node) {
        return node.findDescendant(isLink);
    });

    // Or find text that could act as title
    var textParent = nodes.filterNot(function (node) {
        return isList(node) || node.isEmpty;
    }).first();

    var title = void 0,
        ref = void 0,
        parent = void 0;
    if (linkParent) {
        var link = linkParent.findDescendant(isLink);

        if (!link.isEmpty) {
            parent = linkParent;
            title = link.text;
            ref = link.data.get('href');
        }
    }

    if (!parent) {
        // Could not find a proper link

        if (textParent) {
            parent = textParent;
            title = textParent.text;
            ref = null;
        } else {
            // This item has no proper title or link
            return null;
        }
    }

    var list = nodes
    // Skip until after the article's title or link
    .skipUntil(function (node) {
        return node === parent;
    }).skip(1).find(isList);
    var articles = list ? listArticles(list) : [];

    return {
        title: title,
        ref: ref,
        articles: articles
    };
}

/**
 * List articles in a list node.
 * @param  {Block} list
 * @return {List<SummaryArticleLike>} articles
 */
function listArticles(list) {
    var nodes = list.nodes;

    return nodes.map(function (item) {
        return createArticleFromItem(item);
    }).filter(function (article) {
        return Boolean(article);
    });
}

/**
 * List summary parts in a document.
 * @param  {Document} document
 * @return {List<SummaryPart>} parts
 */
function listParts(document) {
    var nodes = document.nodes;

    var parts = [];

    // Keep a reference to a part, waiting for its articles
    var pendingPart = void 0;

    nodes.forEach(function (node) {
        var isHeading = node.type == BLOCKS.HEADING_2 || node.type == BLOCKS.HEADING_3;

        if (isHeading) {
            if (pendingPart) {
                // The previous was empty
                parts.push(pendingPart);
            }
            pendingPart = {
                title: node.text
            };
        }

        if (isList(node)) {
            var articles = listArticles(node);

            if (pendingPart) {
                pendingPart.articles = articles;
                parts.push(pendingPart);
                pendingPart = undefined;
            } else {
                parts.push({
                    title: '',
                    articles: articles
                });
            }
        }
    });

    if (pendingPart) {
        // The last one was empty
        parts.push(pendingPart);
    }

    return List(parts);
}

/**
 * Parse a summary from a document.
 * @param  {Document} document
 * @return {Summary} summary
 */
function summaryFromDocument(document) {
    var parts = listParts(document);
    return Summary.createFromParts(parts);
}

module.exports = summaryFromDocument;
module.exports.listArticles = listArticles;
module.exports.createArticleFromItem = createArticleFromItem;
//# sourceMappingURL=summaryFromDocument.js.map