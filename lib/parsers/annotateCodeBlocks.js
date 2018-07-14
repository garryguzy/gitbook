'use strict';

var _require = require('markup-it'),
    Block = _require.Block,
    Text = _require.Text,
    Inline = _require.Inline,
    INLINES = _require.INLINES,
    BLOCKS = _require.BLOCKS,
    MARKS = _require.MARKS;

var RAW_START = 'raw';
var RAW_END = 'endraw';

/**
 * Create a templating node.
 * @param {String} expr
 * @return {Node}
 */
function createTemplatingNode(expr) {
    return Inline.create({
        type: INLINES.TEMPLATE,
        data: {
            type: 'expr',
            text: expr
        }
    });
}

/**
 * Escape a code block.
 * @param  {Block} block
 * @return {Array<Node>} blocks
 */
function escapeCodeBlock(block) {
    return [Block.create({
        type: BLOCKS.TEXT,
        nodes: [createTemplatingNode(RAW_START)]
    }), block, Block.create({
        type: BLOCKS.TEXT,
        nodes: [createTemplatingNode(RAW_END)]
    })];
}

/**
 * Escape a text node.
 * @param  {Text} node
 * @return {Array<Node>} nodes
 */
function escapeTextNode(node) {
    var ranges = node.getRanges();

    var nodes = ranges.reduce(function (result, range) {
        var hasCode = range.marks.some(function (mark) {
            return mark.type == MARKS.CODE;
        });
        var text = Text.createFromRanges([range]);

        if (hasCode) {
            return result.concat([createTemplatingNode(RAW_START), text, createTemplatingNode(RAW_END)]);
        }

        return result.concat([text]);
    }, []);

    return nodes;
}

/**
 * Annotate a block container.
 * @param  {Node} parent
 * @param  {Number} levelRaw
 * @return {Node} node
 * @return {Number} levelRaw
 */
function annotateNode(parent, levelRaw) {
    var nodes = parent.nodes;


    nodes = nodes.reduce(function (out, node) {
        if (node.type === INLINES.TEMPLATE) {
            var _node$data$toJS = node.data.toJS(),
                type = _node$data$toJS.type,
                text = _node$data$toJS.text;

            if (type === 'expr') {
                if (text === 'raw') {
                    levelRaw = levelRaw + 1;
                } else if (text == 'endraw') {
                    levelRaw = 0;
                }
            }

            return out.concat([node]);
        } else if (node.type === BLOCKS.CODE) {
            return out.concat(levelRaw == 0 ? escapeCodeBlock(node) : [node]);
        } else if (node.kind == 'text') {
            return out.concat(levelRaw == 0 ? escapeTextNode(node) : [node]);
        }

        var result = annotateNode(node, levelRaw);
        levelRaw = result.levelRaw;
        return out.concat([result.node]);
    }, []);

    return {
        levelRaw: levelRaw,
        node: parent.merge({ nodes: nodes })
    };
}

/**
 * Add templating "raw" to code blocks to
 * avoid nunjucks processing their content.
 *
 * @param {Document} document
 * @return {Document}
 */
function annotateCodeBlocks(document) {
    return annotateNode(document, 0).node;
}

module.exports = annotateCodeBlocks;
//# sourceMappingURL=annotateCodeBlocks.js.map