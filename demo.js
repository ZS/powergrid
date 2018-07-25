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
var cellIndex;
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
	$(el).closest(".pg-modal").fadeOut();
	if($(el).closest(".pg-modal").attr('id') == 'cellContainer'){
		$('#grid').find('.selected-grid').removeClass('selected-grid');
	}
}

var showEditJSONModal = function () {
	$("#jsonContainer").fadeIn();

	// create the editor	
	var options = {
		mode: 'code',
		modes: ['code', 'tree']
	};

	var container = $("#jsonContainer .pg-modal-content .pg-modal-body");

	if (typeof editor == 'undefined' && container.length) {
		editor = new JSONEditor(container[0], options);
	}

	editor.set(config);
}

var saveEditedJSON = function () {
	if (editor) {
		try {
			config = editor.get();
			updateUrl(config);
			buildGrid();
			$("#jsonContainer").fadeOut();
		} catch (error) {
			createAlert("Error parsing provided JSON. Please fix the error(s) marked in red below. Please see console for more details.", $('#editor-error-container'), error.name);
		}
	}
}

function bindCellClick() {
	$('#grid > div ').on('click', function (event) {
		cellIndex = 0;
		var self = this;
		while ((self = self.previousSibling) != null) {
			cellIndex++;
		}
		if (config.cells[cellIndex].col) {
			$("#cell-col").val(config.cells[cellIndex].col);
		}
		else {
			$("#cell-col").val('');
		}
		if (config.cells[cellIndex].colSpan) {
			$("#cell-col-span").val(config.cells[cellIndex].colSpan);
		}
		else {
			$("#cell-col-span").val('');
		}
		if (config.cells[cellIndex].row) {
			$("#cell-row").val(config.cells[cellIndex].row);
		}
		else {
			$("#cell-row").val('');
		}
		if (config.cells[cellIndex].rowSpan) {
			$("#cell-row-span").val(config.cells[cellIndex].rowSpan);
		}
		else {
			$("#cell-row-span").val('');
		}
		if (config.cells[cellIndex].order) {
			$("#cell-order").val(config.cells[cellIndex].order);
		}
		else {
			$("#cell-order").val('');
		}
		if (config.cells[cellIndex].align) {
			$("#cell-align").val(config.cells[cellIndex].align);
		}
		else {
			$("#cell-align").val('');

		}
		if (config.cells[cellIndex].justify) {
			$("#cell-justify").val(config.cells[cellIndex].justify);
		}
		else {
			$("#cell-justify").val('');
		}
		
		$("#cell-text").val(this.innerHTML);
		$("#cellContainer").fadeIn();
		$(this).addClass('selected-grid');
	});

	$('[onlynumber]').keypress(function (event) {
		var keycode = event.which;
		if (!(event.shiftKey == false && (keycode == 8 || keycode == 37 || keycode == 39 || (keycode >= 48 && keycode <= 57)))) {
			event.preventDefault();
		}
	});
}

var buildGrid = function () {
	createGrid();
	createStyles();
	
	if(typeof statusWarnings!=="undefined"){
		showWarnings();
	}	
	bindCellClick();
}

function saveCellOptions() {
	var cellText = $('#cell-text').val();
	var colStart = $('#cell-col').val();
	var colSpan = $('#cell-col-span').val();
	var rowStart = $('#cell-row').val();
	var rowSpan = $('#cell-row-span').val();
	var cellOrder = $('#cell-order').val();
	var cellAlign = $('#cell-align').val();
	var cellJustify = $('#cell-justify').val();

	config.cells[cellIndex].text = cellText;

	if (!(!config.cells[cellIndex].col && (colStart == '' || !colStart))) {
		config.cells[cellIndex].col = colStart;
	}
	if (!(!config.cells[cellIndex].row && (rowStart == '' || !rowStart))) {
		config.cells[cellIndex].row = rowStart;
	}
	if (!(!config.cells[cellIndex].colSpan && (colSpan == '' || !colSpan))) {
		config.cells[cellIndex].colSpan = colSpan;
	}
	if (!(!config.cells[cellIndex].rowSpan && (rowSpan == '' || !rowSpan))) {
		config.cells[cellIndex].rowSpan = rowSpan;
	}
	if (!(!config.cells[cellIndex].order && (cellOrder == '' || !cellOrder))) {
		config.cells[cellIndex].order = cellOrder;
	}
	if (!(!config.cells[cellIndex].align && (cellAlign == '' || !cellAlign))) {
		config.cells[cellIndex].align = cellAlign;
	}
	if (!(!config.cells[cellIndex].justify && (cellJustify == '' || !cellJustify))) {
		config.cells[cellIndex].justify = cellJustify;
	}
	updateUrl(config);
	buildGrid();
	$('#cellContainer').fadeOut();
}

