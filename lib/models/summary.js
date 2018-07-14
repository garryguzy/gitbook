'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var is = require('is');

var _require = require('immutable'),
    List = _require.List,
    Record = _require.Record;

var LocationUtils = require('../utils/location');
var File = require('./file');
var SummaryPart = require('./summaryPart');
var SummaryArticle = require('./summaryArticle');

var DEFAULTS = {
    file: new File(),
    parts: List()
};

var Summary = function (_Record) {
    _inherits(Summary, _Record);

    function Summary() {
        _classCallCheck(this, Summary);

        return _possibleConstructorReturn(this, (Summary.__proto__ || Object.getPrototypeOf(Summary)).apply(this, arguments));
    }

    _createClass(Summary, [{
        key: 'getFile',
        value: function getFile() {
            return this.get('file');
        }
    }, {
        key: 'getParts',
        value: function getParts() {
            return this.get('parts');
        }

        /**
         * Set file linked to the summary.
         * @param  {File} file
         * @return {Summary}
         */

    }, {
        key: 'setFile',
        value: function setFile(file) {
            return this.merge({ file: file });
        }

        /**
         * Return a part by its index.
         * @param {Number}
         * @return {Part}
         */

    }, {
        key: 'getPart',
        value: function getPart(i) {
            var parts = this.getParts();
            return parts.get(i);
        }

        /**
         * Return an article using an iterator to find it.
         * if "partIter" is set, it can also return a Part.
         *
         * @param {Function} iter
         * @param {Function} partIter
         * @return {Article|Part}
         */

    }, {
        key: 'getArticle',
        value: function getArticle(iter, partIter) {
            var parts = this.getParts();

            return parts.reduce(function (result, part) {
                if (result) return result;

                if (partIter && partIter(part)) return part;
                return SummaryArticle.findArticle(part, iter);
            }, null);
        }

        /**
         * Return a part/article by its level.
         *
         * @param {String} level
         * @return {Article|Part}
         */

    }, {
        key: 'getByLevel',
        value: function getByLevel(level) {
            function iterByLevel(article) {
                return article.getLevel() === level;
            }

            return this.getArticle(iterByLevel, iterByLevel);
        }

        /**
         * Return an article by its path.
         *
         * @param {String} filePath
         * @return {Article}
         */

    }, {
        key: 'getByPath',
        value: function getByPath(filePath) {
            return this.getArticle(function (article) {
                var articlePath = article.getPath();

                return articlePath && LocationUtils.areIdenticalPaths(articlePath, filePath);
            });
        }

        /**
         * Return the first article.
         * @return {Article}
         */

    }, {
        key: 'getFirstArticle',
        value: function getFirstArticle() {
            return this.getArticle(function (article) {
                return true;
            });
        }

        /**
         * Return next article of an article.
         *
         * @param {Article} current
         * @return {Article}
         */

    }, {
        key: 'getNextArticle',
        value: function getNextArticle(current) {
            var level = is.string(current) ? current : current.getLevel();
            var wasPrev = false;

            return this.getArticle(function (article) {
                if (wasPrev) return true;

                wasPrev = article.getLevel() == level;
                return false;
            });
        }

        /**
         * Return previous article of an article.
         *
         * @param {Article} current
         * @return {Article}
         */

    }, {
        key: 'getPrevArticle',
        value: function getPrevArticle(current) {
            var level = is.string(current) ? current : current.getLevel();
            var prev = undefined;

            this.getArticle(function (article) {
                if (article.getLevel() == level) {
                    return true;
                }

                prev = article;
                return false;
            });

            return prev;
        }

        /**
         * Return the parent article, or parent part of an article.
         *
         * @param {String|Article} current
         * @return {Article|Part|Null}
         */

    }, {
        key: 'getParent',
        value: function getParent(level) {
            // Coerce to level
            level = is.string(level) ? level : level.getLevel();

            // Get parent level
            var parentLevel = getParentLevel(level);
            if (!parentLevel) {
                return null;
            }

            // Get parent of the position
            var parentArticle = this.getByLevel(parentLevel);
            return parentArticle || null;
        }

        /**
         * Return all articles as a list.
         *
         * @return {List<Article>}
         */

    }, {
        key: 'getArticlesAsList',
        value: function getArticlesAsList() {
            var accu = [];

            this.getArticle(function (article) {
                accu.push(article);
            });

            return List(accu);
        }

        /**
         * Create a new summary for a list of parts.
         *
         * @param {List|Array} parts
         * @return {Summary}
         */

    }], [{
        key: 'createFromParts',
        value: function createFromParts(parts) {
            parts = parts.map(function (part, i) {
                if (part instanceof SummaryPart) {
                    return part;
                }

                return SummaryPart.create(part, i + 1);
            });

            return new Summary({
                parts: new List(parts)
            });
        }
    }]);

    return Summary;
}(Record(DEFAULTS));

/**
 * Returns parent level of a level.
 *
 * @param {String} level
 * @return {String}
 */


function getParentLevel(level) {
    var parts = level.split('.');
    return parts.slice(0, -1).join('.');
}

module.exports = Summary;
//# sourceMappingURL=summary.js.map