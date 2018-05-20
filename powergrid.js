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
		_.mix(el.style, props);
		if (props["-ms-grid-row"] && !el.style["-ms-grid-row"]) {
			console.log('here', props, el.style);
		}
		return this.selectors.join(', ') + " {" + (el.getAttribute('style') || '') + '}';
	}
});

var pg = {

	gridCell: function (startCol, startRow, endCol, endRow) {
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

		if (endCol) {
			props.mix({
				gridColumnEnd:endCol + 1,
				"-ms-grid-column-span": endCol 
			});
		}

		if (endRow) {
			props.mix({
				gridRowEnd:endRow + 1,
				"-ms-grid-row-span": endRow 
			});
		}


		return props;

	},

	gridCells: function(cols, rows) {
		var styles = [];
		cols.forEach(function (col, index) {

			styles.push(cssRule.clone(pg.gridCell(index + 1), {selectors: ['.col-' + (index + 1)]}));
			styles.push(cssRule.clone(pg.gridCell(0,0,index + 1).mix({selectors: ['.end-col-' + (index + 1)]})));
		});
		rows.forEach(function (row, index) {
			styles.push(cssRule.clone(pg.gridCell(0,index + 1),{selectors: ['.row-' + (index + 1)]}));
			styles.push(cssRule.clone(pg.gridCell(0,0,0,index + 1),{selectors: ['.end-row-' + (index + 1)]}));
		});	
		return styles;
	},

	// Auto placement of cells based on the nth-child
	gridAuto: function (cols, rows) {
		var styles = [];
		cols.forEach(function (col, index) {
			if (!index) { return; } // skip 1st column
			styles.push(cssRule.clone(pg.gridCell(index + 1),{selectors: [':nth-child(' + cols.length + 'n+' + (index + 1)]}));
	 	});

		rows.forEach(function (row, index) {
			if (!index) { return; } // skip 1st row
			styles.push(cssRule.clone(pg.gridCell(0, index + 1),{selectors: [':nth-child(n+' + (index * cols.length + 1)]}));
		});

		return styles;
	},
	// Generate css grid template
	grid: function (cols, rows) {
		var css =
			'display:grid;\
display:-ms-grid;\
';

		if (Array.isArray(cols) && cols.length) {
			css += '\
grid-template-columns: ' + cols.join(' ') + ';\
-ms-grid-columns:' + cols.join(' ') + ';\
';
		}

		if (Array.isArray(rows) && rows.length) {
			css += '\
grid-template-rows: '+ rows.join(' ') + ';\
-ms-grid-rows: ' + rows.join(' ') + ';\
';
		}
		return css;
	},

	// Generate grid css based on config
	css: function (config) {
		var html = '';
		var cls = config.prefix;

		// Grid template
		html += '.' + cls + ' {\
' + this.grid(config.cols, config.rows) + '\
}';

		// Auto placement
		html += '/* Auto placement of grid cells based on the order */'
		this.gridAuto(config.cols, config.rows).forEach(function(rule) {
			rule.selectors[0] = '.' + cls + ' > ' + rule.selectors[0];
			html += rule.toString() + "\r\n";
		});

		// Explicit placement
		html += '/* Explicit placement of grid cells */';
		this.gridCells(config.cols, config.rows).forEach(function(rule) {
			rule.selectors[0] = '.' + cls + ' > ' + rule.selectors[0];
			html += rule.toString() + "\r\n";
		});

		// Grid cell classes
		return html;
	}

};
