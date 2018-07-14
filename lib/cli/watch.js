'use strict';

var path = require('path');
var chokidar = require('chokidar');

var Promise = require('../utils/promise');

var _require = require('../parsers'),
    FILE_EXTENSIONS = _require.FILE_EXTENSIONS;

/**
 * Watch a folder and resolve promise once a file is modified
 *
 * @param {String} dir
 * @return {Promise}
 */


function watch(dir) {
    var d = Promise.defer();
    dir = path.resolve(dir);

    var toWatch = ['book.json', 'book.js', '_layouts/**'];

    // Watch all parsable files
    FILE_EXTENSIONS.forEach(function (ext) {
        toWatch.push('**/*' + ext);
    });

    var watcher = chokidar.watch(toWatch, {
        cwd: dir,
        ignored: '_book/**',
        ignoreInitial: true
    });

    watcher.once('all', function (e, filepath) {
        watcher.close();

        d.resolve(filepath);
    });
    watcher.once('error', function (err) {
        watcher.close();

        d.reject(err);
    });

    return d.promise;
}

module.exports = watch;
//# sourceMappingURL=watch.js.map