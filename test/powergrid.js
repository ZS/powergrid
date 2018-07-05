var powergrid  = require('../powergrid');

var config = {
	name: 'Power Grid',
	version: '0.1.0',
	url: 'https://github.com/bblocks/powergrid/',
	cols: ['minmax(max-content,1fr)', 'minmax(min-content,1fr)', 'minmax(min-content,1fr)', 'minmax(min-content)'],
	rows: ['minmax(max-content,1fr)', 'minmax(max-content,1fr)', 'minmax(max-content,1fr)'],
	cells: [
		{
			text:'1231231231'
		},
		{
		},
		{
		},
		{
		},
		{
			col:1,
			colSpan:4
		},
		{
		},
		{
			row:2,
			rowSpan:2,
			order:1
		},
		{
		},
		{
		},
		{
		},
		{
		},
		{
		}
	],
	prefix: 'grid',
};

console.log(powergrid.toCss(config));