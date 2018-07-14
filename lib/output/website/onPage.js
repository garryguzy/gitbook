'use strict';

var JSONUtils = require('../../json');
var Modifiers = require('../modifiers');
var writeFile = require('../helper/writeFile');
var getModifiers = require('../getModifiers');
var render = require('../../browser/render');

/**
 * Generate a page using react and the plugins.
 *
 * @param {Output} output
 * @param {Page} page
 */
function onPage(output, page) {
    var file = page.getFile();
    var plugins = output.getPlugins();
    var urls = output.getURLIndex();

    // Output file path
    var filePath = urls.resolve(file.getPath());

    return Modifiers.modifyHTML(page, getModifiers(output, page)).then(function (resultPage) {
        // Generate the context
        var initialState = JSONUtils.encodeState(output, resultPage);

        // Render the theme
        var html = render(plugins, initialState, 'browser', 'website:body');

        // Write it to the disk
        return writeFile(output, filePath, html);
    });
}

module.exports = onPage;
//# sourceMappingURL=onPage.js.map