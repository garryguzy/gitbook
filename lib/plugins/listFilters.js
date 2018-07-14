'use strict';

var _require = require('immutable'),
    Map = _require.Map;

/**
 * List filters from a list of plugins
 *
 * @param {OrderedMap<String:Plugin>} plugins
 * @return {Map<String:Function>} filters
 */


function listFilters(plugins) {
    return plugins.reverse().reduce(function (result, plugin) {
        return result.merge(plugin.getFilters());
    }, Map());
}

module.exports = listFilters;
//# sourceMappingURL=listFilters.js.map