'use strict';

var _require = require('slate'),
    Document = _require.Document,
    Block = _require.Block,
    Inline = _require.Inline,
    Text = _require.Text;

var _require2 = require('markup-it'),
    BLOCKS = _require2.BLOCKS,
    INLINES = _require2.INLINES;

/**
 * Convert an article in a list item node.
 * @param {SummaryArticle} article
 * @return {Block} item
 */


function articleToBlock(article) {
    var title = article.title,
        ref = article.ref,
        articles = article.articles;

    var text = Text.createFromString(title);

    // Text or link ?
    var innerNode = ref ? Inline.create({
        type: INLINES.LINK,
        nodes: [text],
        data: {
            href: ref
        }
    }) : text;

    var nodes = [Block.create({
        type: BLOCKS.TEXT,
        nodes: [innerNode]
    })];

    if (articles.size > 0) {
        nodes.push(articlesToBlock(articles));
    }

    return Block.create({
        type: BLOCKS.LIST_ITEM,
        nodes: nodes
    });
}

/**
 * Convert a list of articles to a list node.
 * @param {List<SummaryArticle>} articles
 * @return {Block} list
 */
function articlesToBlock(articles) {
    var nodes = articles.map(function (article) {
        return articleToBlock(article);
    });
    return Block.create({
        type: BLOCKS.UL_LIST,
        nodes: nodes
    });
}

/**
 * Convert a summary to document.
 * @param  {Summary}  summary
 * @return {Document} document
 */
function summaryToDocument(summary) {
    var parts = summary.parts;

    var nodes = [Block.create({
        type: BLOCKS.HEADING_1,
        nodes: [Text.createFromString('Summary')]
    })];

    parts.forEach(function (part, i) {
        var title = part.title,
            articles = part.articles;


        if (title) {
            nodes.push(Block.create({
                type: BLOCKS.HEADING_2,
                nodes: [Text.createFromString(title)]
            }));
        } else if (i > 0) {
            nodes.push(Block.create({
                type: BLOCKS.HR
            }));
        }

        if (!articles.isEmpty()) {
            nodes.push(articlesToBlock(articles));
        }
    });

    return Document.create({ nodes: nodes });
}

module.exports = summaryToDocument;
//# sourceMappingURL=toDocument.js.map