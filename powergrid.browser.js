(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.pg = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['exports'], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports);
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports);
		global.compose = mod.exports;
	}
})(this, function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
		return typeof obj;
	} : function (obj) {
		return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};

	/** @module bb/compose */

	/** 
  * Compose two or more objects
  * @param {...object} Objects to compose.  target, source1, source2, ...
  * @return {object} Target object.
 */
	function _mix() {
		var args = arguments,
		    source = args[0];

		if (source == undefined) {
			return;
		}
		if (args.length <= 1) {
			return source;
		}

		for (var i = 1; i < args.length; i++) {
			var obj = args[i];
			if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) != 'object') {
				console.warn('Invalid parameter type "' + (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) + '" for the argument #' + i);
				continue;
			}
			Object.defineProperties(source, Object.getOwnPropertyDescriptors(obj));
		}
		return source;
	}

	/** 
  * Inherit and compose
  * @param {...object} Prototype and optional additional sources for composition
  * @return {object} New object created from the prototype and results of composition
 */
	function _clone() {
		var args = arguments;
		if (args[0] == undefined) {
			args[0] = Object.prototype;
		}
		args[0] = Object.create(args[0], Object.getOwnPropertyDescriptors(args[0]));
		if (args.length == 1) {
			return args[0];
		}
		return _mix.apply(this, args);
	}

	// Object.getOwnPropertyDescriptors polyfill for IE11
	if (!Object.hasOwnProperty('getOwnPropertyDescriptors')) {
		var supportsSymbol = Object.hasOwnProperty('getOwnPropertySymbols');
		Object.defineProperty(Object, 'getOwnPropertyDescriptors', {
			configurable: true,
			writable: true,
			value: function getOwnPropertyDescriptors(object) {
				var keys = Object.getOwnPropertyNames(object);
				if (supportsSymbol) {
					keys = keys.concat(Object.getOwnPropertySymbols(object));
				}

				return keys.reduce(function (descriptors, key) {
					return Object.defineProperty(descriptors, key, {
						configurable: true,
						enumerable: true,
						writable: true,
						value: Object.getOwnPropertyDescriptor(object, key)
					});
				}, {});
			}
		});
	}

	// Object assign polyfill for IE11
	if (!Object.assign) {
		var assign = function assign(target, firstSource) {
			if (target === undefined || target === null) {
				throw new TypeError('Cannot convert first argument to object');
			}

			var to = Object(target);
			for (var i = 1; i < arguments.length; i++) {
				var nextSource = arguments[i];
				if (nextSource === undefined || nextSource === null) {
					continue;
				}

				var keysArray = Object.keys(Object(nextSource));
				for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
					var nextKey = keysArray[nextIndex];
					var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
					if (desc !== undefined && desc.enumerable) {
						to[nextKey] = nextSource[nextKey];
					}
				}
			}
			return to;
		};

		Object.defineProperty(Object, 'assign', {
			enumerable: false,
			configurable: true,
			writable: true,
			value: assign
		});
	}

	/**
  * Building block with handy methods
  */
	var block = {
		mix: function mix() {
			Array.prototype.unshift.call(arguments, this);
			_mix.apply(this, arguments);
			return this;
		},
		clone: function clone() {
			Array.prototype.unshift.call(arguments, this);
			return _clone.apply(this, arguments);
		},
		define: function define() {
			if (!arguments.length) {
				return this;
			}
			for (var i = 0; i < arguments.length; i++) {
				Object.defineProperties(this, arguments[i]);
			}
			return this;
		}
	};
	var Block = function Block() {
		Array.prototype.unshift.call(arguments, this);
		_mix.apply(this, arguments);
	};
	Block.prototype = block;
	exports.mix = _mix;
	exports.clone = _clone;
	exports.block = block;
	exports.Block = Block;
});

},{}],2:[function(require,module,exports){
'use strict';
module.exports = function (val) {
	if (val === null || val === undefined) {
		return [];
	}

	return Array.isArray(val) ? val : [val];
};

},{}],3:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],4:[function(require,module,exports){
/*!
 * repeat-string <https://github.com/jonschlinkert/repeat-string>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

/**
 * Results cache
 */

var res = '';
var cache;

/**
 * Expose `repeat`
 */

module.exports = repeat;

/**
 * Repeat the given `string` the specified `number`
 * of times.
 *
 * **Example:**
 *
 * ```js
 * var repeat = require('repeat-string');
 * repeat('A', 5);
 * //=> AAAAA
 * ```
 *
 * @param {String} `string` The string to repeat
 * @param {Number} `number` The number of times to repeat the string
 * @return {String} Repeated string
 * @api public
 */

function repeat(str, num) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string');
  }

  // cover common, quick use cases
  if (num === 1) return str;
  if (num === 2) return str + str;

  var max = str.length * num;
  if (cache !== str || typeof cache === 'undefined') {
    cache = str;
    res = '';
  } else if (res.length >= max) {
    return res.substr(0, max);
  }

  while (max > res.length && num > 1) {
    if (num & 1) {
      res += str;
    }

    num >>= 1;
    str += str;
  }

  res += str;
  res = res.substr(0, max);
  return res;
}

},{}],5:[function(require,module,exports){
'use strict';
var repeatString = require('repeat-string');
var objectAssign = require('object-assign');
var arrify = require('arrify');

module.exports = function toCss(object, opts) {
	opts = objectAssign({
		indent: '',
		property: identity,
		value: identity,
		selector: identity
	}, opts);

	if (typeof opts.indent === 'number') {
		opts.indent = repeatString(' ', opts.indent);
	}

	function props(prop, val) {
		return arrify(prop).reduce(function (props, p) {
			return props.concat(opts.property(p, val));
		}, []);
	}

	function values(val, prop) {
		return arrify(val).reduce(function (vals, v) {
			return vals.concat(opts.value(v, prop));
		}, []);
	}

	function selectors(sel, value) {
		return arrify(sel).reduce(function (sels, s) {
			return sels.concat(opts.selector(s, value));
		}, []);
	}

	function _toCss(obj, level) {
		var str = '';
		Object.keys(obj).forEach(function (sel) {
			var value = obj[sel];
			if (isLastLevel(value)) {
				str += rule(props(sel, value), values(value, sel), opts.indent, level - 1);
				return;
			} else if (Array.isArray(value)) {
				value.forEach(function (val) {
					str += _toCss(nest(sel, val), level);
				});
				return;
			}
			selectors(sel, value).forEach(function (selector) {
				str += start(selector, opts.indent, level);
				Object.keys(value).forEach(function (prop) {
					var value = obj[sel][prop];
					if (oneMoreLevelExists(value)) {
						str += _toCss(nest(prop, value), level + 1);
					} else {
						str += rule(props(prop, value), values(value, prop), opts.indent, level);
					}
				});
				str += end(opts.indent, level);
			});
		});
		return str;
	}

	return arrify(object)
		.map(function (o) {
			return _toCss(o, 0);
		})
		.join(lineEnd(opts.indent));
};

function nest(prop, val) {
	var tmp = {};
	tmp[prop] = val;
	return tmp;
}

function isLastLevel(val) {
	return typeof val === 'string' || Array.isArray(val) && val.length && typeof val[0] !== 'object';
}

function oneMoreLevelExists(val) {
	return typeof val === 'object' && !Array.isArray(val);
}

function identity(v) {
	return v;
}

function lineStart(indent, level) {
	return indent ? repeatString(indent, level) : '';
}

function space(indent) {
	return indent ? ' ' : '';
}

function lineEnd(indent) {
	return indent ? '\n' : '';
}

function start(sel, indent, level) {
	return lineStart(indent, level) + sel + space(indent) + '{' + lineEnd(indent);
}

function end(indent, level) {
	return lineStart(indent, level) + '}' + lineEnd(indent);
}

function rule(props, values, indent, level) {
	var linestart = lineStart(indent, level + 1);
	var lineend = lineEnd(indent);
	var s = space(indent);

	var str = '';

	for (var i = 0, propLength = props.length; i < propLength; i++) {
		for (var j = 0, valueLength = values.length; j < valueLength; j++) {
			str += linestart + props[i] + (isAtRule(props[i]) ? ' ' : ':') + s + values[j] + ';' + lineend;
		}
	}

	return str;
}

function isAtRule(prop) {
	return prop.indexOf('@') === 0;
}

},{"arrify":2,"object-assign":3,"repeat-string":4}],6:[function(require,module,exports){
'use strict';
var compose = require('@bblocks/compose');
var toCss = require('to-css');
var _ = Object.assign(_ || {}, compose);

// Credits: https://github.com/lazycoffee/lc-camel-to-hyphen
function camelToHyphen(text){
    return text.replace(/^[A-Z]/, match=>match.toLowerCase())
    .replace(/[A-Z]/g, match=>'-' + match.toLowerCase());
}

var cssRule = new _.Block({
	selectors: null,
	toString: function () {
		var props = this.clone();
		delete props.selectors;
		delete props.toString;
		Object.keys(props).forEach(function(name) {

			var newName = camelToHyphen(name);
			props[newName] = props[name];
			delete props[name];
		})
		var obj = {};
		obj[this.selectors.join(', ')] = props;
		return toCss(obj).replace('__:', ':');
	}
});


function gridCell(startCol, startRow, colSpan, rowSpan, justify, align) {
	var props = new _.Block();
	if (startCol) {
		props.mix({	
			gridColumnStart: startCol,
			"-ms-grid-column": startCol
		})
	}

	if (startRow) {
		props.mix({
			gridRowStart:startRow,
			"-ms-grid-row": startRow 
		});
	}

	if (colSpan) {
		props.mix({
			gridColumnEnd: 'span ' + colSpan,
			"-ms-grid-column-span": colSpan
		});
	}

	if (rowSpan) {
		props.mix({
			gridRowEnd: 'span ' + rowSpan,
			"-ms-grid-row-span": rowSpan 
		});
	}

	if (justify) {
		props.mix({
			justifySelf: justify,
			"-ms-grid-column-align": justify
		});
	}

	if (align) {
		props.mix({
			alignSelf: align,
			"-ms-grid-row-align": align
		});
		
	}
	return props;
};

function gridCells(cols, rows) {
	var styles = [];
	cols.forEach(function (col, index) {

		styles.push(cssRule.clone(gridCell(index + 1), {selectors: ['.col-' + (index + 1) + ':nth-child(n)']}));
		if (index>0) {
			styles.push(cssRule.clone(gridCell(0,0,index + 1).mix({selectors: ['.col-span-' + (index + 1) + ':nth-child(n)']})));
		}
	});
	rows.forEach(function (row, index) {
		styles.push(cssRule.clone(gridCell(0,index + 1),{selectors: ['.row-' + (index + 1) + ':nth-child(n)']}));
		if (index>0) {
			styles.push(cssRule.clone(gridCell(0,0,0,index + 1),{selectors: ['.row-span-' + (index + 1) + ':nth-child(n)']}));
		}
	});	
	return styles;
};


function gridAuto(cols, rows) {
		var styles = [];
		cols.forEach(function (col, index) {
			if (!index) { return; } // skip 1st column
			styles.push(cssRule.clone(gridCell(index + 1),{selectors: [':nth-child(' + cols.length + 'n+' + (index + 1)+')']}));
	 	});

		rows.forEach(function (row, index) {
			if (!index) { return; } // skip 1st row
			styles.push(cssRule.clone(gridCell(0, index + 1),{selectors: [':nth-child(n+' + (index * cols.length + 1)+')']}));
		});

		return styles;
};

// Generate css grid template
function grid(cols, rows) {
	var rule = cssRule.clone({
		display: 'grid',
		'display__:': '-ms-grid' // Workaround
	});
	if (Array.isArray(cols) && cols.length) {
		rule.mix({
			gridTemplateColumns: cols.join(' '),
			"-ms-grid-columns": cols.join(' ')
		});
	}

	if (Array.isArray(rows) && rows.length) {
		rule.mix({
			gridTemplateRows: rows.join(' '),
			"-ms-grid-rows": rows.join(' ') 
		});
	}
	return rule;
};

// Generate grid css based on config
function css(config) {
	var html = '';
	var cls = config.prefix;

	// Create signature
	html += "/*|=============== " + config.name + " v" + config.version + " " + config.url + " */\r\n\r\n";


	// Grid template
	html += "/* Grid lines template */\r\n" + grid(config.cols, config.rows).mix({selectors: ['.'+cls]}).toString() + "\r\n";


	// Auto placement
	html += '/* Auto placement of grid cells based on the order */'  +"\r\n";
	gridAuto(config.cols, config.rows).forEach(function(rule) {
		rule.selectors[0] = '.' + cls + ' > ' + rule.selectors[0];
		html += rule.toString() + "\r\n";
	});

	// Explicit placement
	html += '/* Explicit placement of grid cells */' +"\r\n";
	gridCells(config.cols, config.rows).forEach(function(rule) {
		rule.selectors[0] = '.' + cls + ' > ' + rule.selectors[0];
		html += rule.toString() + "\r\n";
	});

	// Order of layers
	html += '/* Order of layers */' + "\r\n";
	config.cells.forEach(function(cell, index) {
		html += '.' + cls + ' > .order-' + (index + 1) + ' {z-index: ' + (index + 1) +';}' + "\r\n";

	});

	// Alignment
	html += '/* Alignment */' + "\r\n";
	var values = ['start', 'end', 'center', 'stretch'];
	values.forEach(function(value, index) {
		// Grid cells alignment
		html += cssRule.clone(gridCell(0,0,0,0,value,0)).mix({selectors: ['.justify-' + value + ' > * ']}).toString() + "\r\n";
		html += cssRule.clone(gridCell(0,0,0,0,0,value)).mix({selectors: ['.align-' + value + ' > * ']}).toString() + "\r\n";

		// Overrides
		html += cssRule.clone(gridCell(0,0,0,0,0,value)).mix({selectors: ['.' + cls + ' > .align-' + value ]}).toString() + "\r\n";
		html += cssRule.clone(gridCell(0,0,0,0,value,0)).mix({selectors: ['.' + cls + ' > .justify-' + value]}).toString() + "\r\n";
	});

	html += "\r\n/*					=================|*/";

	// Grid cell classes
	return html;
}

module.exports = {
	gridCell: gridCell, 
	toCss: css, 
	gridCells: gridCells,
	grid: grid, 
	gridAuto: gridAuto
};
},{"@bblocks/compose":1,"to-css":5}]},{},[6])(6)
});
