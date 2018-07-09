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
		if (cell.colSpan) {
			cls.push('col-span-' + cell.colSpan);
		}
		if (cell.rowSpan) {
			cls.push('row-span-' + cell.rowSpan);
		}

		if (cell.order) {
			cls.push('order-' + cell.order);
		}

		if (cell.align) {
			cls.push('align-self-' + cell.align)
		}

		if (cell.justify) {
			cls.push('justify-self-'+justify);
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

var getCurrentLocation = {
    getSearchStr: function () {
        return window.location.search;
    }
};

/**
 * Try to fetch the config from the URL query string.
 */
function fetchConfig() {
	var searchStr = getCurrentLocation.getSearchStr();
	var query = searchStr.split("=")[1];
	try {
		return JSON.parse(window.atob(query));
	} catch (error) {
		console.warn('Could not fetch the config based on the URL. Proceeding with default config.');
		return null;
	}
}

function updateUrl(config) {
	var str = JSON.stringify(config);
	location.search = "?q=" + window.btoa(str);
}

$(function() {

	// Fetch the config from the URL. Fallback to default if URL config is invalid.
	config = fetchConfig() || config;

	createGrid();
	createStyles();

	$('.cell').on('click', function(event) {
		cellDialog(this, event);
	});

});
