var config = {
	name: 'Power Grid',
	version: '0.1.0',
	url: 'https://github.com/ZS/powergrid/',
	cols: ['minmax(max-content,1fr)', 'minmax(min-content,1fr)', 'minmax(min-content,1fr)', 'minmax(min-content,1fr)'],
	rows: ['minmax(max-content,1fr)', 'minmax(max-content,1fr)', 'minmax(max-content,1fr)'],
	align: 'stretch',
	justify: 'stretch',
	cells: [
		{
			text: '1231231231'
		},
		{
		},
		{
			align: 'end',
			justify: 'end'
		},
		{
		},
		{
			col: 1,
			colSpan: 4
		},
		{
		},
		{
			row: 2,
			rowSpan: 2,
			order: 1
		},
		{
		},
		{
			align: 'center',
			justify: 'center'
		},
		{
		},
		{
		},
		{
			align: 'start',
			justify: 'start'
		}
	],
	prefix: 'pg-',
};
var htmlText;
function createGrid() {
	htmlText = '';
	var $grid = $('#grid');
	$grid.attr('class', config.prefix + 'grid fluid');
	
	if (config.align) {
		$grid.addClass(config.prefix + 'align-' + config.align);
	}

	if (config.justify) {
		$grid.addClass(config.prefix + 'justify-' + config.justify);
	}

	$grid.html('');
	config.cells.forEach(function (cell, index) {
		var cls = [];
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
			cls.push(config.prefix + 'align-self-' + cell.align)
		}

		if (cell.justify) {
			cls.push(config.prefix + 'justify-self-' + cell.justify);
		}
		var cls = cls.join(' ').trim();

		$grid.append('<div' + (cls ? ' class="' + cls + '"' : '') + '>' + (encodeURIComponent(cell.text || index)) + '</div>');
		htmlText += "    " + '<div' + (cls ? ' class="' + cls + '"' : '') + '>' + (encodeURIComponent(cell.text || index)) + '</div>' + "\r\n";
	});
}

function createStyles() {
	var $style = $('#grid-css');
	var css = powergrid.toCss(config);
	$style.html(css);
}

function indentCSS(source) {
	source = source.replace(/\*\//gi, '*/\n');
	source = source.replace(/}/gi, '}\n');
	source = source.replace(/{/gi, "{\n  ");
	source = source.replace(/;(?!})/gi, ";\n  ");
	source = source.replace(/;(?=})/gi, ";\n");
	return source;
}

function cellDialog(element, event) {
	var $dialog = $('.dialog');
	var $cell = $(element);
	function outsideClick() {
		if ($dialog || $dialog.length) {
			$dialog.hide({ duration: 400, easing: 'swing' });
		}
		$(window).off('click', outsideClick);
	}

	if (!$dialog.length) {
		$dialog = $('<div class="dialog" for="" style="display:none"><p><label>Row<select></select></div>');
		$dialog.on('click', function (e) {
			e.stopPropagation();
		});
	}
	$dialog.appendTo(element);
	$dialog.show({
		duration: 400, easing: 'swing', done: function () {
			$(window).on('click', outsideClick);
		}
	});
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
	window.history.pushState({}, document.head.title, "?q=" + window.btoa(str));
}

var closeModal = function (el) {
	$(el).closest(".modal").fadeOut();
}

var showEditJSONModal = function () {
	$("#jsonContainer").fadeIn();

	// create the editor	
	var options = {
		mode: 'code',
		modes: ['code', 'tree']
	};

	var container = $("#jsonContainer .modal-content .modal-body");

	if (typeof editor == 'undefined' && container.length) {
		editor = new JSONEditor(container[0], options);
	}

	editor.set(config);
}

var saveEditedJSON = function () {
	$("#jsonContainer").fadeOut();

	if (editor) {
		config = editor.get();
		updateUrl(config);
		buildGrid();
	}
}

var buildGrid = function () {
	createGrid();
	createStyles();


	// $('.cell').on('click', function(event) {
	// 	cellDialog(this, event);
	// });
}

