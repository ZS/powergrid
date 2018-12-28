var htmlText;
var cellIndex;

function indentCSS(source) {
	source = source.replace(/\*\//gi, '*/\n');
	source = source.replace(/}/gi, '}\n');
	source = source.replace(/{/gi, "{\n  ");
	source = source.replace(/;(?!})/gi, ";\n  ");
	source = source.replace(/;(?=})/gi, ";\n");
	return source;
}

/**
 * Try to fetch the config from the URL query string.
 */
function fetchConfig() {
	var searchStr = window.location.search;
	var query = searchStr.split("=")[1];
	try {
		return JSON.parse(window.atob(query));
	} catch (error) {
		console.warn('Could not fetch the config based on the URL. Proceeding with default config.');
		return null;
	}
}

function updateUrl(config) {
	app.updateState({q:window.btoa(JSON.stringify(config || {}))});
}

var closeModal = function (el) {
	$(el).closest(".pg-modal").attr('isopen','false');
}

var showEditJSONModal = function () {
	// create the editor	
	var options = {
		mode: 'code',
		modes: ['code', 'tree']
	};

	var container = $("#configJSONContainer .json-editor");

	if (typeof editor == 'undefined' && container.length) {
		editor = new JSONEditor(container[0], options);
	}

	editor.set(config);
}

var saveEditedJSON = function (el) {
	if (editor) {
		try {
			config = editor.get();
			updateUrl(config);
			closeModal(el);
			//buildGrid();
			//$("#jsonContainer").fadeOut();
		} catch (error) {
			createAlert("Error parsing provided JSON. Please fix the error(s) marked in red below. Please see console for more details.", $('#editor-error-container'), error.name);
		}
	}
}

function createAlert(html, $container, type){
	var type = type || "Warning";
	if(!$container){
		$container = $(".alerts-container");
	}

	if(!html){
		html = "Some features might behave differently in older browsers. Consider re-configuring your grid."
	}

	var $alert = $('<div>');
	$alert.addClass('alert');
	if (type == "Warning") {
		$alert.addClass('alert-warning');
	} else if (type == "Error") {
		$alert.addClass('alert-danger');
	}

	// TODO: Remove setTimeout once https://github.com/WebReflection/wicked-elements/issues/9 is fixed.
	setTimeout(function() {
		$alert.attr('type', type);
		$alert.attr('message', html);
	}, 0);

	$container.append($alert);
}
function stateChangeCallback(){
	showWarnings();
	var targetCellIndex = app.state.cell;

	if(app.state.dialogOpen=='true' && app.state.cell !== undefined){

		document.getElementById('grid').children[targetCellIndex].classList.add('selected-grid');
	}
}
function showWarnings(){

	if (!this.statusWarnings) {
		return;
	}

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


	// At last, update warnings count to be reflected in badge.
	var alertsCount = $('.alerts-container .alert').length;
	if (alertsCount) {
		$('.help-tab').attr('count', alertsCount);
	} else {
		$('.help-tab').removeAttr('count');
	}
}

var htmlExample = "";
var gridContainerClasses;
function getHTML() {
	gridContainerClasses = $('#grid').attr('class');
	$('#showCSS').html(powergrid.toCss(config));
	htmlExample = '<!---<div class="' + gridContainerClasses+ '">\r\n    ' + $("#grid").html().replace(/<\/[a-z]+>/g, "$&\r\n    ").split('    ').reverse().join("    ").replace("    ","").split("    ").reverse().join("    ") + '</div>//-->';
	$('#htmlEg').html(htmlExample);
}

var fullSource = "";
function getFullSource() {
	var decoratorStyle = document.querySelector('style#decoratorStylesheet').innerHTML;

	var gridStyle = powergrid.toCss(config);
	fullSource = '<!---<!doctype html> \r\n<html>\r\n<head>\r\n<style id="decoratorStylesheet">\r\n' + decoratorStyle + '\n</style>\r\n<style id="grid-css">\r\n' + gridStyle + '</style>\r\n</head>\r\n<body>\r\n<div id="grid" class="' + gridContainerClasses + '">\r\n    ' + $("#grid").html().replace(/<\/[a-z]+>/g, "$&\r\n    ").split('    ').reverse().join("    ").replace("    ","").split("    ").reverse().join("    ") + '</div> \r\n</body>//-->'
	$('#full-source').html(fullSource);
}

function copyContent(source) {
	var textarea = document.createElement('textarea');

	if (source == "html") {
		textarea.value = $('#htmlEg').html().replace("<!---", "").replace("//-->", "");
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
		preTag.textContent = html;
		hljs.highlightBlock(this);
		$(this).removeClass("hljs");
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


/*function openSourceContent(evt, sourceName) {
	var i, tabcontent, tablinks;
	var tabContainer = $(evt.currentTarget).closest(".power-grid-tab");
	tabcontent = tabContainer.siblings(".power-grid-tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = tabContainer[0].getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(sourceName).style.display = "block";
	evt.currentTarget.className += " active";
}*/


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

function setDecoratorStyles(){
	var styleSheet1 = $("style#decoratorStylesheet").attr("href");

	$.when($.ajax(styleSheet1)).then(function(data) {
		$("style#decoratorStylesheet").html(data);
		prepareViewSource();
	},function(){
		console.error("failed to load decorator stylesheet");
	});

}

function prepareViewSource(){
	getHTML();
	getFullSource();
	highlight();
	// $("#sourceContainer").fadeIn();
	$(this).find("[tab-id].active").click();
}

$(function () {
	config = fetchConfig() || config;

	fetchStatusWarnings().then(function(data){
		statusWarnings = data.warnings || {};
		showWarnings();
	});
	
	//Fetch and set common decorator styles
	setDecoratorStyles();

	//buildGrid();

	$('.show-source-code').on('click', prepareViewSource);

	// $('.open-ui-configuration').on('click', function () {
	// 	getGridData();
	// });

	$('.show-json-editor').on('click', function () {
		showEditJSONModal();
	});
	
	//getGridData();

	
	showEditJSONModal();

	//Open all settings modal when user clicks anywhere on document
	// $("#grid").on("click",function(e){
	// 	if(e.target == this){
	// 		$("#menuContainer").attr('isOpen','true');
	// 	}
	// });
	$("#pg-version").html(config.version);

	// Open click anywhere overlay for first load
	if (!(app && app.state && app.state.dialogOpen=="true")) {
		$("#clickAnywhereOverlay").fadeIn(500);
		// Auto fadeout overlay after 10 seconds if no response from user
		setTimeout(function () {
			$("#clickAnywhereOverlay").fadeOut(500);
			$("#clickAnywhereOverlay .got-it-button").off("click");
		}, 10000);

		$("#clickAnywhereOverlay .got-it-button").one("click", function () {
			$("#clickAnywhereOverlay").fadeOut(500);
		});
	}

	window.onpopstate = function (event) {
		window.location.reload();
	};

});
