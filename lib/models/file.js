'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var path = require('path');

var _require = require('immutable'),
    Record = _require.Record;

var error = require('../utils/error');
var parsers = require('../parsers');

var DEFAULTS = {
    // Path of the file, relative to the FS
    path: String(),
    // Time when file data last modified
    mtime: Date()
};

var File = function (_Record) {
    _inherits(File, _Record);

    function File() {
        _classCallCheck(this, File);

        return _possibleConstructorReturn(this, (File.__proto__ || Object.getPrototypeOf(File)).apply(this, arguments));
    }

    _createClass(File, [{
        key: 'getPath',
        value: function getPath() {
            return this.get('path');
        }
    }, {
        key: 'getMTime',
        value: function getMTime() {
            return this.get('mtime');
        }

        /**
         * Return the file extension.
         * @return {String}
         */

    }, {
        key: 'exists',


        /**
         * Does the file exists / is set.
         * @return {Boolean}
         */
        value: function exists() {
            return Boolean(this.getPath());
        }

        /**
         * Read and parse the file.
         * @param  {FS} fs
         * @return {Promise<Document>} document
         */

    }, {
        key: 'parse',
        value: function parse(fs) {
            var parser = this.parser;


            if (!parser) {
                return Promise.reject(error.FileNotParsableError({
                    filename: this.path
                }));
            }

            return fs.readAsString(this.path).then(function (content) {
                var document = parser.toDocument(content);
                return document;
            });
        }
    }, {
        key: 'getType',
        value: function getType() {
            return this.type;
        }
    }, {
        key: 'getExtension',
        value: function getExtension() {
            return this.extension;
        }
    }, {
        key: 'getParser',
        value: function getParser() {
            return this.parser;
        }

        /**
         * Create a file from stats informations.
         * @param {String} filepath
         * @param {Object|fs.Stats} stat
         * @return {File}
         */

    }, {
        key: 'extension',
        get: function get() {
            return path.extname(this.getPath()).toLowerCase();
        }

        /**
         * Return the parser for this file..
         * @return {Parser}
         */

    }, {
        key: 'parser',
        get: function get() {
            return parsers.getByExt(this.extension);
        }

        /**
         * Return type of file ('markdown' or 'asciidoc').
         * @return {String}
         */

    }, {
        key: 'type',
        get: function get() {
            var parser = this.parser;

            return parser ? parser.name : undefined;
        }
    }], [{
        key: 'createFromStat',
        value: function createFromStat(filepath, stat) {
            return new File({
                path: filepath,
                mtime: stat.mtime
            });
        }

        /**
         * Create a file with only a path.
         * @param {String} filepath
         * @return {File}
         */

    }, {
        key: 'createWithFilepath',
        value: function createWithFilepath(filepath) {
            return new File({
                path: filepath
            });
        }
    }]);

    return File;
}(Record(DEFAULTS));

module.exports = File;
//# sourceMappingURL=file.js.map