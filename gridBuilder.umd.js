(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['exports', './powergrid.js'], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require('./powergrid.js'));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.powergrid);
		global.gridBuilder = mod.exports;
	}
})(this, function (exports, _powergrid) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var powergrid = _interopRequireWildcard(_powergrid);

	function _interopRequireWildcard(obj) {
		if (obj && obj.__esModule) {
			return obj;
		} else {
			var newObj = {};

			if (obj != null) {
				for (var key in obj) {
					if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
				}
			}

			newObj.default = obj;
			return newObj;
		}
	}

	var gridBuilder = {
		createGrid: function createGrid($grid, config) {
			var self = this;
			$grid.attr('class', config.prefix + 'grid fluid');

			if (config.align) {
				$grid.addClass(config.prefix + 'align-' + config.align);
			}

			if (config.justify) {
				$grid.addClass(config.prefix + 'justify-' + config.justify);
			}

			$grid.html('');
			var htmlText = '';
			config.cells.forEach(function (cell, index) {
				var cls = [];
				if (!cell) {
					return;
				}
				if (cell.col) {
					cls.push(config.prefix + 'col-' + cell.col);
				}
				if (cell.row) {
					cls.push(config.prefix + 'row-' + cell.row);
				}
				if (cell.colSpan) {
					cls.push(config.prefix + 'col-span-' + cell.colSpan);
				}
				if (cell.rowSpan) {
					cls.push(config.prefix + 'row-span-' + cell.rowSpan);
				}

				if (cell.order) {
					cls.push(config.prefix + 'order-' + cell.order);
				}

				if (cell.align) {
					cls.push(config.prefix + 'align-self-' + cell.align);
				}

				if (cell.justify) {
					cls.push(config.prefix + 'justify-self-' + cell.justify);
				}
				var cls = cls.join(' ').trim();

				$grid.append('<div' + (cls ? ' class="' + cls + '"' : '') + '>' + self.format(encodeURIComponent(cell.text || index)) + '</div>');
				htmlText += "    " + '<div' + (cls ? ' class="' + cls + '"' : '') + '>' + self.format(encodeURIComponent(cell.text || index)) + '</div>' + "\r\n";
			});

			return htmlText;
		},
		format: function format(htmlString) {
			var html = htmlString;
			var arr = html.split('-');
			if (arr.length == 3 && arr[0] == 'img') {
				html = '<img src="https://via.placeholder.com/' + arr[1] + 'x' + arr[2] + '">';
			}
			return html;
		},
		createStyles: function createStyles(config) {
			return powergrid.toCss(config);
		}
	}; /**
     * Grid builder
     * @module  
     * @todo Remove jQuery. Make it work with component and use this.el
     */
	exports.default = gridBuilder;
});
