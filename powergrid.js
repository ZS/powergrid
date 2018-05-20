var pg = {
	gridCell: function (startCol, startRow, endCol, endRow) {
		var css = '';
		if (startCol) {
			css += '\
grid-column-start:'+ startCol + ';\
-ms-grid-column:'+ startCol + ';\
';
		}

		if (startRow) {
			css += '\
grid-row-start:'+ startRow + ';\
-ms-grid-row:'+ startRow + ';\
';
		}
		return css;

	},

	gridCells: function(cols, rows) {
		var styles = [];
		cols.forEach(function (col, index) {
			styles.push('.col-' + (index + 1) + ' {' + pg.gridCell(index + 1) + '}');
		});
		return styles;

	},

	// Auto placement of cells based on the nth-child
	gridAuto: function (cols, rows) {
		var styles = [];
		cols.forEach(function (col, index) {
			if (!index) { return; } // skip 1st column 
			styles.push(':nth-child(' + cols.length + 'n+' + (index + 1) + ') {' + pg.gridCell(index + 1) + '}');
		});

		rows.forEach(function (row, index) {
			if (!index) { return; } // skip 1st row
			styles.push(':nth-child(n+' + (index * cols.length + 1) + ') {' + pg.gridCell(0, index + 1) + '}');
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
		html += '.' + cls + ' > ' + this.gridAuto(config.cols, config.rows).join('\
.'+ cls + ' > ');

		// Explicit placement
		html += '.' + cls + ' > ' + this.gridCells(config.cols, config.rows).join('\
		.'+ cls + ' > ');

		// Grid cell classes
		return html;
	}

};
