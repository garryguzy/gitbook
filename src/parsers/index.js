const path = require('path');
const { Map } = require('immutable');

const PARSERS = new Map({
    markdown: require('./markdown')
    // asciidoc: require('./asciidoc')
});

const FILE_EXTENSIONS = PARSERS.reduce((result, parser) => result.concat(parser.FILE_EXTENSIONS), []);

/**
 * Return a specific parser by its name
 *
 * @param {String} name
 * @return {Parser} parser?
 */
function getParser(name) {
    return PARSERS.get(name);
}

/**
 * Return a specific parser according to an extension
 *
 * @param {String} ext
 * @return {Parser} parser?
 */
function getByExt(ext) {
    return PARSERS.find(parser => parser.FILE_EXTENSIONS.includes(ext));
}

/**
 * Return parser for a file
 *
 * @param {String} ext
 * @return {Parser} parser?
 */
function getForFile(filename) {
    return getByExt(path.extname(filename));
}

module.exports = {
    FILE_EXTENSIONS,
    get: getParser,
    getByExt,
    getForFile
};
