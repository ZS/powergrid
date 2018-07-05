'use strict';
var compose = require('@bblocks/compose');
var toCss = require('to-css');
var _ = Object.assign(_ || {}, compose);

// Credits: https://github.com/lazycoffee/lc-camel-to-hyphen
function camelToHyphen(text){
    return text.replace(/^[A-Z]/, match=>match.toLowerCase())
    .replace(/[A-Z]/g, match=>'-' + match.toLowerCase());
}

// Credits: https://stackoverflow.com/questions/11233498/json-stringify-without-quotes-on-properties
function stringify(obj_from_json){
    if(typeof obj_from_json !== "object" || Array.isArray(obj_from_json)){
        // not an object, stringify using native function
        return JSON.stringify(obj_from_json);
    }
    // Implements recursive object serialization according to JSON spec
    // but without quotes around the keys.
    let props = Object
        .keys(obj_from_json)
        .map(key => `${key}:${stringify(obj_from_json[key])}`)
        .join(",");
    return `{${props}}`;
}

var cssRule = new _.Block({
	selectors:null,
	toString: function () {
		var props = this.clone();
		delete props.toString;
		Object.keys(props).forEach(function(name) {
			var newName = camelToHyphen(name);
			props[newName] = props[name];
			delete props[name];
		});
		var css = stringify(props).replace(/\_\_:/ig,'');
		if (!this.selectors) {return css;}
		if (Array.isArray(this.selectors)) {return this.selectors.join(',') + ' ' + css;}
		return this.selectors + ' ' + css;
	}
});

function rulesToString(arr) {		
	return arr.reduce(function(accumulator, currentValue) {
		return accumulator + currentValue.toString() + "/r/n";
	},'');
};



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
	var css = '';
	style.forEach(function(rule) {
		css += rules.toString();
	})		
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

	console.log('???', rulesToString([cssRule.clone({color:'red'})]), cssRule.clone({color:'red'}));
	// Template
	return `|=============== ${config.name} v${config.version} ${config.url} 
/* Grid lines template */
${'.'+cls} ${grid(config.cols, config.rows).toString()}
`;

// /* Auto placement of grid cells based on the order /
// ${gridAuto(config.cols, config.rows, config.prefix);

// 	// Explicit placement
// 	html += '/* Explicit placement of grid cells */' +"\r\n";
// 	gridCells(config.cols, config.rows).forEach(function(rule) {
// 		rule.selectors[0] = '.' + cls + ' > ' + rule.selectors[0];
// 		html += rule.toString() + "\r\n";
// 	});

// 	// Order of layers
// 	html += '/* Order of layers */' + "\r\n";
// 	config.cells.forEach(function(cell, index) {
// 		html += '.' + cls + ' > .order-' + (index + 1) + ' {z-index: ' + (index + 1) +';}' + "\r\n";

// 	});

// 	// Alignment
// 	html += '/* Alignment */' + "\r\n";
// 	var values = ['start', 'end', 'center', 'stretch'];
// 	values.forEach(function(value, index) {
// 		// Grid cells alignment
// 		html += cssRule.clone(gridCell(0,0,0,0,value,0)).mix({selectors: ['.justify-' + value + ' > * ']}).toString() + "\r\n";
// 		html += cssRule.clone(gridCell(0,0,0,0,0,value)).mix({selectors: ['.align-' + value + ' > * ']}).toString() + "\r\n";

// 		// Overrides
// 		html += cssRule.clone(gridCell(0,0,0,0,0,value)).mix({selectors: ['.' + cls + ' > .align-' + value ]}).toString() + "\r\n";
// 		html += cssRule.clone(gridCell(0,0,0,0,value,0)).mix({selectors: ['.' + cls + ' > .justify-' + value]}).toString() + "\r\n";
// 	});

// 	html += "\r\n/*					=================|*/";

// 	// Grid cell classes
// 	return html;
}

module.exports = {
	gridCell: gridCell, 
	toCss: css, 
	gridCells: gridCells,
	grid: grid, 
	gridAuto: gridAuto
};