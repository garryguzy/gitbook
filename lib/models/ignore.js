'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('immutable'),
    Record = _require.Record;

var IgnoreMutable = require('ignore');

/*
    Immutable version of node-ignore
*/

var DEFAULTS = {
    ignore: new IgnoreMutable()
};

var Ignore = function (_Record) {
    _inherits(Ignore, _Record);

    function Ignore() {
        _classCallCheck(this, Ignore);

        return _possibleConstructorReturn(this, (Ignore.__proto__ || Object.getPrototypeOf(Ignore)).apply(this, arguments));
    }

    _createClass(Ignore, [{
        key: 'getIgnore',
        value: function getIgnore() {
            return this.get('ignore');
        }

        /**
         * Test if a file is ignored by these rules.
         * @param {String} filePath
         * @return {Boolean} isIgnored
         */

    }, {
        key: 'isFileIgnored',
        value: function isFileIgnored(filename) {
            var ignore = this.getIgnore();
            return ignore.filter([filename]).length == 0;
        }

        /**
         * Add rules.
         * @param {String}
         * @return {Ignore}
         */

    }, {
        key: 'add',
        value: function add(rule) {
            var ignore = this.getIgnore();
            var newIgnore = new IgnoreMutable();

            newIgnore.add(ignore);
            newIgnore.add(rule);

            return this.set('ignore', newIgnore);
        }
    }]);

    return Ignore;
}(Record(DEFAULTS));

module.exports = Ignore;
//# sourceMappingURL=ignore.js.map