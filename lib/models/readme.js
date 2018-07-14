'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('immutable'),
    Record = _require.Record;

var File = require('./file');

var DEFAULTS = {
    file: new File()
};

var Readme = function (_Record) {
    _inherits(Readme, _Record);

    function Readme() {
        _classCallCheck(this, Readme);

        return _possibleConstructorReturn(this, (Readme.__proto__ || Object.getPrototypeOf(Readme)).apply(this, arguments));
    }

    _createClass(Readme, [{
        key: 'getFile',
        value: function getFile() {
            return this.get('file');
        }

        /**
         * Set file linked to the readme.
         * @param  {File} file
         * @return {Readme}
         */

    }, {
        key: 'setFile',
        value: function setFile(file) {
            return this.merge({ file: file });
        }

        /**
         * Create a new readme
         *
         * @param {Object} def
         * @return {Readme}
         */

    }], [{
        key: 'create',
        value: function create(def) {
            def = def || {};

            return new Readme({
                file: def.file || ''
            });
        }
    }]);

    return Readme;
}(Record(DEFAULTS));

module.exports = Readme;
//# sourceMappingURL=readme.js.map