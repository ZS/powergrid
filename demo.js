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

		$grid.append('<div' + (cls ? ' class="' + cls + '"' : '') + '>' + format(encodeURIComponent(cell.text || index)) + '</div>');
		htmlText += "    " + '<div' + (cls ? ' class="' + cls + '"' : '') + '>' + format(encodeURIComponent(cell.text || index)) + '</div>' + "\r\n";
	});
}

/**
 * Formats an HTML string to convert patters like "img-250-50" into images
 * @param {string} htmlString original HTML
 * @return {string} Updated HTML string
 */
function format(htmlString) {
	var html = htmlString;
	var arr = html.split('-');
	if (arr.length == 3 && arr[0] == 'img') {
		html = '<img src="https://via.placeholder.com/' + arr[1] + 'x' + arr[2] + '">';
	}
	return html;
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
	var str = JSON.stringify(config);
	window.history.pushState({}, document.head.title, "?q=" + window.btoa(str));
}

var closeModal = function (el) {
	$(el).closest(".pg-modal").fadeOut();
	$('#grid').find('.selected-grid').removeClass('selected-grid');	
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

var saveEditedJSON = function () {
	if (editor) {
		try {
			config = editor.get();
			updateUrl(config);
			buildGrid();
			//$("#jsonContainer").fadeOut();
		} catch (error) {
			createAlert("Error parsing provided JSON. Please fix the error(s) marked in red below. Please see console for more details.", $('#editor-error-container'), error.name);
		}
	}
}

function bindCellClick() {
	$('#grid > div').on('click', function (event) {
	
		// Open all settings modal
		$("#menuContainer").fadeIn();
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
		
		$("#cell-text").val(config.cells[cellIndex].text || '');
		//$("#cellContainer").fadeIn();
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
function deleteCell(){
	config.cells.splice(cellIndex,1);
	updateUrl(config);
	buildGrid();
	// $('#cellContainer').fadeOut();
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
	//$('#cellContainer').fadeOut();
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


	// At last, update warnings count to be reflected in badge.
	$('.help-tab').attr('count', $('.alerts-container .alert').length);
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
	if(typeof ajaxHasFailed!="undefined" && ajaxHasFailed==true){
		demoStyle = indentCSS(demoStyle.replace(/\n.[\s]+/g, ''));
	}
	var gridStyle = powergrid.toCss(config);
	fullSource = '<!---<!doctype html> \r\n<html>\r\n<head>\r\n<style id="common">\r\n' + demoStyle + '\n</style>\r\n<style id="grid-css">\r\n' + gridStyle + '</style>\r\n</head>\r\n<body>\r\n<div id="grid" class="' + gridContainerClasses + '">\r\n' + htmlText + '</div> \r\n</body>//-->'
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
//ui configuration
var colIndex=0;
var rowIndex= 0;
function addColRow(field,fieldVal){
	if (field == 'col'){
		var col = '<div index="'+colIndex+'"><span><input type="radio" value="1fr" name="col'+colIndex+'"/></span> <span> 1fr </span><span><input type="radio" value="max-content" name="col'+colIndex+'"/></span><span> Max-content </span><span><input type="radio" value="min-content" name="col'+colIndex+'"/></span><span> Min-content </span><span><input type="radio" value="others" name="col'+colIndex+'"/></span><span> Others </span><span><input type="text" style="display:none" id="others-col-'+colIndex+'"/></span> <span><button class="delete-parent button button-delete">&#10006;</button></span></div>';
		$('#col-container').append(col);
		$("#col-container input[type='radio']").click(function(){
			var otherInputId = $(this).parent().parent().attr('index');
			if($(this).val() == "others"){
				
			$('input[id =others-col-'+otherInputId+']').css('display','inline');
			}
			else{
				$('input[id =others-col-'+otherInputId+']').css('display','none');
			}
		});
		if(fieldVal){
			if(fieldVal == '1fr'|| fieldVal == 'min-content' || fieldVal == 'max-content'){
				$('input[name=col'+colIndex+'][value='+fieldVal+']').prop('checked',true);
			}
			else{
				$('input[name=col'+colIndex+'][value=others]').click();
				$('#others-col-'+colIndex).val(fieldVal);
			}
		}
		colIndex++;
		
	}
	else if(field == 'row'){
		var col = '<div index="'+rowIndex+'"><span><input type="radio" value="1fr" name="row'+rowIndex+'"/></span> <span> 1fr </span><span><input type="radio" value="max-content" name="row'+rowIndex+'"/></span><span> Max-content </span><span><input type="radio" value="min-content" name="row'+rowIndex+'"/></span><span> Min-content </span><span><input type="radio" value="others" name="row'+rowIndex+'"/></span><span> Others </span><span><input type="text" style="display:none" id="others-row-'+rowIndex+'"/></span> <span><button class="delete-parent button button-delete">&#10006;</button></span></div>'
		$('#row-container').append(col);
		$("#row-container input[type='radio']").click(function(){
			var otherInputId = $(this).parent().parent().attr('index');
			if($(this).val() == "others"){
				
			$('input[id =others-row-'+otherInputId+']').css('display','inline');
			}
			else{
				$('input[id =others-row-'+otherInputId+']').css('display','none');
			}
		});
		if(fieldVal){
			if(fieldVal == '1fr'|| fieldVal == 'min-content' || fieldVal == 'max-content'){
				$('input[name=row'+rowIndex+'][value='+fieldVal+']').prop('checked',true);
			}
			else{
				$('input[name=row'+rowIndex+'][value=others]').click();
				$('#others-row-'+rowIndex).val(fieldVal);
			}
		}
		rowIndex++;
	}
	
	$('.delete-parent').click(function(){
		$(this).parent().parent().remove();
	});
	
}
function getGridData(){
	$('#grid-name').val(config.name);
	$('#grid-version').val(config.version);
	$('#grid-prefix').val(config.prefix);
	$('#grid-cells-no').val(config.cells.length);
	$('#grid-align-select').val(config.align);
	$('#grid-justify-select').val(config.justify);
	var colNum = config.cols.length;
	var rowNum =  config.rows.length;
	$('#col-container').html('');
	$('#row-container').html('');
	$('#col-error').css('display','none');
	$('#row-error').css('display','none');
	for(var i= 0; i< colNum; i++){
		addColRow('col',config.cols[i]);
	}
	for(var j = 0; j< rowNum; j++){
		addColRow('row',config.rows[j]);
	}
}

function setGridData(){
	var colArr = [];
	var rowArr = [];
	$('#col-error').css('display','none');
	$('#row-error').css('display','none');
	var $colContainer = $('#col-container>div');
	for(var i=0; i< $colContainer.length; i++){
		var colVal= $($colContainer[i]).find('input[type= radio]:checked').val();
		if(colVal == 'others'){
			if($($colContainer[i]).find('input[type= text]').val()){
				colArr.push($($colContainer[i]).find('input[type= text]').val());
			}
			else{
				$('#col-error').css('display','block');
				return false;
			}
		}
		else{
			colArr.push($($colContainer[i]).find('input[type= radio]:checked').val());
		}
	};
	
	var $rowContainer = $('#row-container>div');
	for(var i=0; i< $rowContainer.length; i++){
		var rowVal= $($rowContainer[i]).find('input[type= radio]:checked').val();
		if(rowVal == 'others'){
			if($($rowContainer[i]).find('input[type= text]').val()){
				rowArr.push($($rowContainer[i]).find('input[type= text]').val());
			}
			else{
				$('#row-error').css('display','block');
				return false;
			}
		}
		else{
			rowArr.push($($rowContainer[i]).find('input[type= radio]:checked').val());
		}
	};

	config.cols = colArr;
	config.rows = rowArr;
	config.name = $('#grid-name').val();
	config.version = $('#grid-version').val();
	config.prefix = $('#grid-prefix').val();
	config.align = $('#grid-align-select').val();
	config.justify = $('#grid-justify-select').val();
	var cellsNum = ''+$('#grid-cells-no').val(); 
	var configCellNum = ''+config.cells.length;
	if( cellsNum !== configCellNum ){
		var cellsArr=[];
		for(var i=0; i<cellsNum; i++){
			var cellObj = {};
			cellsArr.push(cellObj);
		}
		config.cells = cellsArr;
	};
	updateUrl(config);
	buildGrid();
	//$('#gridUIContainer').fadeOut();
}

function setDecoratorStyles(){
	var link = $("style#common").attr("href");

	$.when($.ajax(link)).then(function(data,textStatus,jqXHR) {
		if(data.length){
			$("style#common").html(data);
		}
	},function(){
		ajaxHasFailed=true;
	});
}

$(function () {
	config = fetchConfig() || config;

	fetchStatusWarnings().then(function(data){
		statusWarnings = data.warnings || {};
		showWarnings();
	});

	//Fetch and set common decorator styles
	setDecoratorStyles();

	buildGrid();

	$('.show-source-code').on('click', function () {
		getHTML();
		//getFullSource();
		highlight();
		// $("#sourceContainer").fadeIn();
		document.getElementById("defaultOpenTab").click();
	});

	$('.open-ui-configuration').on('click', function () {
		getGridData();
	});

	$('.show-json-editor').on('click', function () {
		showEditJSONModal();
	});
	
	$(".tablinks.active").click();

	// Open all settings modal when user clicks anywhere on document
	$("#grid").on("click",function(e){
		if(e.target == this){
			$("#menuContainer").fadeIn();
		}
	});

	window.onpopstate = function (event) {
		window.location.reload();
	};
});
