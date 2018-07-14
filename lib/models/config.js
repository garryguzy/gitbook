'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var is = require('is');

var _require = require('immutable'),
    Record = _require.Record,
    fromJS = _require.fromJS;

var File = require('./file');
var PluginDependency = require('./pluginDependency');
var configDefault = require('../constants/configDefault');
var reducedObject = require('../utils/reducedObject');

var DEFAULTS = {
    file: new File(),
    values: configDefault
};

var Config = function (_Record) {
    _inherits(Config, _Record);

    function Config() {
        _classCallCheck(this, Config);

        return _possibleConstructorReturn(this, (Config.__proto__ || Object.getPrototypeOf(Config)).apply(this, arguments));
    }

    _createClass(Config, [{
        key: 'getFile',
        value: function getFile() {
            return this.get('file');
        }
    }, {
        key: 'getValues',
        value: function getValues() {
            return this.get('values');
        }

        /**
         * Return minimum version of configuration,
         * Basically it returns the current config minus the default one
         * @return {Map}
         */

    }, {
        key: 'toReducedVersion',
        value: function toReducedVersion() {
            return reducedObject(configDefault, this.getValues());
        }

        /**
         * Render config as text
         * @return {String}
         */

    }, {
        key: 'toText',
        value: function toText() {
            return JSON.stringify(this.toReducedVersion().toJS(), null, 4);
        }

        /**
         * Change the file for the configuration
         * @param {File} file
         * @return {Config}
         */

    }, {
        key: 'setFile',
        value: function setFile(file) {
            return this.set('file', file);
        }

        /**
         * Return a configuration value by its key path
         * @param {String} key
         * @return {Mixed}
         */

    }, {
        key: 'getValue',
        value: function getValue(keyPath, def) {
            var values = this.getValues();
            keyPath = Config.keyToKeyPath(keyPath);

            if (!values.hasIn(keyPath)) {
                return fromJS(def);
            }

            return values.getIn(keyPath);
        }

        /**
         * Update a configuration value
         * @param {String} key
         * @param {Mixed} value
         * @return {Config}
         */

    }, {
        key: 'setValue',
        value: function setValue(keyPath, value) {
            keyPath = Config.keyToKeyPath(keyPath);

            value = fromJS(value);

            var values = this.getValues();
            values = values.setIn(keyPath, value);

            return this.set('values', values);
        }

        /**
         * Return a list of plugin dependencies
         * @return {List<PluginDependency>}
         */

    }, {
        key: 'getPluginDependencies',
        value: function getPluginDependencies() {
            var plugins = this.getValue('plugins');

            if (is.string(plugins)) {
                return PluginDependency.listFromString(plugins);
            } else {
                return PluginDependency.listFromArray(plugins);
            }
        }

        /**
         * Return a plugin dependency by its name
         * @param {String} name
         * @return {PluginDependency}
         */

    }, {
        key: 'getPluginDependency',
        value: function getPluginDependency(name) {
            var plugins = this.getPluginDependencies();
            return plugins.find(function (dep) {
                return dep.getName() === name;
            });
        }

        /**
         * Update the list of plugins dependencies
         * @param {List<PluginDependency>}
         * @return {Config}
         */

    }, {
        key: 'setPluginDependencies',
        value: function setPluginDependencies(deps) {
            var plugins = PluginDependency.listToArray(deps);
            return this.setValue('plugins', plugins);
        }

        /**
         * Update values for an existing configuration
         * @param {Object} values
         * @returns {Config}
         */

    }, {
        key: 'updateValues',
        value: function updateValues(values) {
            values = fromJS(values);
            return this.set('values', values);
        }

        /**
         * Update values for an existing configuration
         * @param {Config} config
         * @param {Object} values
         * @returns {Config}
         */

    }, {
        key: 'mergeValues',
        value: function mergeValues(values) {
            var currentValues = this.getValues();
            values = fromJS(values);

            currentValues = currentValues.mergeDeep(values);

            return this.set('values', currentValues);
        }

        /**
         * Create a new config for a file
         * @param {File} file
         * @param {Object} values
         * @returns {Config}
         */

    }], [{
        key: 'create',
        value: function create(file, values) {
            return new Config({
                file: file,
                values: fromJS(values)
            });
        }

        /**
         * Create a new config
         * @param {Object} values
         * @returns {Config}
         */

    }, {
        key: 'createWithValues',
        value: function createWithValues(values) {
            return new Config({
                values: fromJS(values)
            });
        }

        /**
         * Convert a keyPath to an array of keys
         * @param {String|Array}
         * @return {Array}
         */

    }, {
        key: 'keyToKeyPath',
        value: function keyToKeyPath(keyPath) {
            if (is.string(keyPath)) keyPath = keyPath.split('.');
            return keyPath;
        }
    }]);

    return Config;
}(Record(DEFAULTS));

module.exports = Config;
//# sourceMappingURL=config.js.map