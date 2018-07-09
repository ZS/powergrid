'use strict';

function gridCell(startCol, startRow, colSpan, rowSpan, justify, align) {
	var props = {};
	if (startCol) {
		props = Object.assign(props, {	
			gridColumnStart: startCol,
			"-ms-grid-column": startCol
		})
	}

	if (startRow) {
		props = Object.assign(props, {
			gridRowStart:startRow,
			"-ms-grid-row": startRow 
		});
	}

	if (colSpan) {
		props = Object.assign(props, {
			gridColumnEnd: 'span ' + colSpan,
			"-ms-grid-column-span": colSpan
		});
	}

	if (rowSpan) {
		props = Object.assign(props, {
			gridRowEnd: 'span ' + rowSpan,
			"-ms-grid-row-span": rowSpan 
		});
	}

	if (justify) {
		props = Object.assign(props, {
			justifySelf: justify,
			"-ms-grid-column-align": justify
		});
	}

	if (align) {
		props = Object.assign(props, {
			alignSelf: align,
			"-ms-grid-row-align": align
		});
		
	}
	return props;
};

/**
 * Converts object to CSS strings. Credits: https://github.com/desirable-objects/json-to-css
 * @param {object} style - Object like {h1: {color: '#F1F1F1';}}
 * @returns {string} - CSS 
 */
function objToCss(json) {	
	if (!json) {return '';}
	if (typeof json != 'object') {return '';}
	var output = "";
	var indent = '  ';
	try {
		for (var selector in json) {
			if (json.hasOwnProperty(selector)) {
				output += selector + " {\r\n";
				for (var style in json[selector]) {
					if (json[selector].hasOwnProperty(style)) {

						output += indent + camelToHyphen(style.replace(/\_\_/ig,'')) + ': ' + json[selector][style] + ";\r\n";
					}
				}
				output += "}\r\n";
			}
		}
	} catch (e) {
		return "Not a valid JSON..!";
	}
	return output;
}

function camelToHyphen(text){
    return text.replace(/^[A-Z]/, function(match) {return match.toLowerCase();})
    .replace(/[A-Z]/g, function(match) {return '-' + match.toLowerCase();});
}

function arrayToCss(styles) {
	return styles.reduce(function(accumulator, currentValue) {
		return accumulator + objToCss(currentValue) + "\r\n";
	},'');
}

function gridCells(cols, rows, prefix) {
	var styles = [];
	cols.forEach(function (col, index) {
		var style = {};
		style['.' + prefix + ' > .col-' + (index + 1) + ':nth-child(n)'] = gridCell(index + 1);		
		if (index>0) {
			style['.' + prefix + ' > .col-span-' + (index + 1) + ':nth-child(n)'] = gridCell(0,0,index + 1);
		}
		styles.push(style);
	});
	rows.forEach(function (row, index) {
		var style = {};
		style['.' + prefix + ' > .row-' + (index + 1) + ':nth-child(n)'] = gridCell(0,index + 1);
		if (index>0) {
			style['.' + prefix + ' > .row-span-' + (index + 1) + ':nth-child(n)'] = gridCell(0,0,0,index + 1);
		}
		styles.push(style);
	});	
	return styles;
};


function gridAuto(cols, rows, prefix) {
	var styles = [];
	cols.forEach(function (col, index) {
		var style = {};
		style['.' + prefix + ' > :nth-child(' + cols.length + 'n+' + (index + 1)+')'] = gridCell(index + 1);
		styles.push(style);
	});

	rows.forEach(function (row, index) {
		var style = {};
		style['.' +prefix + ' > :nth-child(n+' + (index * cols.length + 1)+')'] = gridCell(0, index + 1);
		styles.push(style);
	});
	return styles;
};


function cellAlign(prefix) {
	var values = ['start', 'end', 'center', 'stretch'];
	var styles = [];
 	values.forEach(function(value, index) {
		var style = {}
		style['.justify-' + value + ' > * '] = gridCell(0,0,0,0,value,0);
		style['.align-' + value + ' > * '] = gridCell(0,0,0,0,0,value);
		style['.' + prefix + ' > .align-' + value] = gridCell(0,0,0,0,0,value);
		style['.' + prefix + ' > .justify-' + value] = gridCell(0,0,0,0,value,0);
		styles.push(style);
	});
	return styles;
}


// Generate css grid template
function grid(cols, rows, prefix) {
	var style = {};

	style['display'] =  'grid';
	style['display__'] = '-ms-grid';

	if (Array.isArray(cols) && cols.length) {
		style['gridTemplateColumns'] = cols.join(' ');
		style['-ms-grid-columns'] =  cols.join(' ');
	}

	if (Array.isArray(rows) && rows.length) {
		style['gridTemplateRows'] =  rows.join(' ');
		style['-ms-grid-rows'] =  rows.join(' ');
	}
	var obj = {};
	obj['.'+prefix] = style;
	return obj;
};

function cellOrder(cells, prefix) {
	return cells.reduce(function(accumulator, currentValue, currentIndexOptional) {
		return accumulator + '.' + prefix + ' > .order-' + (currentIndexOptional + 1) + ' {z-index: ' + (currentIndexOptional + 1) +';}' + "\r\n"
	}, '');
}

// Generate grid css based on config
function toCss(config) {
	// CSS Template
	return `/********** ${config.name} v${config.version} ${config.url} **************/
/* Grid lines template */
${objToCss(grid(config.cols, config.rows, config.prefix))}

/* Auto placement of grid cells based on the order */
${arrayToCss(gridAuto(config.cols, config.rows, config.prefix))}

/* Explicit placement of grid cells */
${arrayToCss(gridCells(config.cols, config.rows, config.prefix))}

/* Order of layers */
${cellOrder(config.cells, config.prefix)}

/* Alignment */
${arrayToCss(cellAlign(config.prefix))}
`;
}

export {
	gridCell, 
	toCss, 
	gridCells,
	grid, 
	 gridAuto
};