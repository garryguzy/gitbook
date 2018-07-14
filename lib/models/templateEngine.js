'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var nunjucks = require('nunjucks');

var _require = require('immutable'),
    Record = _require.Record,
    Map = _require.Map,
    List = _require.List;

var DEFAULTS = {
    // List of {TemplateBlock}
    blocks: List(),
    // Map of Extension
    extensions: Map(),
    // Map of filters: {String} name -> {Function} fn
    filters: Map(),
    // Map of globals: {String} name -> {Mixed}
    globals: Map(),
    // Context for filters / blocks
    context: Object(),
    // Nunjucks loader
    loader: nunjucks.FileSystemLoader('views')
};

var TemplateEngine = function (_Record) {
    _inherits(TemplateEngine, _Record);

    function TemplateEngine() {
        _classCallCheck(this, TemplateEngine);

        return _possibleConstructorReturn(this, (TemplateEngine.__proto__ || Object.getPrototypeOf(TemplateEngine)).apply(this, arguments));
    }

    _createClass(TemplateEngine, [{
        key: 'getBlocks',
        value: function getBlocks() {
            return this.get('blocks');
        }
    }, {
        key: 'getGlobals',
        value: function getGlobals() {
            return this.get('globals');
        }
    }, {
        key: 'getFilters',
        value: function getFilters() {
            return this.get('filters');
        }
    }, {
        key: 'getShortcuts',
        value: function getShortcuts() {
            return this.get('shortcuts');
        }
    }, {
        key: 'getLoader',
        value: function getLoader() {
            return this.get('loader');
        }
    }, {
        key: 'getContext',
        value: function getContext() {
            return this.get('context');
        }
    }, {
        key: 'getExtensions',
        value: function getExtensions() {
            return this.get('extensions');
        }

        /**
         * Return a block by its name (or undefined).
         * @param {String} name
         * @return {TemplateBlock} block?
         */

    }, {
        key: 'getBlock',
        value: function getBlock(name) {
            var blocks = this.getBlocks();
            return blocks.find(function (block) {
                return block.getName() === name;
            });
        }

        /**
         * Return a nunjucks environment from this configuration
         * @return {Nunjucks.Environment} env
         */

    }, {
        key: 'toNunjucks',
        value: function toNunjucks() {
            var loader = this.getLoader();
            var blocks = this.getBlocks();
            var filters = this.getFilters();
            var globals = this.getGlobals();
            var extensions = this.getExtensions();
            var context = this.getContext();

            var env = new nunjucks.Environment(loader, {
                // Escaping is done after by the asciidoc/markdown parser
                autoescape: false,

                // Syntax
                tags: {
                    blockStart: '{%',
                    blockEnd: '%}',
                    variableStart: '{{',
                    variableEnd: '}}',
                    commentStart: '{###',
                    commentEnd: '###}'
                }
            });

            // Add filters
            filters.forEach(function (filterFn, filterName) {
                env.addFilter(filterName, filterFn.bind(context));
            });

            // Add blocks
            blocks.forEach(function (block) {
                var extName = block.getExtensionName();
                var Ext = block.toNunjucksExt(context);

                env.addExtension(extName, new Ext());
            });

            // Add globals
            globals.forEach(function (globalValue, globalName) {
                env.addGlobal(globalName, globalValue);
            });

            // Add other extensions
            extensions.forEach(function (ext, extName) {
                env.addExtension(extName, ext);
            });

            return env;
        }

        /**
         * Create a template engine.
         * @param {Object} def
         * @return {TemplateEngine} engine
         */

    }], [{
        key: 'create',
        value: function create(def) {
            return new TemplateEngine({
                blocks: List(def.blocks || []),
                extensions: Map(def.extensions || {}),
                filters: Map(def.filters || {}),
                globals: Map(def.globals || {}),
                context: def.context,
                loader: def.loader
            });
        }
    }]);

    return TemplateEngine;
}(Record(DEFAULTS));

module.exports = TemplateEngine;
//# sourceMappingURL=templateEngine.js.map