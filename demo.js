var config = {
	cols: ['auto', '1fr' ,'auto'],
	rows: ['1fr', '1fr' ,'1fr'],
	cells: [
		{
			text: '1'
		},
		{
			text: '2',
		},
		{
			text: '3',
		},
		{
			text: '4',
		}
	],
	prefix: 'grid',
	colPrefix: 'col',
	rowPrefix: 'row',
	dash: '-'
};

function createGrid() {
	var $grid = $('#grid');
	$grid.attr('class', config.prefix + ' fluid');
	$grid.html('');
	config.cells.forEach(function(cell, index) {
		$grid.append('<div class="cell">' + (cell.text || index) + '</div>');
	});
}

function createStyles() {
	var $style = $('#grid-css');
	console.log($style);
	var css = pg.css(config);
	console.log(css);
	$style.html(css);
}

$(function() {
	createGrid();
	createStyles();
})