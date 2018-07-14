'use strict';

var Promise = require('../utils/promise');
var timing = require('../utils/timing');
var replaceShortcuts = require('./replaceShortcuts');

/**
 * Render a template
 *
 * @param {TemplateEngine} engine
 * @param {String} filePath: absolute path for the loader
 * @param {String} content
 * @param {Object} context (optional)
 * @return {Promise<String>}
 */
function renderTemplate(engine, filePath, content, context) {
    context = context || {};

    // Mutable objects to contains all blocks requiring post-processing
    var blocks = {};

    // Create nunjucks environment
    var env = engine.toNunjucks(blocks);

    // Replace shortcuts from plugin's blocks
    content = replaceShortcuts(engine.getBlocks(), filePath, content);

    return timing.measure('template.render', Promise.nfcall(env.renderString.bind(env), content, context, {
        path: filePath
    }));
}

module.exports = renderTemplate;
//# sourceMappingURL=render.js.map