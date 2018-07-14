'use strict';

var path = require('path');
var timing = require('../utils/timing');

/**
 * Load all browser plugins.
 *
 * @param  {OrderedMap<Plugin>} plugins
 * @param  {String} type ('browser', 'ebook')
 * @return {Array}
 */
function loadPlugins(plugins, type) {
    return timing.measure('browser.loadPlugins', function () {
        return plugins.valueSeq().filter(function (plugin) {
            return plugin.getPackage().has(type);
        }).map(function (plugin) {
            var browserFile = path.resolve(plugin.getPath(), plugin.getPackage().get(type));

            return require(browserFile);
        }).toArray();
    });
}

module.exports = loadPlugins;
//# sourceMappingURL=loadPlugins.js.map