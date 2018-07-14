'use strict';

var _require = require('markup-it'),
    State = _require.State;

var markdown = require('markup-it/lib/markdown');
var html = require('markup-it/lib/html');
var annotateCodeBlocks = require('./annotateCodeBlocks');

var FILE_EXTENSIONS = ['.md', '.markdown', '.mdown'];

/**
 * Render a document as markdown.
 * @param  {Document} document
 * @return {String} text
 */
function toText(document) {
    var state = State.create(markdown);
    return state.serializeDocument(document);
}

/**
 * Parse markdown into a document.
 * @param  {String} text
 * @return {Document} document
 */
function toDocument(text) {
    var state = State.create(markdown);
    return state.deserializeToDocument(text);
}

/**
 * Prepare a document for parsing
 * @param  {String} text
 * @return {String} text
 */
function prepare(text) {
    var doc = toDocument(text);
    doc = annotateCodeBlocks(doc);
    return toText(doc);
}

/**
 * Render markdown to HTML.
 * @param  {String} text
 * @return {String} html
 */
function toHTML(text) {
    var document = toDocument(text);
    var state = State.create(html);

    return state.serializeDocument(document);
}

/**
 * Render markdown to inline HTML.
 * @param  {String} text
 * @return {String} html
 */
function toInlineHTML(text) {
    var document = toDocument(text);
    var state = State.create(html);

    return state.serializeDocument(document);
}

module.exports = {
    name: 'markdown',
    FILE_EXTENSIONS: FILE_EXTENSIONS,
    prepare: prepare,
    toText: toText,
    toDocument: toDocument,
    toHTML: toHTML,
    toInlineHTML: toInlineHTML
};
//# sourceMappingURL=markdown.js.map