$(function () {
	config = fetchConfig() || config;
	buildGrid();

	$('#open-source-code').on('click', function () {
		getHTML();
		getFullSource();
		highlight();
		$("#sourceContainer").fadeIn();
		document.getElementById("defaultOpenTab").click();
	});
	//Initialize configuration panel
	var slider = $("#menu-bar").slideReveal({
		// width: 100,
		push: false,
		position: "right",
		// speed: 600,
		trigger: $("#menu-bar .handle"),
		// autoEscape: false,
		shown: function (obj) {
			//obj.find(".handle").html('<span class="glyphicon glyphicon-chevron-right"></span>');
			obj.find(".handle").html('&#10095;');
			obj.addClass("left-shadow-overlay");
		},
		hidden: function (obj) {
			//obj.find(".handle").html('<span class="glyphicon glyphicon-chevron-left"></span>');
			obj.find(".handle").html('&#10094;');
			obj.removeClass("left-shadow-overlay");
		}
	});

	$("#menu-bar a").on("click", function () {
		slider.slideReveal("hide");
	});

	window.onpopstate = function (event) {
		window.location.reload();
	};
});



var htmlExample = "";
var gridContainerClasses;
function getHTML() {
	gridContainerClasses = $('#grid').attr('class');
	$('#showCSS').html(powergrid.toCss(config));
	htmlExample = '<!---<div class="' + gridContainerClasses+ '">\r\n' + htmlText + '</div>//-->';
	$('#htmlEg').html(htmlExample);
}

var fullSource ="";
function getFullSource(){
	var demoStyle = document.querySelector('#common').innerHTML;
	demoStyle = indentCSS(demoStyle.replace(/\n.[\s]+/g,''));
	var gridStyle =powergrid.toCss(config);
	fullSource = '<!---<!doctype html> \r\n<html>\r\n<head>\r\n<style id="common">\r\n'+demoStyle+'</style>\r\n<style id="grid-css">\r\n'+gridStyle+'</style>\r\n</head>\r\n<body>\r\n<div id="grid" class="' + gridContainerClasses + '">\r\n' + htmlText + '</div> \r\n</body>//-->'
	$('#full-source').html(fullSource);
}

function copyContent(source) {
	var textarea = document.createElement('textarea');

	if (source == "html") {
		textarea.value = '<div class="' + config.prefix + ' fluid">\r\n' + htmlText + '</div>';
		var tooltip = document.querySelector("#myTooltipHtml");
		tooltip.innerHTML = "Copied HTML";
	}
	else if (source == "css") {
		textarea.value = indentCSS(powergrid.toCss(config));
		var tooltip = document.querySelector("#myTooltipCss");
		tooltip.innerHTML = "Copied CSS";
	}
	else if(source == "full-source"){
		textarea.value=  replaceAll(fullSource, ['<!---', '//-->', '//--&gt;'], ['', '', '']);
		var tooltip = document.querySelector("#myTooltipFullSource");
		tooltip.innerHTML = "Copied Source";
	}
	$('body').append(textarea);
	textarea.style.height = 0;
	textarea.style.width = 0;
	textarea.style.opacity = 0;
	textarea.select();
	document.execCommand("copy");
	textarea.remove();
}

function highlight() {
	if (!hljs) { console.warn('Highlight JS library is missing'); return; }
	$('code[for]').each(function () {
		// Get source code
		var sourceId = $(this).attr('for');
		var $source = $('#' + sourceId);
		if (!$source.length) { return; }
		var html = $source.html();
		// Fix links
		html = replaceAll(html, ['<!---', '//-->', '//--&gt;'], ['', '', '']);
		this.innerHTML = '<pre></pre>';
		var preTag =this.querySelector('pre');
		preTag.innerText = html;
		hljs.highlightBlock(this);
	})
}

function replaceAll(string, search, replacement) {
	var newString = string;
	if (!$.isArray(search)) {
		search = [search];
	}
	if (!$.isArray(replacement)) {
		replacement = [replacement];
	}

	for (var i = 0; i < search.length; i++) {
		newString = newString.replace(search[i], replacement[i]);
	}

	return newString;
}


function openSourceContent(evt, sourceName) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("power-grid-tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(sourceName).style.display = "block";
	evt.currentTarget.className += " active";
}


function tooltipOutFunc(src) {
	if (src == "html") {
		var tooltip = document.querySelector("#myTooltipHtml");
		tooltip.innerHTML = "Copy HTML to clipboard";
	}
	else if (src == "css") {
		var tooltip = document.querySelector("#myTooltipCss");
		tooltip.innerHTML = "Copy CSS to clipboard";
	}
	else if (src == "full-source") {
		var tooltip = document.querySelector("#myTooltipFullSource");
		tooltip.innerHTML = "Copy Source to clipboard";
	}
}
