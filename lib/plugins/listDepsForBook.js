'use strict';

var listDependencies = require('./listDependencies');

/**
 * List all plugin requirements for a book.
 * It can be different from the final list of plugins,
 * since plugins can have their own dependencies
 *
 * @param {Book} book
 * @return {List<PluginDependency>} dependencies
 */
function listDepsForBook(book) {
  var config = book.getConfig();
  var plugins = config.getPluginDependencies();

  return listDependencies(plugins);
}

module.exports = listDepsForBook;
//# sourceMappingURL=listDepsForBook.js.map