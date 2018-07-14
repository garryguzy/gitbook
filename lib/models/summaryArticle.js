'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('immutable'),
    Record = _require.Record,
    List = _require.List;

var location = require('../utils/location');

var DEFAULTS = {
    level: String(),
    title: String(),
    ref: String(),
    articles: List()
};

/**
 * An article represents an entry in the Summary / table of Contents.
 * @type {Class}
 */

var SummaryArticle = function (_Record) {
    _inherits(SummaryArticle, _Record);

    function SummaryArticle() {
        _classCallCheck(this, SummaryArticle);

        return _possibleConstructorReturn(this, (SummaryArticle.__proto__ || Object.getPrototypeOf(SummaryArticle)).apply(this, arguments));
    }

    _createClass(SummaryArticle, [{
        key: 'getLevel',
        value: function getLevel() {
            return this.get('level');
        }
    }, {
        key: 'getTitle',
        value: function getTitle() {
            return this.get('title');
        }
    }, {
        key: 'getRef',
        value: function getRef() {
            return this.get('ref');
        }
    }, {
        key: 'getArticles',
        value: function getArticles() {
            return this.get('articles');
        }

        /**
         * Return how deep the article is.
         * The README has a depth of 1
         *
         * @return {Number}
         */

    }, {
        key: 'getDepth',
        value: function getDepth() {
            return this.getLevel().split('.').length - 1;
        }

        /**
         * Get path (without anchor) to the pointing file.
         * It also normalizes the file path.
         *
         * @return {String}
         */

    }, {
        key: 'getPath',
        value: function getPath() {
            if (this.isExternal()) {
                return undefined;
            }

            var ref = this.getRef();
            if (!ref) {
                return undefined;
            }

            var parts = ref.split('#');

            var pathname = parts.length > 1 ? parts.slice(0, -1).join('#') : ref;

            // Normalize path to remove ('./', '/...', etc)
            return location.flatten(pathname);
        }

        /**
         * Return url if article is external.
         * @return {String}
         */

    }, {
        key: 'getUrl',
        value: function getUrl() {
            return this.isExternal() ? this.getRef() : undefined;
        }

        /**
         * Get anchor for this article (or undefined).
         * @return {String}
         */

    }, {
        key: 'getAnchor',
        value: function getAnchor() {
            var ref = this.getRef();
            var parts = ref.split('#');

            var anchor = parts.length > 1 ? '#' + parts[parts.length - 1] : undefined;
            return anchor;
        }

        /**
         * Create a new level for a new child article.
         * @return {String}
         */

    }, {
        key: 'createChildLevel',
        value: function createChildLevel() {
            var level = this.getLevel();
            var subArticles = this.getArticles();
            var childLevel = level + '.' + (subArticles.size + 1);

            return childLevel;
        }

        /**
         * Is article pointing to a page of an absolute url.
         * @return {Boolean}
         */

    }, {
        key: 'isPage',
        value: function isPage() {
            return !this.isExternal() && this.getRef();
        }

        /**
         * Check if this article is a file (exatcly)
         *
         * @param {File} file
         * @return {Boolean}
         */

    }, {
        key: 'isFile',
        value: function isFile(file) {
            return file.path === this.getPath() && this.getAnchor() === undefined;
        }

        /**
         * Check if this article is the introduction of the book
         *
         * @param {Book|Readme} book
         * @return {Boolean}
         */

    }, {
        key: 'isReadme',
        value: function isReadme(book) {
            var readme = book.getFile ? book : book.getReadme();
            var file = readme.getFile();

            return this.isFile(file);
        }

        /**
         * Is article pointing to aan absolute url
         *
         * @return {Boolean}
         */

    }, {
        key: 'isExternal',
        value: function isExternal() {
            return location.isExternal(this.getRef());
        }

        /**
         * Create a SummaryArticle
         *
         * @param {Object} def
         * @return {SummaryArticle}
         */

    }], [{
        key: 'create',
        value: function create(def, level) {
            var articles = (def.articles || []).map(function (article, i) {
                if (article instanceof SummaryArticle) {
                    return article;
                }
                return SummaryArticle.create(article, [level, i + 1].join('.'));
            });

            return new SummaryArticle({
                level: level,
                title: def.title,
                ref: def.ref || def.path || '',
                articles: List(articles)
            });
        }

        /**
         * Find an article from a base one
         *
         * @param {Article|Part} base
         * @param {Function(article)} iter
         * @return {Article}
         */

    }, {
        key: 'findArticle',
        value: function findArticle(base, iter) {
            var articles = base.getArticles();

            return articles.reduce(function (result, article) {
                if (result) return result;

                if (iter(article)) {
                    return article;
                }

                return SummaryArticle.findArticle(article, iter);
            }, null);
        }
    }]);

    return SummaryArticle;
}(Record(DEFAULTS));

module.exports = SummaryArticle;
//# sourceMappingURL=summaryArticle.js.map