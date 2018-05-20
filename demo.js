var config = {
	name: 'Power Grid',
	version: '0.1.0',
	url: 'https://github.com/bblocks/powergrid/',
	cols: ['minmax(min-content, 1fr)', 'minmax(min-content, 1fr)' ,'minmax(min-content, 1fr)', 'minmax(min-content, 1fr)'],
	rows: ['minmax(min-content, 1fr)', 'minmax(min-content, 1fr)' ,'minmax(min-content, 1fr)'],
	cells: [
		{
		},
		{
		},
		{
		},
		{
		},
		{
			col:1,
			endCol:4
		},
		{
		},
		{
			row:2,
			endRow:3,
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
	colPrefix: 'col',
	rowPrefix: 'row',
	dash: '-'
};

function createGrid() {
	var $grid = $('#grid');
	$grid.attr('class', config.prefix + ' fluid');
	$grid.html('');
	config.cells.forEach(function(cell, index) {
		var cls = ['cell'];
		if (cell.col) {
			cls.push('col-' + cell.col);
		}
		if (cell.row) {
			cls.push('row-' + cell.row);
		}
		if (cell.endCol) {
			cls.push('end-col-' + cell.endCol);
		}
		if (cell.endRow) {
			cls.push('end-row-' + cell.endRow);
		}

		if (cell.order) {
			cls.push('order-' + cell.order);
		}

		$grid.append('<div class="' + cls.join(' ') + '">' + (encodeURIComponent(cell.text || index)) + '</div>');
	});
}

function createStyles() {
	var $style = $('#grid-css');
	console.log($style);
	var css = pg.css(config);
	console.log(css);
	$style.html(css);
}


function cellDialog(element, event) {
	var $dialog = $('.dialog');
	var $cell = $(element);
	function outsideClick() {
		if ($dialog || $dialog.length) {
			$dialog.hide({duration: 400, easing: 'swing'});
		}
		$(window).off('click', outsideClick);
	}
	
	if (!$dialog.length) { 
		$dialog = $('<div class="dialog" for="" style="display:none"><p><label>Row<select></select></div>');
		$dialog.on('click', function(e) {
			e.stopPropagation();
		});
	}
	$dialog.appendTo(element);
	$dialog.show({duration: 400, easing: 'swing', done: function() {
		$(window).on('click', outsideClick);
	}});
}

$(function() {
	createGrid();
	createStyles();

	$('.cell').on('click', function(event) {
		cellDialog(this, event);
	});

});