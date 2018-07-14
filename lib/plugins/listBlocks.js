'use strict';

var _require = require('immutable'),
    Map = _require.Map;

/**
 * List blocks from a list of plugins
 *
 * @param {OrderedMap<String:Plugin>}
 * @return {Map<String:TemplateBlock>}
 */


function listBlocks(plugins) {
    return plugins.reverse().reduce(function (result, plugin) {
        var blocks = plugin.getBlocks();
        return result.merge(blocks);
    }, Map());
}

module.exports = listBlocks;
//# sourceMappingURL=listBlocks.js.map