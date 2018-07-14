'use strict';

var ReactDOMServer = require('gitbook-core/lib/server');
var GitBook = require('gitbook-core');
var React = GitBook.React;


var timing = require('../utils/timing');
var loadPlugins = require('./loadPlugins');

function HTML(_ref) {
    var head = _ref.head,
        innerHTML = _ref.innerHTML,
        payload = _ref.payload,
        scripts = _ref.scripts,
        bootstrap = _ref.bootstrap;

    var attrs = head.htmlAttributes.toComponent();

    return React.createElement(
        'html',
        attrs,
        React.createElement(
            'head',
            null,
            head.title.toComponent(),
            head.meta.toComponent(),
            head.link.toComponent(),
            head.style.toComponent()
        ),
        React.createElement(
            'body',
            null,
            React.createElement('div', { id: 'content', dangerouslySetInnerHTML: { __html: innerHTML } }),
            scripts.map(function (script) {
                return React.createElement('script', { key: script, src: script });
            }),
            React.createElement('script', { type: 'application/payload+json', dangerouslySetInnerHTML: { __html: payload } }),
            React.createElement('script', { type: 'application/javascript', dangerouslySetInnerHTML: { __html: bootstrap } }),
            head.script.toComponent()
        )
    );
}
HTML.propTypes = {
    head: React.PropTypes.object,
    innerHTML: React.PropTypes.string,
    payload: React.PropTypes.string,
    bootstrap: React.PropTypes.string,
    scripts: React.PropTypes.arrayOf(React.PropTypes.string)
};

/**
 * Get bootstrap code for a role
 * @param  {String} role
 * @return {String}
 */
function getBootstrapCode(role) {
    return '(function() { require("gitbook-core").bootstrap({ role: "' + role + '" }) })()';
}

/**
 * Render a view using plugins.
 *
 * @param  {OrderedMap<String:Plugin>} plugin
 * @param  {Object} initialState
 * @param  {String} type ("ebook" or "browser")
 * @param  {String} role
 * @return {String} html
 */
function render(plugins, initialState, type, role) {
    return timing.measure('browser.render', function () {
        // Load the plugins
        var browserPlugins = loadPlugins(plugins, type);
        var payload = JSON.stringify(initialState);
        var context = GitBook.createContext(browserPlugins, initialState);

        var currentFile = context.getState().file;

        var scripts = plugins.toList().filter(function (plugin) {
            return plugin.getPackage().has(type);
        }).map(function (plugin) {
            return currentFile.relative('gitbook/plugins/' + plugin.getName() + '.js');
        }).toArray();

        var el = GitBook.renderWithContext(context, { role: role });

        // We're done with the context
        context.deactivate();

        // Render inner body
        var innerHTML = ReactDOMServer.renderToString(el);

        // Get headers
        var head = GitBook.Head.rewind();

        // Render whole HTML page
        var htmlEl = React.createElement(HTML, {
            head: head,
            innerHTML: innerHTML,
            payload: payload,
            bootstrap: getBootstrapCode(role),
            scripts: [currentFile.relative('gitbook/core.js')].concat(scripts)
        });

        var html = ReactDOMServer.renderToStaticMarkup(htmlEl);
        return html;
    });
}

module.exports = render;
//# sourceMappingURL=render.js.map