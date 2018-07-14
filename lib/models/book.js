'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var path = require('path');

var _require = require('immutable'),
    Record = _require.Record,
    OrderedMap = _require.OrderedMap;

var Logger = require('../utils/logger');

var FS = require('./fs');
var Config = require('./config');
var Readme = require('./readme');
var Summary = require('./summary');
var Glossary = require('./glossary');
var Languages = require('./languages');
var Ignore = require('./ignore');

var DEFAULTS = {
    // Logger for output message
    logger: new Logger(),
    // Filesystem binded to the book scope to read files/directories
    fs: new FS(),
    // Ignore files parser
    ignore: new Ignore(),
    // Structure files
    config: new Config(),
    readme: new Readme(),
    summary: new Summary(),
    glossary: new Glossary(),
    languages: new Languages(),
    // ID of the language for language books
    language: String(),
    // List of children, if multilingual (String -> Book)
    books: new OrderedMap()
};

var Book = function (_Record) {
    _inherits(Book, _Record);

    function Book() {
        _classCallCheck(this, Book);

        return _possibleConstructorReturn(this, (Book.__proto__ || Object.getPrototypeOf(Book)).apply(this, arguments));
    }

    _createClass(Book, [{
        key: 'getLogger',
        value: function getLogger() {
            return this.get('logger');
        }
    }, {
        key: 'getFS',
        value: function getFS() {
            return this.get('fs');
        }
    }, {
        key: 'getIgnore',
        value: function getIgnore() {
            return this.get('ignore');
        }
    }, {
        key: 'getConfig',
        value: function getConfig() {
            return this.get('config');
        }
    }, {
        key: 'getReadme',
        value: function getReadme() {
            return this.get('readme');
        }
    }, {
        key: 'getSummary',
        value: function getSummary() {
            return this.get('summary');
        }
    }, {
        key: 'getGlossary',
        value: function getGlossary() {
            return this.get('glossary');
        }
    }, {
        key: 'getLanguages',
        value: function getLanguages() {
            return this.get('languages');
        }
    }, {
        key: 'getBooks',
        value: function getBooks() {
            return this.get('books');
        }
    }, {
        key: 'getLanguage',
        value: function getLanguage() {
            return this.get('language');
        }

        /**
         * Return FS instance to access the content
         * @return {FS}
         */

    }, {
        key: 'getContentFS',
        value: function getContentFS() {
            var fs = this.getFS();
            var config = this.getConfig();
            var rootFolder = config.getValue('root');

            if (rootFolder) {
                return FS.reduceScope(fs, rootFolder);
            }

            return fs;
        }

        /**
         * Return root of the book
         *
         * @return {String}
         */

    }, {
        key: 'getRoot',
        value: function getRoot() {
            var fs = this.getFS();
            return fs.getRoot();
        }

        /**
         * Return root for content of the book
         *
         * @return {String}
         */

    }, {
        key: 'getContentRoot',
        value: function getContentRoot() {
            var fs = this.getContentFS();
            return fs.getRoot();
        }

        /**
         * Check if a file is ignore (should not being parsed, etc)
         *
         * @param {String} ref
         * @return {Page|undefined}
         */

    }, {
        key: 'isFileIgnored',
        value: function isFileIgnored(filename) {
            var ignore = this.getIgnore();
            var language = this.getLanguage();

            // Ignore is always relative to the root of the main book
            if (language) {
                filename = path.join(language, filename);
            }

            return ignore.isFileIgnored(filename);
        }

        /**
         * Check if a content file is ignore (should not being parsed, etc)
         *
         * @param {String} ref
         * @return {Page|undefined}
         */

    }, {
        key: 'isContentFileIgnored',
        value: function isContentFileIgnored(filename) {
            var config = this.getConfig();
            var rootFolder = config.getValue('root');

            if (rootFolder) {
                filename = path.join(rootFolder, filename);
            }

            return this.isFileIgnored(filename);
        }

        /**
         * Return a page from a book by its path
         *
         * @param {String} ref
         * @return {Page|undefined}
         */

    }, {
        key: 'getPage',
        value: function getPage(ref) {
            return this.getPages().get(ref);
        }

        /**
         * Is this book the parent of language's books
         * @return {Boolean}
         */

    }, {
        key: 'isMultilingual',
        value: function isMultilingual() {
            return this.getLanguages().getCount() > 0;
        }

        /**
         * Return true if book is associated to a language
         * @return {Boolean}
         */

    }, {
        key: 'isLanguageBook',
        value: function isLanguageBook() {
            return Boolean(this.getLanguage());
        }

        /**
         * Return a languages book
         * @param {String} language
         * @return {Book}
         */

    }, {
        key: 'getLanguageBook',
        value: function getLanguageBook(language) {
            var books = this.getBooks();
            return books.get(language);
        }

        /**
         * Add a new language book
         *
         * @param {String} language
         * @param {Book} book
         * @return {Book}
         */

    }, {
        key: 'addLanguageBook',
        value: function addLanguageBook(language, book) {
            var books = this.getBooks();
            books = books.set(language, book);

            return this.set('books', books);
        }

        /**
         * Set the summary for this book
         *
         * @param {Summary}
         * @return {Book}
         */

    }, {
        key: 'setSummary',
        value: function setSummary(summary) {
            return this.set('summary', summary);
        }

        /**
         * Set the readme for this book
         *
         * @param {Readme}
         * @return {Book}
         */

    }, {
        key: 'setReadme',
        value: function setReadme(readme) {
            return this.set('readme', readme);
        }

        /**
         * Set the configuration for this book
         *
         * @param {Config}
         * @return {Book}
         */

    }, {
        key: 'setConfig',
        value: function setConfig(config) {
            return this.set('config', config);
        }

        /**
         * Set the ignore instance for this book
         *
         @param {Ignore}
         * @return {Book}
         */

    }, {
        key: 'setIgnore',
        value: function setIgnore(ignore) {
            return this.set('ignore', ignore);
        }

        /**
         * Change log level
         *
         * @param {String} level
         * @return {Book}
         */

    }, {
        key: 'setLogLevel',
        value: function setLogLevel(level) {
            this.getLogger().setLevel(level);
            return this;
        }

        /**
         * Infers the default extension for files
         * @return {String}
         */

    }, {
        key: 'getDefaultExt',
        value: function getDefaultExt() {
            // Inferring sources
            var clues = [this.getReadme(), this.getSummary(), this.getGlossary()];

            // List their extensions
            var exts = clues.map(function (clue) {
                var file = clue.getFile();
                if (file.exists()) {
                    return file.getParser().FILE_EXTENSIONS[0];
                } else {
                    return null;
                }
            });
            // Adds the general default extension
            exts.push('.md');

            // Choose the first non null
            return exts.find(function (e) {
                return e !== null;
            });
        }

        /**
         * Infer the default path for a Readme.
         * @param {Boolean} [absolute=false] False for a path relative to
         *     this book's content root
         * @return {String}
         */

    }, {
        key: 'getDefaultReadmePath',
        value: function getDefaultReadmePath(absolute) {
            var defaultPath = 'README' + this.getDefaultExt();
            if (absolute) {
                return path.join(this.getContentRoot(), defaultPath);
            } else {
                return defaultPath;
            }
        }

        /**
         * Infer the default path for a Summary.
         * @param {Boolean} [absolute=false] False for a path relative to
         *     this book's content root
         * @return {String}
         */

    }, {
        key: 'getDefaultSummaryPath',
        value: function getDefaultSummaryPath(absolute) {
            var defaultPath = 'SUMMARY' + this.getDefaultExt();
            if (absolute) {
                return path.join(this.getContentRoot(), defaultPath);
            } else {
                return defaultPath;
            }
        }

        /**
         * Infer the default path for a Glossary.
         * @param {Boolean} [absolute=false] False for a path relative to
         *     this book's content root
         * @return {String}
         */

    }, {
        key: 'getDefaultGlossaryPath',
        value: function getDefaultGlossaryPath(absolute) {
            var defaultPath = 'GLOSSARY' + this.getDefaultExt();
            if (absolute) {
                return path.join(this.getContentRoot(), defaultPath);
            } else {
                return defaultPath;
            }
        }

        /**
         * Create a language book from a parent
         *
         * @param {Book} parent
         * @param {String} language
         * @return {Book}
         */

    }], [{
        key: 'createFromParent',
        value: function createFromParent(parent, language) {
            var ignore = parent.getIgnore();
            var config = parent.getConfig();

            // Set language in configuration
            config = config.setValue('language', language);

            return new Book({
                // Inherits config. logegr and list of ignored files
                logger: parent.getLogger(),
                config: config,
                ignore: ignore,

                language: language,
                fs: FS.reduceScope(parent.getContentFS(), language)
            });
        }

        /**
         * Create a book using a filesystem
         *
         * @param {FS} fs
         * @return {Book}
         */

    }, {
        key: 'createForFS',
        value: function createForFS(fs) {
            return new Book({
                fs: fs
            });
        }
    }]);

    return Book;
}(Record(DEFAULTS));

module.exports = Book;
//# sourceMappingURL=book.js.map