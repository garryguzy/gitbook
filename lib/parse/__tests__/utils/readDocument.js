'use strict';

var path = require('path');
var read = require('read-metadata');

var _require = require('slate'),
    Raw = _require.Raw;

var FIXTURES = path.resolve(__dirname, '../fixtures');

/**
 * Read a fixture document from a YAML file.
 * @param  {String} filename
 * @return {Document}
 */
function readDocument(filename) {
  filename = path.resolve(FIXTURES, filename);

  var yaml = read.sync(filename);

  var _Raw$deserializeState = Raw.deserializeState(yaml, { terse: true }),
      document = _Raw$deserializeState.document;

  return document;
}

module.exports = readDocument;
//# sourceMappingURL=readDocument.js.map