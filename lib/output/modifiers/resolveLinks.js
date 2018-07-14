'use strict';

var LocationUtils = require('../../utils/location');
var editHTMLElement = require('./editHTMLElement');

/**
 * Resolve all HTML links:
 * - /test.md in hello -> ../test.html
 *
 * @param {Function(String) -> String} resolveURL
 * @param {HTMLDom} $
 */
function resolveLinks(resolveURL, $) {
    return editHTMLElement($, 'a', function ($a) {
        var href = $a.attr('href');

        // Don't change a tag without href
        if (!href) {
            return;
        }

        if (LocationUtils.isExternal(href)) {
            $a.attr('target', '_blank');
            return;
        }

        href = resolveURL(href);
        $a.attr('href', href);
    });
}

module.exports = resolveLinks;
//# sourceMappingURL=resolveLinks.js.map