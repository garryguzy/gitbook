'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('immutable'),
    Record = _require.Record,
    Map = _require.Map;

var yaml = require('js-yaml');

var File = require('./file');

var DEFAULTS = {
    file: new File(),
    // Attributes extracted from the YAML header
    attributes: Map(),
    // Content of the page
    content: String(),
    // Direction of the text
    dir: String('ltr')
};

var Page = function (_Record) {
    _inherits(Page, _Record);

    function Page() {
        _classCallCheck(this, Page);

        return _possibleConstructorReturn(this, (Page.__proto__ || Object.getPrototypeOf(Page)).apply(this, arguments));
    }

    _createClass(Page, [{
        key: 'getFile',
        value: function getFile() {
            return this.get('file');
        }
    }, {
        key: 'getAttributes',
        value: function getAttributes() {
            return this.get('attributes');
        }
    }, {
        key: 'getContent',
        value: function getContent() {
            return this.get('content');
        }
    }, {
        key: 'getDir',
        value: function getDir() {
            return this.get('dir');
        }

        /**
         * Return page as text
         * @return {String}
        */

    }, {
        key: 'toText',
        value: function toText() {
            var attrs = this.getAttributes();
            var content = this.getContent();

            if (attrs.size === 0) {
                return content;
            }

            var frontMatter = '---\n' + yaml.safeDump(attrs.toJS(), { skipInvalid: true }) + '---\n\n';
            return frontMatter + content;
        }

        /**
         * Return path of the page
         * @return {String}
        */

    }, {
        key: 'getPath',
        value: function getPath() {
            return this.getFile().getPath();
        }

        /**
         * Create a page for a file
         * @param {File} file
         * @return {Page}
        */

    }], [{
        key: 'createForFile',
        value: function createForFile(file) {
            return new Page({
                file: file
            });
        }
    }]);

    return Page;
}(Record(DEFAULTS));

module.exports = Page;
//# sourceMappingURL=page.js.map