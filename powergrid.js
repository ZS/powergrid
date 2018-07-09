var _ = Object.assign(_ || {}, compose);

var cssRule = new _.Block({
	selectors: null,
	parse: function(str) {
		var el = document.createElement('div');
		el.setAttribute('style', str);
		this.mix(el.style);
	},
	toString: function () {
		var el = document.createElement('div');
		var props = this.clone();
		delete props.selectors;
		_.mix(el.style, props);
		var css = el.getAttribute('style') || '';
		// Add skipped browser specific properties like -ms-grid-row: 1 and doubles like display: gird; display:-ms-grid
		if (css) {
			Object.keys(props).forEach(function(key, index) {
				if (Array.isArray(props[key])) { // doubles
					props[key].forEach(function(prop) {
						css += key + ':' + prop + ';'
					});
				}
				if (key[0] != '-') {return;}
				if (css.indexOf(key+':') < 0) { // browser prefixes
					css += key + ':' + props[key] +';';
				}
			});
		}
		return this.selectors.join(', ') + " {" + css + '}';
	}
});


var pg = {

	gridCell: function (startCol, startRow, colSpan, rowSpan, justify, align) {
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

	},

	gridCells: function(cols, rows) {
		var styles = [];
		cols.forEach(function (col, index) {

			styles.push(cssRule.clone(pg.gridCell(index + 1), {selectors: ['.col-' + (index + 1) + ':nth-child(n)']}));
			if (index>0) {
				styles.push(cssRule.clone(pg.gridCell(0,0,index + 1).mix({selectors: ['.col-span-' + (index + 1) + ':nth-child(n)']})));
			}
		});
		rows.forEach(function (row, index) {
			styles.push(cssRule.clone(pg.gridCell(0,index + 1),{selectors: ['.row-' + (index + 1) + ':nth-child(n)']}));
			if (index>0) {
				styles.push(cssRule.clone(pg.gridCell(0,0,0,index + 1),{selectors: ['.row-span-' + (index + 1) + ':nth-child(n)']}));
			}
		});	
		return styles;
	},

	// Auto placement of cells based on the nth-child
	gridAuto: function (cols, rows) {
		var styles = [];
		cols.forEach(function (col, index) {
			if (!index) { return; } // skip 1st column
			styles.push(cssRule.clone(pg.gridCell(index + 1),{selectors: [':nth-child(' + cols.length + 'n+' + (index + 1)+')']}));
	 	});

		rows.forEach(function (row, index) {
			if (!index) { return; } // skip 1st row
			styles.push(cssRule.clone(pg.gridCell(0, index + 1),{selectors: [':nth-child(n+' + (index * cols.length + 1)+')']}));
		});

		return styles;
	},
	// Generate css grid template
	grid: function (cols, rows) {
		var rule = cssRule.clone({
			display: ['grid','-ms-grid'],
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
	},


	// Generate grid css based on config
	css: function (config) {
		var html = '';
		var cls = config.prefix;

		// Create signature
		html += "/*|=============== " + config.name + " v" + config.version + " " + config.url + " */\r\n\r\n";


		// Grid template
		html += "/* Grid lines template */\r\n" + this.grid(config.cols, config.rows).mix({selectors: ['.'+cls]}).toString() + "\r\n";


		// Auto placement
		html += '/* Auto placement of grid cells based on the order */'  +"\r\n";
		this.gridAuto(config.cols, config.rows).forEach(function(rule) {
			rule.selectors[0] = '.' + cls + ' > ' + rule.selectors[0];
			html += rule.toString() + "\r\n";
		});

		// Explicit placement
		html += '/* Explicit placement of grid cells */' +"\r\n";
		this.gridCells(config.cols, config.rows).forEach(function(rule) {
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
			html += cssRule.clone(pg.gridCell(0,0,0,0,value,0)).mix({selectors: ['.justify-' + value + ' > * ']}).toString() + "\r\n";
			html += cssRule.clone(pg.gridCell(0,0,0,0,0,value)).mix({selectors: ['.align-' + value + ' > * ']}).toString() + "\r\n";

			// Overrides
			html += cssRule.clone(pg.gridCell(0,0,0,0,0,value)).mix({selectors: ['.' + cls + ' > .align-' + value ]}).toString() + "\r\n";
			html += cssRule.clone(pg.gridCell(0,0,0,0,value,0)).mix({selectors: ['.' + cls + ' > .justify-' + value]}).toString() + "\r\n";
		});

		html += "\r\n/*=================|*/";
	

		// Grid cell classes
		return html;
	}

};
