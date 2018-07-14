'use strict';

var Modifiers = require('./modifiers');

/**
 * Return default modifier to prepare a page for
 * rendering.
 *
 * @return {Array<Modifier>}
 */
function getModifiers(output, page) {
    var book = output.getBook();
    var glossary = book.getGlossary();
    var file = page.getFile();

    // Map of urls
    var urls = output.getURLIndex();

    // Glossary entries
    var entries = glossary.getEntries();
    var glossaryFile = glossary.getFile();
    var glossaryFilename = urls.resolveToURL(glossaryFile.getPath());

    // Current file path
    var currentFilePath = file.getPath();

    return [
    // Normalize IDs on headings
    Modifiers.addHeadingId,

    // Annotate text with glossary entries
    Modifiers.annotateText.bind(null, entries, glossaryFilename),

    // Resolve images
    Modifiers.resolveImages.bind(null, currentFilePath),

    // Resolve links (.md -> .html)
    Modifiers.resolveLinks.bind(null, function (filePath) {
        return urls.resolveToURLFrom(currentFilePath, filePath);
    })];
}

module.exports = getModifiers;
//# sourceMappingURL=getModifiers.js.map