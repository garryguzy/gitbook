'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var path = require('path');
var url = require('url');

var _require = require('immutable'),
    Record = _require.Record,
    Map = _require.Map;

var LocationUtils = require('../utils/location');

/*
    The URIIndex stores a map of filename to url.
    To resolve urls for each article.
 */

var DEFAULTS = {
    uris: Map(),
    directoryIndex: Boolean(true)
};

/**
 * Modify an url path while preserving the hash
 * @param {String} input
 * @param {Function<String>} transform
 * @return {String} output
 */
function transformURLPath(input, transform) {
    // Split anchor
    var parsed = url.parse(input);
    input = parsed.pathname || '';

    input = transform(input);

    // Add back anchor
    input = input + (parsed.hash || '');

    return input;
}

var URIIndex = function (_Record) {
    _inherits(URIIndex, _Record);

    function URIIndex(index) {
        _classCallCheck(this, URIIndex);

        return _possibleConstructorReturn(this, (URIIndex.__proto__ || Object.getPrototypeOf(URIIndex)).call(this, {
            uris: Map(index).mapKeys(function (key) {
                return LocationUtils.normalize(key);
            })
        }));
    }

    /**
     * Append a file to the index
     * @param {String} filePath
     * @param {String} url
     * @return {URIIndex}
     */


    _createClass(URIIndex, [{
        key: 'append',
        value: function append(filePath, uri) {
            var uris = this.uris;

            filePath = LocationUtils.normalize(filePath);

            return this.merge({
                uris: uris.set(filePath, uri)
            });
        }

        /**
         * Resolve an absolute file path to an url.
         *
         * @param {String} filePath
         * @return {String} url
         */

    }, {
        key: 'resolve',
        value: function resolve(filePath) {
            var _this2 = this;

            if (LocationUtils.isExternal(filePath)) {
                return filePath;
            }

            return transformURLPath(filePath, function (href) {
                var uris = _this2.uris;

                href = LocationUtils.normalize(href);

                return uris.get(href, href);
            });
        }

        /**
         * Resolve a filename to an url, considering that the link to "filePath"
         * in the file "originPath".
         *
         * For example if we are generating doc/README.md and we have a link "/READNE.md":
         * index.resolveFrom('doc/README.md', '/README.md') === '../index.html'
         *
         * @param  {String} originPath
         * @param  {String} filePath
         * @return {String} url
         */

    }, {
        key: 'resolveFrom',
        value: function resolveFrom(originPath, filePath) {
            var _this3 = this;

            if (LocationUtils.isExternal(filePath)) {
                return filePath;
            }

            var originURL = this.resolve(originPath);
            var originDir = path.dirname(originPath);
            var originOutDir = path.dirname(originURL);

            return transformURLPath(filePath, function (href) {
                if (!href) {
                    return href;
                }
                // Calcul absolute path for this
                href = LocationUtils.toAbsolute(href, originDir, '.');

                // Resolve file
                href = _this3.resolve(href);

                // Convert back to relative
                href = LocationUtils.relative(originOutDir, href);

                return href;
            });
        }

        /**
         * Normalize an url
         * @param  {String} uri
         * @return {String} uri
         */

    }, {
        key: 'normalizeURL',
        value: function normalizeURL(uri) {
            var directoryIndex = this.directoryIndex;


            if (!directoryIndex || LocationUtils.isExternal(uri)) {
                return uri;
            }

            return transformURLPath(uri, function (pathname) {
                if (path.basename(pathname) == 'index.html') {
                    pathname = path.dirname(pathname) + '/';
                }

                return pathname;
            });
        }

        /**
         * Resolve an entry to an url
         * @param {String} filePath
         * @return {String}
         */

    }, {
        key: 'resolveToURL',
        value: function resolveToURL(filePath) {
            var uri = this.resolve(filePath);
            return this.normalizeURL(uri);
        }

        /**
         * Resolve an entry to an url
         *
         * @param  {String} originPath
         * @param  {String} filePath
         * @return {String} url
         */

    }, {
        key: 'resolveToURLFrom',
        value: function resolveToURLFrom(originPath, filePath) {
            var uri = this.resolveFrom(originPath, filePath);
            return this.normalizeURL(uri);
        }
    }]);

    return URIIndex;
}(Record(DEFAULTS));

module.exports = URIIndex;
//# sourceMappingURL=uriIndex.js.map