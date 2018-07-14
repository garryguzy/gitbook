'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var is = require('is');
var extend = require('extend');

var _require = require('immutable'),
    Record = _require.Record,
    List = _require.List,
    Map = _require.Map;

var escape = require('escape-html');

var Promise = require('../utils/promise');
var TemplateShortcut = require('./templateShortcut');

var NODE_ENDARGS = '%%endargs%%';
var HTML_TAGNAME = 'xblock';

var DEFAULTS = {
    // Name of block, also the start tag
    name: String(),
    // End tag, default to "end<name>"
    end: String(),
    // Function to process the block content
    process: Function(),
    // List of String, for inner block tags
    blocks: List(),
    // List of shortcuts to replace with this block
    shortcuts: Map()
};

var TemplateBlock = function (_Record) {
    _inherits(TemplateBlock, _Record);

    function TemplateBlock() {
        _classCallCheck(this, TemplateBlock);

        return _possibleConstructorReturn(this, (TemplateBlock.__proto__ || Object.getPrototypeOf(TemplateBlock)).apply(this, arguments));
    }

    _createClass(TemplateBlock, [{
        key: 'getName',
        value: function getName() {
            return this.get('name');
        }
    }, {
        key: 'getEndTag',
        value: function getEndTag() {
            return this.get('end') || 'end' + this.getName();
        }
    }, {
        key: 'getProcess',
        value: function getProcess() {
            return this.get('process');
        }
    }, {
        key: 'getBlocks',
        value: function getBlocks() {
            return this.get('blocks');
        }

        /**
         * Return shortcuts associated with this block or undefined
         * @return {TemplateShortcut|undefined}
         */

    }, {
        key: 'getShortcuts',
        value: function getShortcuts() {
            var shortcuts = this.get('shortcuts');
            if (shortcuts.size === 0) {
                return undefined;
            }

            return TemplateShortcut.createForBlock(this, shortcuts);
        }

        /**
         * Return name for the nunjucks extension
         * @return {String}
         */

    }, {
        key: 'getExtensionName',
        value: function getExtensionName() {
            return 'Block' + this.getName() + 'Extension';
        }

        /**
         * Return a nunjucks extension to represents this block
         * @return {Nunjucks.Extension}
         */

    }, {
        key: 'toNunjucksExt',
        value: function toNunjucksExt() {
            var mainContext = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var that = this;
            var name = this.getName();
            var endTag = this.getEndTag();
            var blocks = this.getBlocks().toJS();

            function Ext() {
                var _this2 = this;

                this.tags = [name];

                this.parse = function (parser, nodes) {
                    var lastBlockName = null;
                    var lastBlockArgs = null;
                    var allBlocks = blocks.concat([endTag]);

                    // Parse first block
                    var tok = parser.nextToken();
                    lastBlockArgs = parser.parseSignature(null, true);
                    parser.advanceAfterBlockEnd(tok.value);

                    var args = new nodes.NodeList();
                    var bodies = [];
                    var blockNamesNode = new nodes.Array(tok.lineno, tok.colno);
                    var blockArgCounts = new nodes.Array(tok.lineno, tok.colno);

                    // Parse while we found "end<block>"
                    do {
                        // Read body
                        var currentBody = parser.parseUntilBlocks.apply(parser, _toConsumableArray(allBlocks));

                        // Handle body with previous block name and args
                        blockNamesNode.addChild(new nodes.Literal(args.lineno, args.colno, lastBlockName));
                        blockArgCounts.addChild(new nodes.Literal(args.lineno, args.colno, lastBlockArgs.children.length));
                        bodies.push(currentBody);

                        // Append arguments of this block as arguments of the run function
                        lastBlockArgs.children.forEach(function (child) {
                            args.addChild(child);
                        });

                        // Read new block
                        lastBlockName = parser.nextToken().value;

                        // Parse signature and move to the end of the block
                        if (lastBlockName != endTag) {
                            lastBlockArgs = parser.parseSignature(null, true);
                        }

                        parser.advanceAfterBlockEnd(lastBlockName);
                    } while (lastBlockName != endTag);

                    args.addChild(blockNamesNode);
                    args.addChild(blockArgCounts);
                    args.addChild(new nodes.Literal(args.lineno, args.colno, NODE_ENDARGS));

                    return new nodes.CallExtensionAsync(_this2, 'run', args, bodies);
                };

                this.run = function (context) {
                    for (var _len = arguments.length, fnArgs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                        fnArgs[_key - 1] = arguments[_key];
                    }

                    var args = void 0;
                    var blocks = [];
                    var bodies = [];

                    // Extract callback
                    var callback = fnArgs.pop();

                    // Detect end of arguments
                    var endArgIndex = fnArgs.indexOf(NODE_ENDARGS);

                    // Extract arguments and bodies
                    args = fnArgs.slice(0, endArgIndex);
                    bodies = fnArgs.slice(endArgIndex + 1);

                    // Extract block counts
                    var blockArgCounts = args.pop();
                    var blockNames = args.pop();

                    // Recreate list of blocks
                    blockNames.forEach(function (blkName, i) {
                        var countArgs = blockArgCounts[i];
                        var blockBody = bodies.shift();

                        var blockArgs = countArgs > 0 ? args.slice(0, countArgs) : [];
                        args = args.slice(countArgs);
                        var blockKwargs = extractKwargs(blockArgs);

                        blocks.push({
                            name: blkName,
                            children: blockBody(),
                            args: blockArgs,
                            kwargs: blockKwargs
                        });
                    });

                    var mainBlock = blocks.shift();
                    mainBlock.blocks = blocks;

                    Promise().then(function () {
                        var ctx = extend({
                            ctx: context
                        }, mainContext);

                        return that.toProps(mainBlock, ctx);
                    }).then(function (props) {
                        return that.toHTML(props);
                    }).nodeify(callback);
                };
            }

            return Ext;
        }

        /**
         * Apply a block an return the props
         *
         * @param {Object} inner
         * @param {Object} context
         * @return {Promise<Props>}
         */

    }, {
        key: 'toProps',
        value: function toProps(inner, context) {
            var processFn = this.getProcess();

            inner = inner || {};
            inner.args = inner.args || [];
            inner.kwargs = inner.kwargs || {};
            inner.blocks = inner.blocks || [];

            return Promise().then(function () {
                return processFn.call(context, inner);
            }).then(function (props) {
                if (is.string(props)) {
                    return { children: props };
                }

                return props;
            });
        }

        /**
         * Convert a block props to HTML. This HTML is then being
         * parsed by gitbook-core during rendering, and binded to the right react components.
         *
         * @param {Object} props
         * @return {String}
         */

    }, {
        key: 'toHTML',
        value: function toHTML(props) {
            var children = props.children,
                innerProps = _objectWithoutProperties(props, ['children']);

            var payload = escape(JSON.stringify(innerProps));

            return '<' + HTML_TAGNAME + ' name="' + this.name + '" props="' + payload + '">' + (children || '') + '</' + HTML_TAGNAME + '>';
        }

        /**
         * Create a template block from a function or an object
         * @param {String} blockName
         * @param {Object} block
         * @return {TemplateBlock}
         */

    }], [{
        key: 'create',
        value: function create(blockName, block) {
            if (is.fn(block)) {
                block = new Map({
                    process: block
                });
            }

            block = new TemplateBlock(block);
            block = block.set('name', blockName);
            return block;
        }
    }]);

    return TemplateBlock;
}(Record(DEFAULTS));

/**
 * Extract kwargs from an arguments array
 * @param {Array} args
 * @return {Object}
 */


function extractKwargs(args) {
    var last = args[args.length - 1];
    return is.object(last) && last.__keywords ? args.pop() : {};
}

module.exports = TemplateBlock;
//# sourceMappingURL=templateBlock.js.map