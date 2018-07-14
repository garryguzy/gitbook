'use strict';

var resolve = require('resolve');

var _require = require('../utils/command'),
    exec = _require.exec;

var resolveVersion = require('./resolveVersion');

/**
 * Install a plugin for a book
 *
 * @param {Book} book
 * @param {PluginDependency} plugin
 * @return {Promise}
 */
function installPlugin(book, plugin) {
    var logger = book.getLogger();

    var installFolder = book.getRoot();
    var name = plugin.getName();
    var requirement = plugin.getVersion();

    logger.info.ln('');
    logger.info.ln('installing plugin "' + name + '"');

    var installerBin = resolve.sync('ied/lib/cmd.js');

    // Find a version to install
    return resolveVersion(plugin).then(function (version) {
        if (!version) {
            throw new Error('Found no satisfactory version for plugin "' + name + '" with requirement "' + requirement + '"');
        }

        logger.info.ln('install plugin "' + name + '" (' + requirement + ') with version', version);

        var npmID = plugin.getNpmID();
        var command = installerBin + ' install ' + npmID + '@' + version;

        return exec(command, { cwd: installFolder });
    }).then(function () {
        logger.info.ok('plugin "' + name + '" installed with success');
    });
}

module.exports = installPlugin;
//# sourceMappingURL=installPlugin.js.map