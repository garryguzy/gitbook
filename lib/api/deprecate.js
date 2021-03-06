'use strict';

var is = require('is');
var objectPath = require('object-path');

var logged = {};
var disabled = {};

/**
 * Log a deprecated notice
 *
 * @param {Book|Output} book
 * @param {String} key
 * @param {String} message
 */
function logNotice(book, key, message) {
    if (logged[key] || disabled[key]) return;

    logged[key] = true;

    var logger = book.getLogger();
    logger.warn.ln(message);
}

/**
 * Deprecate a function
 *
 * @param {Book|Output} book
 * @param {String} key: unique identitifer for the deprecated
 * @param {Function} fn
 * @param {String} msg: message to print when called
 * @return {Function}
 */
function deprecateMethod(book, key, fn, msg) {
    return function () {
        logNotice(book, key, msg);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return fn.apply(this, args);
    };
}

/**
 * Deprecate a property of an object
 *
 * @param {Book|Output} book
 * @param {String} key: unique identitifer for the deprecated
 * @param {Object} instance
 * @param {String|Function} property
 * @param {String} msg: message to print when called
 * @return {Function}
 */
function deprecateField(book, key, instance, property, value, msg) {
    var store = undefined;

    var prepare = function prepare() {
        if (!is.undefined(store)) return;

        if (is.fn(value)) store = value();else store = value;
    };

    var getter = function getter() {
        prepare();

        logNotice(book, key, msg);
        return store;
    };

    var setter = function setter(v) {
        prepare();

        logNotice(book, key, msg);
        store = v;
        return store;
    };

    Object.defineProperty(instance, property, {
        get: getter,
        set: setter,
        enumerable: false,
        configurable: true
    });
}

/**
 * Enable a deprecation
 * @param {String} key: unique identitifer
 */
function enableDeprecation(key) {
    disabled[key] = false;
}

/**
 * Disable a deprecation
 * @param {String} key: unique identitifer
 */
function disableDeprecation(key) {
    disabled[key] = true;
}

/**
 * Deprecate a method in favor of another one.
 *
 * @param {Book} book
 * @param {String} key
 * @param {Object} instance
 * @param {String} oldName
 * @param {String} newName
 */
function deprecateRenamedMethod(book, key, instance, oldName, newName, msg) {
    msg = msg || '"' + oldName + '" is deprecated, use "' + newName + '()" instead';
    var fn = objectPath.get(instance, newName);

    instance[oldName] = deprecateMethod(book, key, fn, msg);
}

module.exports = {
    method: deprecateMethod,
    renamedMethod: deprecateRenamedMethod,
    field: deprecateField,
    enable: enableDeprecation,
    disable: disableDeprecation
};
//# sourceMappingURL=deprecate.js.map