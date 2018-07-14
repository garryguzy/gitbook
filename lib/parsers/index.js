'use strict';

var path = require('path');

var _require = require('immutable'),
    Map = _require.Map;

var PARSERS = new Map({
    markdown: require('./markdown')
    // asciidoc: require('./asciidoc')
});

var FILE_EXTENSIONS = PARSERS.reduce(function (result, parser) {
    return result.concat(parser.FILE_EXTENSIONS);
}, []);

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
    return PARSERS.find(function (parser) {
        return parser.FILE_EXTENSIONS.includes(ext);
    });
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
    FILE_EXTENSIONS: FILE_EXTENSIONS,
    get: getParser,
    getByExt: getByExt,
    getForFile: getForFile
};
//# sourceMappingURL=index.js.map