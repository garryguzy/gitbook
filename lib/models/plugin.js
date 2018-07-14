'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('immutable'),
    Record = _require.Record,
    Map = _require.Map;

var TemplateBlock = require('./templateBlock');
var PluginDependency = require('./pluginDependency');
var THEME_PREFIX = require('../constants/themePrefix');

var DEFAULT_VERSION = '*';

var DEFAULTS = {
    name: String(),
    // Requirement version (ex: ">1.0.0")
    version: String(DEFAULT_VERSION),
    // Path to load this plugin
    path: String(),
    // Depth of this plugin in the dependency tree
    depth: Number(0),
    // Parent depending on this plugin
    parent: String(),
    // Content of the "package.json"
    package: Map(),
    // Content of the package itself
    content: Map()
};

var Plugin = function (_Record) {
    _inherits(Plugin, _Record);

    function Plugin() {
        _classCallCheck(this, Plugin);

        return _possibleConstructorReturn(this, (Plugin.__proto__ || Object.getPrototypeOf(Plugin)).apply(this, arguments));
    }

    _createClass(Plugin, [{
        key: 'getName',
        value: function getName() {
            return this.get('name');
        }
    }, {
        key: 'getPath',
        value: function getPath() {
            return this.get('path');
        }
    }, {
        key: 'getVersion',
        value: function getVersion() {
            return this.get('version');
        }
    }, {
        key: 'getPackage',
        value: function getPackage() {
            return this.get('package');
        }
    }, {
        key: 'getContent',
        value: function getContent() {
            return this.get('content');
        }
    }, {
        key: 'getDepth',
        value: function getDepth() {
            return this.get('depth');
        }
    }, {
        key: 'getParent',
        value: function getParent() {
            return this.get('parent');
        }

        /**
         * Return the ID on NPM for this plugin
         * @return {String}
         */

    }, {
        key: 'getNpmID',
        value: function getNpmID() {
            return PluginDependency.nameToNpmID(this.getName());
        }

        /**
         * Check if a plugin is loaded
         * @return {Boolean}
         */

    }, {
        key: 'isLoaded',
        value: function isLoaded() {
            return Boolean(this.getPackage().size > 0);
        }

        /**
         * Check if a plugin is a theme given its name
         * @return {Boolean}
         */

    }, {
        key: 'isTheme',
        value: function isTheme() {
            var name = this.getName();
            return name && name.indexOf(THEME_PREFIX) === 0;
        }

        /**
         * Return map of hooks
         * @return {Map<String:Function>}
         */

    }, {
        key: 'getHooks',
        value: function getHooks() {
            return this.getContent().get('hooks') || Map();
        }

        /**
         * Return map of filters
         * @return {Map<String:Function>}
         */

    }, {
        key: 'getFilters',
        value: function getFilters() {
            return this.getContent().get('filters');
        }

        /**
         * Return map of blocks
         * @return {Map<String:TemplateBlock>}
         */

    }, {
        key: 'getBlocks',
        value: function getBlocks() {
            var blocks = this.getContent().get('blocks');
            blocks = blocks || Map();

            return blocks.map(function (block, blockName) {
                return TemplateBlock.create(blockName, block);
            });
        }

        /**
         * Return a specific hook
         * @param {String} name
         * @return {Function|undefined}
         */

    }, {
        key: 'getHook',
        value: function getHook(name) {
            return this.getHooks().get(name);
        }

        /**
         * Create a plugin from a string
         * @param {String}
         * @return {Plugin}
         */

    }], [{
        key: 'createFromString',
        value: function createFromString(s) {
            var parts = s.split('@');
            var name = parts[0];
            var version = parts.slice(1).join('@');

            return new Plugin({
                name: name,
                version: version || DEFAULT_VERSION
            });
        }

        /**
         * Create a plugin from a dependency
         * @param {PluginDependency}
         * @return {Plugin}
         */

    }, {
        key: 'createFromDep',
        value: function createFromDep(dep) {
            return new Plugin({
                name: dep.getName(),
                version: dep.getVersion()
            });
        }
    }]);

    return Plugin;
}(Record(DEFAULTS));

Plugin.nameToNpmID = PluginDependency.nameToNpmID;

module.exports = Plugin;
//# sourceMappingURL=plugin.js.map