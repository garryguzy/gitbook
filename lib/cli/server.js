'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var events = require('events');
var http = require('http');
var send = require('send');
var url = require('url');

var Promise = require('../utils/promise');

var Server = function (_events$EventEmitter) {
    _inherits(Server, _events$EventEmitter);

    function Server() {
        _classCallCheck(this, Server);

        var _this = _possibleConstructorReturn(this, (Server.__proto__ || Object.getPrototypeOf(Server)).call(this));

        _this.running = null;
        _this.dir = null;
        _this.port = 0;
        _this.sockets = [];
        return _this;
    }

    /**
     * Return true if the server is running
     * @return {Boolean}
     */


    _createClass(Server, [{
        key: 'isRunning',
        value: function isRunning() {
            return !!this.running;
        }

        /**
         * Stop the server
         * @return {Promise}
         */

    }, {
        key: 'stop',
        value: function stop() {
            var that = this;
            if (!this.isRunning()) return Promise();

            var d = Promise.defer();
            this.running.close(function (err) {
                that.running = null;
                that.emit('state', false);

                if (err) d.reject(err);else d.resolve();
            });

            for (var i = 0; i < this.sockets.length; i++) {
                this.sockets[i].destroy();
            }

            return d.promise;
        }

        /**
         * Start the server
         * @return {Promise}
         */

    }, {
        key: 'start',
        value: function start(dir, port) {
            var that = this;
            var pre = Promise();
            port = port || 8004;

            if (that.isRunning()) pre = this.stop();
            return pre.then(function () {
                var d = Promise.defer();

                that.running = http.createServer(function (req, res) {
                    // Render error
                    function error(err) {
                        res.statusCode = err.status || 500;
                        res.end(err.message);
                    }

                    // Redirect to directory's index.html
                    function redirect() {
                        var resultURL = urlTransform(req.url, function (parsed) {
                            parsed.pathname += '/';
                            return parsed;
                        });

                        res.statusCode = 301;
                        res.setHeader('Location', resultURL);
                        res.end('Redirecting to ' + resultURL);
                    }

                    res.setHeader('X-Current-Location', req.url);

                    // Send file
                    send(req, url.parse(req.url).pathname, {
                        root: dir
                    }).on('error', error).on('directory', redirect).pipe(res);
                });

                that.running.on('connection', function (socket) {
                    that.sockets.push(socket);
                    socket.setTimeout(4000);
                    socket.on('close', function () {
                        that.sockets.splice(that.sockets.indexOf(socket), 1);
                    });
                });

                that.running.listen(port, function (err) {
                    if (err) return d.reject(err);

                    that.port = port;
                    that.dir = dir;
                    that.emit('state', true);
                    d.resolve();
                });

                return d.promise;
            });
        }
    }]);

    return Server;
}(events.EventEmitter);

/**
 * urlTransform is a helper function that allows a function to transform
 * a url string in it's parsed form and returns the new url as a string
 *
 * @param {String} uri
 * @param {Function} fn
 * @return {String}
 */


function urlTransform(uri, fn) {
    return url.format(fn(url.parse(uri)));
}

module.exports = Server;
//# sourceMappingURL=server.js.map