var config = {
	name: 'Power Grid',
	version: '0.1.0',
	url: 'https://github.com/bblocks/powergrid/',
	cols: ['minmax(max-content,1fr)', 'minmax(min-content,1fr)', 'minmax(min-content,1fr)', 'minmax(min-content,1fr)'],
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
var htmlText;
function createGrid() {
	htmlText = '';
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
		htmlText += "    "+'<div class="' + cls.join(' ') + '">' + (encodeURIComponent(cell.text || index)) + '</div>'+ "\r\n";		
	});
}

function createStyles() {
	var $style = $('#grid-css');
	var css = powergrid.toCss(config);
	$style.html(css);
}

function indentCSS(source){
	source = source.replace(/}/gi,'}\n');
	source= source.replace(/{/gi, "{\n    ");
	source= source.replace(/;(?!})/gi, ";\n    ");
	source= source.replace(/;(?=})/gi, ";\n");
	return source;
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

var closeModal = function(el){
	$(el).closest(".modal").fadeOut();
}

var showEditJSONModal = function(){
	$("#jsonContainer").fadeIn();
	
	// create the editor	
	var options = {};
	var container = $("#jsonContainer .modal-content .modal-body");

	if(typeof editor == 'undefined' && container.length){
		editor = new JSONEditor(container[0], options);
	}	
	
	editor.set(config);
}

var saveEditedJSON = function(){
	$("#jsonContainer").fadeOut();

	if(editor){
		config=editor.get();
		buildGrid();
	}	
}

var buildGrid = function(){
	createGrid();
	createStyles();


	// $('.cell').on('click', function(event) {
	// 	cellDialog(this, event);
	// });
}

$(function() {	
	buildGrid();
	$('#open-source-code').on('click',function(){
		getHTML();
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
		shown: function(obj){
		  //obj.find(".handle").html('<span class="glyphicon glyphicon-chevron-right"></span>');
		  obj.find(".handle").html('&#10095;');
		  obj.addClass("left-shadow-overlay");
		},
		hidden: function(obj){
		  //obj.find(".handle").html('<span class="glyphicon glyphicon-chevron-left"></span>');
		  obj.find(".handle").html('&#10094;');
		  obj.removeClass("left-shadow-overlay");
		}
	});

	$("#menu-bar a").on("click",function(){
		slider.slideReveal("hide");
	});
});



var htmlExample="";
function getHTML(){
	$('#showCSS').html(powergrid.toCss(config));	
	htmlExample = '<!---<div id="grid" class="'+config.prefix+'">\r\n'+htmlText+'</div>//-->';
	$('#htmlEg').html(htmlExample);
	highlight();
}

function copyContent(source){
	var textarea=document.createElement('textarea');
		
	if(source == "html"){
		textarea.value= '<div id="grid" class="'+config.prefix+' fluid">\r\n'+htmlText+'</div>';
		var tooltip = document.querySelector("#myTooltipHtml");
 		tooltip.innerHTML = "Copied HTML" ;
	}
	if(source == "css"){
		textarea.value = indentCSS(powergrid.toCss(config));
		var tooltip = document.querySelector("#myTooltipCss");
 		tooltip.innerHTML = "Copied CSS" ;
	}
	$('body').append(textarea);
	textarea.style.height = 0;
	textarea.style.width = 0;
	textarea.style.opacity = 0;
	textarea.select();
	document.execCommand("copy");
	textarea.remove();
}

function highlight () {
	if (!hljs) {console.warn('Highlight JS library is missing');return;}		
	$('code[for]').each(function () {
		// Get source code
		var sourceId = $(this).attr('for');
		var $source = $('#' + sourceId);
		if (!$source.length) { return; }
		var html = $source.html();
		// Fix links
		html = replaceAll(html, ['<!---','//-->', '//--&gt;'], ['','','']);
		console.log(html);		
		var results = hljs.highlight('html', html);
		if (results.value) {
			var code = results.value;
			this.innerHTML = '<pre>' + code + '</pre>';
		}
	})
}

 function replaceAll (string, search, replacement) {
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
	if(src == "html"){
		var tooltip = document.querySelector("#myTooltipHtml");
 		tooltip.innerHTML = "Copy HTML to clipboard" ;
	}
	else if(src == "css"){
		var tooltip = document.querySelector("#myTooltipCss");
 		tooltip.innerHTML = "Copy CSS to clipboard" ;
	}
  }
