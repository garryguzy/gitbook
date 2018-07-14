'use strict';

var Immutable = require('immutable');
var jsonSchemaDefaults = require('json-schema-defaults');

var schema = require('./configSchema');

module.exports = Immutable.fromJS(jsonSchemaDefaults(schema));
//# sourceMappingURL=configDefault.js.map