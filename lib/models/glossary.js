'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('immutable'),
    Record = _require.Record,
    OrderedMap = _require.OrderedMap;

var File = require('./file');
var GlossaryEntry = require('./glossaryEntry');

var DEFAULTS = {
    file: new File(),
    entries: OrderedMap()
};

var Glossary = function (_Record) {
    _inherits(Glossary, _Record);

    function Glossary() {
        _classCallCheck(this, Glossary);

        return _possibleConstructorReturn(this, (Glossary.__proto__ || Object.getPrototypeOf(Glossary)).apply(this, arguments));
    }

    _createClass(Glossary, [{
        key: 'getFile',
        value: function getFile() {
            return this.get('file');
        }
    }, {
        key: 'getEntries',
        value: function getEntries() {
            return this.get('entries');
        }

        /**
         * Set file linked to the glossary.
         * @param  {File} file
         * @return {Readme}
         */

    }, {
        key: 'setFile',
        value: function setFile(file) {
            return this.merge({ file: file });
        }

        /**
         * Return an entry by its name.
         * @param {String} name
         * @return {GlossaryEntry}
         */

    }, {
        key: 'getEntry',
        value: function getEntry(name) {
            var entries = this.entries;

            var id = GlossaryEntry.nameToID(name);

            return entries.get(id);
        }

        /**
         * Add/Replace an entry to a glossary.
         * @param {GlossaryEntry} entry
         * @return {Glossary}
         */

    }, {
        key: 'addEntry',
        value: function addEntry(entry) {
            var id = entry.getID();
            var entries = this.entries;


            entries = entries.set(id, entry);
            return this.set('entries', entries);
        }

        /**
         * Add/Replace an entry to a glossary by name/description.
         * @param {GlossaryEntry} entry
         * @return {Glossary}
         */

    }, {
        key: 'addEntryByName',
        value: function addEntryByName(name, description) {
            var entry = new GlossaryEntry({
                name: name,
                description: description
            });

            return this.addEntry(entry);
        }

        /**
         * Create a glossary from a list of entries.
         *
         * @param {Array|List} entries
         * @return {Glossary}
         */

    }], [{
        key: 'createFromEntries',
        value: function createFromEntries(entries) {
            entries = entries.map(function (entry) {
                if (!(entry instanceof GlossaryEntry)) {
                    entry = new GlossaryEntry(entry);
                }

                return [entry.id, entry];
            });

            return new Glossary({
                entries: OrderedMap(entries)
            });
        }
    }]);

    return Glossary;
}(Record(DEFAULTS));

module.exports = Glossary;
//# sourceMappingURL=glossary.js.map