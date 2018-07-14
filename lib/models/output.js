'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('immutable'),
    Record = _require.Record,
    OrderedMap = _require.OrderedMap,
    Map = _require.Map,
    List = _require.List;

var Git = require('../utils/git');
var LocationUtils = require('../utils/location');
var Book = require('./book');
var URIIndex = require('./uriIndex');

var DEFAULTS = {
    book: new Book(),
    // Name of the generator being used
    generator: String(),
    // Map of plugins to use (String -> Plugin)
    plugins: OrderedMap(),
    // Map pages to generation (String -> Page)
    pages: OrderedMap(),
    // List of file that are not pages in the book (String)
    assets: List(),
    // Option for the generation
    options: Map(),
    // Internal state for the generation
    state: Map(),
    // Index of urls
    urls: new URIIndex(),
    // Git repositories manager
    git: new Git()
};

var Output = function (_Record) {
    _inherits(Output, _Record);

    function Output() {
        _classCallCheck(this, Output);

        return _possibleConstructorReturn(this, (Output.__proto__ || Object.getPrototypeOf(Output)).apply(this, arguments));
    }

    _createClass(Output, [{
        key: 'getBook',
        value: function getBook() {
            return this.get('book');
        }
    }, {
        key: 'getGenerator',
        value: function getGenerator() {
            return this.get('generator');
        }
    }, {
        key: 'getPlugins',
        value: function getPlugins() {
            return this.get('plugins');
        }
    }, {
        key: 'getPages',
        value: function getPages() {
            return this.get('pages');
        }
    }, {
        key: 'getOptions',
        value: function getOptions() {
            return this.get('options');
        }
    }, {
        key: 'getAssets',
        value: function getAssets() {
            return this.get('assets');
        }
    }, {
        key: 'getState',
        value: function getState() {
            return this.get('state');
        }
    }, {
        key: 'getURLIndex',
        value: function getURLIndex() {
            return this.get('urls');
        }

        /**
         * Return a page byt its file path
         *
         * @param {String} filePath
         * @return {Page|undefined}
         */

    }, {
        key: 'getPage',
        value: function getPage(filePath) {
            filePath = LocationUtils.normalize(filePath);

            var pages = this.getPages();
            return pages.get(filePath);
        }

        /**
         * Get root folder for output.
         * @return {String}
         */

    }, {
        key: 'getRoot',
        value: function getRoot() {
            return this.getOptions().get('root');
        }

        /**
         * Update state of output
         *
         * @param {Map} newState
         * @return {Output}
         */

    }, {
        key: 'setState',
        value: function setState(newState) {
            return this.set('state', newState);
        }

        /**
         * Update options
         *
         * @param {Map} newOptions
         * @return {Output}
         */

    }, {
        key: 'setOptions',
        value: function setOptions(newOptions) {
            return this.set('options', newOptions);
        }

        /**
         * Return logegr for this output (same as book)
         *
         * @return {Logger}
         */

    }, {
        key: 'getLogger',
        value: function getLogger() {
            return this.getBook().getLogger();
        }
    }]);

    return Output;
}(Record(DEFAULTS));

module.exports = Output;
//# sourceMappingURL=output.js.map