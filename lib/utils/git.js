'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var is = require('is');
var path = require('path');
var crc = require('crc');
var URI = require('urijs');

var pathUtil = require('./path');
var Promise = require('./promise');
var command = require('./command');
var fs = require('./fs');

var GIT_PREFIX = 'git+';

var Git = function () {
    function Git() {
        _classCallCheck(this, Git);

        this.tmpDir = null;
        this.cloned = {};
    }

    // Return an unique ID for a combinaison host/ref


    _createClass(Git, [{
        key: 'repoID',
        value: function repoID(host, ref) {
            return crc.crc32(host + '#' + (ref || '')).toString(16);
        }

        // Allocate a temporary folder for cloning repos in it

    }, {
        key: 'allocateDir',
        value: function allocateDir() {
            var that = this;

            if (this.tmpDir) {
                return Promise();
            }

            return fs.tmpDir().then(function (dir) {
                that.tmpDir = dir;
            });
        }

        /**
         * Clone a git repository if non existant
         * @param {String} host: url of the git repository
         * @param {String} ref: branch/commit/tag to checkout
         * @return {Promise<String>} repoPath
         */

    }, {
        key: 'clone',
        value: function clone(host, ref) {
            var that = this;

            return this.allocateDir()

            // Return or clone the git repo
            .then(function () {
                // Unique ID for repo/ref combinaison
                var repoId = that.repoID(host, ref);

                // Absolute path to the folder
                var repoPath = path.join(that.tmpDir, repoId);

                if (that.cloned[repoId]) return repoPath;

                // Clone repo
                return command.exec('git clone ' + host + ' ' + repoPath)

                // Checkout reference if specified
                .then(function () {
                    that.cloned[repoId] = true;

                    if (!ref) return;
                    return command.exec('git checkout ' + ref, { cwd: repoPath });
                }).thenResolve(repoPath);
            });
        }

        /**
         * Resole a git url, clone the repo and return the path to the right file.
         * @param {String} giturl
         * @return {Promise<String>} filePath
         */

    }, {
        key: 'resolve',
        value: function resolve(giturl) {
            // Path to a file in a git repo?
            if (!Git.isUrl(giturl)) {
                if (this.resolveRoot(giturl)) return Promise(giturl);
                return Promise(null);
            }
            if (is.string(giturl)) giturl = Git.parseUrl(giturl);
            if (!giturl) return Promise(null);

            // Clone or get from cache
            return this.clone(giturl.host, giturl.ref).then(function (repo) {
                return path.resolve(repo, giturl.filepath);
            });
        }

        /**
         * Return root of git repo from a filepath
         * @param  {String} filePath
         * @return {String} repoPath
         */

    }, {
        key: 'resolveRoot',
        value: function resolveRoot(filepath) {
            // No git repo cloned, or file is not in a git repository
            if (!this.tmpDir || !pathUtil.isInRoot(this.tmpDir, filepath)) return null;

            // Extract first directory (is the repo id)
            var relativeToGit = path.relative(this.tmpDir, filepath);
            var repoId = relativeToGit.split(path.sep)[0];

            if (!repoId) {
                return;
            }

            // Return an absolute file
            return path.resolve(this.tmpDir, repoId);
        }

        /**
         * Check if an url is a git dependency url
         * @param  {String} giturl
         * @return {Boolean} isUrl
         */

    }], [{
        key: 'isUrl',
        value: function isUrl(giturl) {
            return giturl.indexOf(GIT_PREFIX) === 0;
        }

        /**
         * Parse and extract infos
         * @param  {String} giturl
         * @return {Object} { host, ref, filepath }
         */

    }, {
        key: 'parseUrl',
        value: function parseUrl(giturl) {
            if (!Git.isUrl(giturl)) {
                return null;
            }
            giturl = giturl.slice(GIT_PREFIX.length);

            var uri = new URI(giturl);
            var ref = uri.fragment() || null;
            uri.fragment(null);

            // Extract file inside the repo (after the .git)
            var fileParts = uri.path().split('.git');
            var filepath = fileParts.length > 1 ? fileParts.slice(1).join('.git') : '';
            if (filepath[0] == '/') {
                filepath = filepath.slice(1);
            }

            // Recreate pathname without the real filename
            uri.path(fileParts[0] + '.git');

            return {
                host: uri.toString(),
                ref: ref,
                filepath: filepath
            };
        }
    }]);

    return Git;
}();

module.exports = Git;
//# sourceMappingURL=git.js.map