function createAlert(html, $container, type){
	var type = type || "Warning";
	if(!$container){
		$container = $(".alerts-container");
	}

	if(!html){
		html = "Some features might behave differently in older browsers. Consider re-configuring your grid."
	}

	var $alert=$($("template#alert-template").html());

	$alert.find("[alert-type]").html(type+"!");

	if (type == "Error") {
		$alert.addClass('alert-danger');
	}

	$alert.find(".message").html(html);

	$container.append($alert);
}

function showWarnings(){
	$(".alerts-container").html("");

	// Auto placement warning
	for(var i=0;i<config.cells.length;i++){
		if(config.cells[i].colSpan>config.cols.length){
			createAlert(statusWarnings["auto-placement"]);
			break;
		}
	}
	
	// Grid template 'auto' warning
	if(config.cols.join("").indexOf("auto")>=0 || config.rows.join("").indexOf("auto")>=0){
		createAlert(statusWarnings["auto-grid-template"]);
	}
	
	// fit-content() warning	
	if(config.cols.join("").indexOf("fit-content")>=0){
		createAlert(statusWarnings["fit-content"]);
	}

	// align-items warning
	if(JSON.stringify(config).indexOf("align-items")>=0 || JSON.stringify(config).indexOf("justify-items")>=0){
		createAlert(statusWarnings["grid-alignment"]);
	}

	// grid-gap warning
	if(JSON.stringify(config).indexOf("-gap")>=0){
		createAlert(statusWarnings["grid-gap"]);
	}

	//TODO:Additional warning scenarios can be added here.
}

var htmlExample = "";
var gridContainerClasses;
function getHTML() {
	gridContainerClasses = $('#grid').attr('class');
	$('#showCSS').html(powergrid.toCss(config));
	htmlExample = '<!---<div class="' + gridContainerClasses+ '">\r\n' + htmlText + '</div>//-->';
	$('#htmlEg').html(htmlExample);
}

var fullSource = "";
function getFullSource() {
	var demoStyle = document.querySelector('#common').innerHTML;
	demoStyle = indentCSS(demoStyle.replace(/\n.[\s]+/g, ''));
	var gridStyle = powergrid.toCss(config);
	fullSource = '<!---<!doctype html> \r\n<html>\r\n<head>\r\n<style id="common">\r\n' + demoStyle + '</style>\r\n<style id="grid-css">\r\n' + gridStyle + '</style>\r\n</head>\r\n<body>\r\n<div id="grid" class="' + gridContainerClasses + '">\r\n' + htmlText + '</div> \r\n</body>//-->'
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
	else if (source == "full-source") {
		textarea.value = replaceAll(fullSource, ['<!---', '//-->', '//--&gt;'], ['', '', '']);
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
		this.innerHTML = '<pre class="hljs"></pre>';
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

function fetchStatusWarnings() {
	var deferred = $.Deferred();
	
	$.ajax({
		url:'./status-warnings.json',
		dataType: 'json',
		success: function(response){
			deferred.resolve(response);
		},
		error: function(err){
			deferred.resolve({});
		}
	});

	return deferred.promise();
}

$(function () {
	config = fetchConfig() || config;

	fetchStatusWarnings().then(function(data){
		statusWarnings = data.warnings || {};
		showWarnings();
	});

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