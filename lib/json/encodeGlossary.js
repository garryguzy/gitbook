'use strict';

var encodeFile = require('./encodeFile');
var encodeGlossaryEntry = require('./encodeGlossaryEntry');

/**
 * Encode a glossary to JSON
 *
 * @param  {Glossary} glossary
 * @param  {URIIndex} urls
 * @return {JSON} json
 */
function encodeGlossary(glossary, urls) {
    var file = glossary.getFile();
    var entries = glossary.getEntries();

    return {
        file: encodeFile(file, urls),
        entries: entries.map(encodeGlossaryEntry).toJS()
    };
}

module.exports = encodeGlossary;
//# sourceMappingURL=encodeGlossary.js.map