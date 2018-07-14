'use strict';

var encodeFile = require('./encodeFile');

/**
 * Encode a readme to JSON.
 *
 * @param  {Readme} readme
 * @param  {URIIndex} urls
 * @return {JSON} json
 */
function encodeReadme(readme, urls) {
    var file = readme.getFile();

    return {
        file: encodeFile(file, urls)
    };
}

module.exports = encodeReadme;
//# sourceMappingURL=encodeReadme.js.map