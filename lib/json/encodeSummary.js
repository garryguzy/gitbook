'use strict';

var encodeFile = require('./encodeFile');
var encodeSummaryPart = require('./encodeSummaryPart');

/**
 * Encode a summary to JSON
 *
 * @param {Summary} summary
 * @param {URIIndex} urls
 * @return {Object}
 */
function encodeSummary(summary, urls) {
    var file = summary.getFile();
    var parts = summary.getParts();

    return {
        file: encodeFile(file, urls),
        parts: parts.map(function (part) {
            return encodeSummaryPart(part, urls);
        }).toJS()
    };
}

module.exports = encodeSummary;
//# sourceMappingURL=encodeSummary.js.map