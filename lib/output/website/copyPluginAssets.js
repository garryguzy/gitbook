'use strict';

var path = require('path');

var ASSET_FOLDER = require('../../constants/pluginAssetsFolder');
var Promise = require('../../utils/promise');
var fs = require('../../utils/fs');

/**
 * Copy all assets from plugins.
 * Assets are files stored in a "_assets" of the plugin.
 *
 * @param {Output}
 * @return {Promise}
 */
function copyPluginAssets(output) {
    var book = output.getBook();

    // Don't copy plugins assets for language book
    // It'll be resolved to the parent folder
    if (book.isLanguageBook()) {
        return Promise(output);
    }

    var plugins = output.getPlugins();

    return Promise.forEach(plugins, function (plugin) {
        return copyAssets(output, plugin).then(function () {
            return copyBrowserJS(output, plugin);
        });
    }).then(function () {
        return copyCoreJS(output);
    }).thenResolve(output);
}

/**
 * Copy assets from a plugin
 *
 * @param {Plugin}
 * @return {Promise}
 */
function copyAssets(output, plugin) {
    var logger = output.getLogger();
    var pluginRoot = plugin.getPath();
    var options = output.getOptions();

    var outputRoot = options.get('root');
    var prefix = options.get('prefix');

    var assetFolder = path.join(pluginRoot, ASSET_FOLDER, prefix);
    var assetOutputFolder = path.join(outputRoot, 'gitbook', plugin.getName());

    if (!fs.existsSync(assetFolder)) {
        return Promise();
    }

    logger.debug.ln('copy assets from plugin', assetFolder);
    return fs.copyDir(assetFolder, assetOutputFolder, {
        deleteFirst: false,
        overwrite: true,
        confirm: true
    });
}

/**
 * Copy JS file for the plugin
 *
 * @param {Plugin}
 * @return {Promise}
 */
function copyBrowserJS(output, plugin) {
    var logger = output.getLogger();
    var pluginRoot = plugin.getPath();
    var options = output.getOptions();
    var outputRoot = options.get('root');

    var browserFile = plugin.getPackage().get('browser');

    if (!browserFile) {
        return Promise();
    }

    browserFile = path.join(pluginRoot, browserFile);
    var outputFile = path.join(outputRoot, 'gitbook/plugins', plugin.getName() + '.js');

    logger.debug.ln('copy browser JS file from plugin', browserFile);
    return fs.ensureFile(outputFile).then(function () {
        return fs.copy(browserFile, outputFile);
    });
}

/**
 * Copy JS file for gitbook-core
 *
 * @param {Plugin}
 * @return {Promise}
 */
function copyCoreJS(output) {
    var logger = output.getLogger();
    var options = output.getOptions();
    var outputRoot = options.get('root');

    var inputFile = require.resolve('gitbook-core/dist/gitbook.core.min.js');
    var outputFile = path.join(outputRoot, 'gitbook/core.js');

    logger.debug.ln('copy JS for gitbook-core');
    return fs.ensureFile(outputFile).then(function () {
        return fs.copy(inputFile, outputFile);
    });
}

module.exports = copyPluginAssets;
//# sourceMappingURL=copyPluginAssets.js.map