'use strict';

var _require = require('immutable'),
    List = _require.List;

var parsers = require('../parsers');

/**
 * Return a list of all shortcuts that can apply
 * to a file for a TemplatEngine
 *
 * @param {List<TemplateBlock>} engine
 * @param {String} filePath
 * @return {List<TemplateShortcut>} shortcuts
 */
function listShortcuts(blocks, filePath) {
    var parser = parsers.getForFile(filePath);

    if (!parser) {
        return List();
    }

    return blocks.map(function (block) {
        return block.getShortcuts();
    }).filter(function (shortcuts) {
        return shortcuts && shortcuts.acceptParser(parser.name);
    });
}

module.exports = listShortcuts;
//# sourceMappingURL=listShortcuts.js.map