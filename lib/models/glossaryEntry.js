'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('immutable'),
    Record = _require.Record;

var slug = require('github-slugid');

var DEFAULTS = {
    name: String(),
    description: String()
};

/**
 * A definition represents an entry in the glossary.
 * @param {Class}
 */

var GlossaryEntry = function (_Record) {
    _inherits(GlossaryEntry, _Record);

    function GlossaryEntry() {
        _classCallCheck(this, GlossaryEntry);

        return _possibleConstructorReturn(this, (GlossaryEntry.__proto__ || Object.getPrototypeOf(GlossaryEntry)).apply(this, arguments));
    }

    _createClass(GlossaryEntry, [{
        key: 'getName',
        value: function getName() {
            return this.get('name');
        }
    }, {
        key: 'getDescription',
        value: function getDescription() {
            return this.get('description');
        }
    }, {
        key: 'getID',
        value: function getID() {
            return this.id;
        }

        /**
         * Normalize a glossary entry name into a unique id
         *
         * @param {String}
         * @return {String}
         */

    }, {
        key: 'id',


        /**
         * Get identifier for this entry
         *
         * @return {String}
         */
        get: function get() {
            return GlossaryEntry.nameToID(this.name);
        }
    }], [{
        key: 'nameToID',
        value: function nameToID(name) {
            return slug(name);
        }
    }]);

    return GlossaryEntry;
}(Record(DEFAULTS));

module.exports = GlossaryEntry;
//# sourceMappingURL=glossaryEntry.js.map