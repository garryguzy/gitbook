'use strict';

var path = require('path');

var JSONUtils = require('../../json');
var Promise = require('../../utils/promise');
var error = require('../../utils/error');
var command = require('../../utils/command');
var writeFile = require('../helper/writeFile');
var render = require('../../browser/render');

var getConvertOptions = require('./getConvertOptions');
var SUMMARY_FILE = 'SUMMARY.html';

/**
 * Write the SUMMARY.html
 *
 * @param {Output} output
 * @return {Output} output
 */
function writeSummary(output) {
    var plugins = output.getPlugins();

    // Generate initial state
    var initialState = JSONUtils.encodeState(output);

    // Render using React
    var html = render(plugins, initialState, 'ebook', 'ebook:summary');

    return writeFile(output, SUMMARY_FILE, html);
}

/**
 * Generate the ebook file as "index.pdf"
 *
 * @param {Output} output
 * @return {Output} output
 */
function runEbookConvert(output) {
    var logger = output.getLogger();
    var options = output.getOptions();
    var format = options.get('format');
    var outputFolder = output.getRoot();

    if (!format) {
        return Promise(output);
    }

    return getConvertOptions(output).then(function (options) {
        var cmd = ['ebook-convert', path.resolve(outputFolder, SUMMARY_FILE), path.resolve(outputFolder, 'index.' + format), command.optionsToShellArgs(options)].join(' ');

        return command.exec(cmd).progress(function (data) {
            logger.debug(data);
        }).fail(function (err) {
            if (err.code == 127) {
                throw error.RequireInstallError({
                    cmd: 'ebook-convert',
                    install: 'Install it from Calibre: https://calibre-ebook.com'
                });
            }

            throw error.EbookError(err);
        });
    }).thenResolve(output);
}

/**
 * Finish the generation, generates the SUMMARY.html
 *
 * @param {Output} output
 * @return {Output} output
 */
function onFinish(output) {
    return writeSummary(output).then(runEbookConvert);
}

module.exports = onFinish;
//# sourceMappingURL=onFinish.js.map