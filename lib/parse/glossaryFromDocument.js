'use strict';

var _require = require('markup-it'),
    BLOCKS = _require.BLOCKS;

var Glossary = require('../models/glossary');

/**
 * Return true if a node is a entry title.
 * @param  {Node} node
 * @return {Boolean}
 */
var isTitle = function isTitle(node) {
    return node.type == BLOCKS.HEADING_2;
};

/**
 * Return true if a node is a entry description.
 * @param  {Node} node
 * @return {Boolean}
 */
var isDescription = function isDescription(node) {
    return node.type !== BLOCKS.HEADING_2 && node.type !== BLOCKS.CODE;
};

/**
 * Parse a readme from a document.
 * @param  {Document} document
 * @return {Readme} readme
 */
function glossaryFromDocument(document) {
    var nodes = document.nodes;

    var entries = [];

    nodes.forEach(function (block, i) {
        var next = nodes.get(i);

        if (isTitle(block)) {
            entries.push({
                name: block.text,
                description: next && isDescription(next) ? next.text : ''
            });
        }
    });

    return Glossary.createFromEntries(entries);
}

module.exports = glossaryFromDocument;
//# sourceMappingURL=glossaryFromDocument.js.map