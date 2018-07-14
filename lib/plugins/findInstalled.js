'use strict';

var _require = require('immutable'),
    OrderedMap = _require.OrderedMap;

var path = require('path');

var Promise = require('../utils/promise');
var fs = require('../utils/fs');
var Plugin = require('../models/plugin');
var PREFIX = require('../constants/pluginPrefix');

/**
 * Validate if a package name is a GitBook plugin
 *
 * @return {Boolean}
 */
function validateId(name) {
    return name && name.indexOf(PREFIX) === 0;
}

/**
 * Read details about a node module.
 * @param {String} modulePath
 * @param {Number} depth
 * @param {String} parent
 * @return {Plugin} plugin
 */
function readModule(modulePath, depth, parent) {
    var pkg = require(path.join(modulePath, 'package.json'));
    var pluginName = pkg.name.slice(PREFIX.length);

    return new Plugin({
        name: pluginName,
        version: pkg.version,
        path: modulePath,
        depth: depth,
        parent: parent
    });
}

/**
 * List all packages installed inside a folder
 *
 * @param {String} folder
 * @param {Number} depth
 * @param {String} parent
 * @return {Promise<OrderedMap<String:Plugin>>} plugins
 */
function findInstalled(folder) {
    var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    // When tetsing with mock-fs
    if (!folder) {
        return Promise(OrderedMap());
    }

    // Search for gitbook-plugins in node_modules folder
    var node_modules = path.join(folder, 'node_modules');

    // List all folders in node_modules
    return fs.readdir(node_modules).fail(function () {
        return Promise([]);
    }).then(function (modules) {
        return Promise.reduce(modules, function (results, moduleName) {
            // Not a gitbook-plugin
            if (!validateId(moduleName)) {
                return results;
            }

            // Read gitbook-plugin package details
            var moduleFolder = path.join(node_modules, moduleName);
            var plugin = readModule(moduleFolder, depth, parent);

            results = results.set(plugin.getName(), plugin);

            return findInstalled(moduleFolder, depth + 1, plugin.getName()).then(function (innerModules) {
                return results.merge(innerModules);
            });
        }, OrderedMap());
    });
}

module.exports = findInstalled;
//# sourceMappingURL=findInstalled.js.map