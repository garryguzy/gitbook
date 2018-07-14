'use strict';

var encodeFile = require('./encodeFile');

/**
 * Encode a languages listing to JSON
 *
 * @param  {Languages} languages
 * @param  {String} currentLanguage
 * @param  {URIIndex} urls
 * @return {JSON} json
*/
function encodeLanguages(languages, currentLanguage, urls) {
    var file = languages.getFile();
    var list = languages.getList();

    return {
        file: encodeFile(file, urls),
        current: currentLanguage,
        list: list.valueSeq().map(function (lang) {
            return {
                id: lang.getID(),
                title: lang.getTitle()
            };
        }).toJS()
    };
}

module.exports = encodeLanguages;
//# sourceMappingURL=encodeLanguages.js.map