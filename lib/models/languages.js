'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('immutable'),
    OrderedMap = _require.OrderedMap,
    Record = _require.Record;

var File = require('./file');
var Language = require('./language');

var DEFAULTS = {
    file: new File(),
    list: OrderedMap()
};

var Languages = function (_Record) {
    _inherits(Languages, _Record);

    function Languages() {
        _classCallCheck(this, Languages);

        return _possibleConstructorReturn(this, (Languages.__proto__ || Object.getPrototypeOf(Languages)).apply(this, arguments));
    }

    _createClass(Languages, [{
        key: 'getFile',
        value: function getFile() {
            return this.get('file');
        }
    }, {
        key: 'getList',
        value: function getList() {
            return this.get('list');
        }

        /**
         * Set file linked to the languages index.
         * @param  {File} file
         * @return {Languages}
         */

    }, {
        key: 'setFile',
        value: function setFile(file) {
            return this.merge({ file: file });
        }

        /**
         * Get default languages
         * @return {Language}
         */

    }, {
        key: 'getDefaultLanguage',
        value: function getDefaultLanguage() {
            return this.list.first();
        }

        /**
         * Get a language by its ID.
         * @param {String} lang
         * @return {Language}
         */

    }, {
        key: 'getLanguage',
        value: function getLanguage(lang) {
            return this.list.get(lang);
        }

        /**
         * Return count of langs.
         * @return {Number}
         */

    }, {
        key: 'getCount',
        value: function getCount() {
            return this.list.size;
        }

        /**
         * Create a languages list from a JS object
         *
         * @param {Array}
         * @return {Language}
         */

    }], [{
        key: 'createFromList',
        value: function createFromList(langs) {
            var list = OrderedMap();

            langs.forEach(function (lang) {
                lang = new Language({
                    title: lang.title,
                    path: lang.path || lang.ref
                });
                list = list.set(lang.getID(), lang);
            });

            return new Languages({
                list: list
            });
        }
    }]);

    return Languages;
}(Record(DEFAULTS));

module.exports = Languages;
//# sourceMappingURL=languages.js.map