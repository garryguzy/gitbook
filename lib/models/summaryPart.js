'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('immutable'),
    Record = _require.Record,
    List = _require.List;

var SummaryArticle = require('./summaryArticle');

var DEFAULTS = {
    level: String(),
    title: String(),
    articles: List()
};

/**
 * A part represents a section in the Summary / table of Contents.
 * @type {Class}
 */

var SummaryPart = function (_Record) {
    _inherits(SummaryPart, _Record);

    function SummaryPart() {
        _classCallCheck(this, SummaryPart);

        return _possibleConstructorReturn(this, (SummaryPart.__proto__ || Object.getPrototypeOf(SummaryPart)).apply(this, arguments));
    }

    _createClass(SummaryPart, [{
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
        key: 'getArticles',
        value: function getArticles() {
            return this.get('articles');
        }

        /**
         * Create a new level for a new child article
         *
         * @return {String}
         */

    }, {
        key: 'createChildLevel',
        value: function createChildLevel() {
            var level = this.level,
                articles = this.articles;

            return level + '.' + (articles.size + 1);
        }

        /**
         * Create a SummaryPart
         *
         * @param {Object} def
         * @return {SummaryPart}
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

            return new SummaryPart({
                level: String(level),
                title: def.title,
                articles: List(articles)
            });
        }
    }]);

    return SummaryPart;
}(Record(DEFAULTS));

module.exports = SummaryPart;
//# sourceMappingURL=summaryPart.js.map