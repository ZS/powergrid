var gridEditor = {
	state: null,
	init: function(event) {
		this.el = event.target;
	},
	onconnected: function() {
		window.addEventListener('statechange', this);
	},
	onstatechange: function(event) {
		console.log('grid editor statechange', event);
		var newState = event.detail.newState;
		var changes = event.detail.changed;
		// Smart render
		if (!this.state) {
			this.state = newState;			
			this.render();
		} else if (changes.row !== undefined || changes.col !== undefined || changes.cell !== undefined || changes.q !== undefined) {
			this.state = event.detail.newState
			this.render();			
		} else {
			this.state = event.detail.newState
		}
	},
	onchange: function(event) {
		console.log('change', event.target);
		if (event.target.name == "track") { // Switch track
			// detect if track or grid item was selected
			var arr = event.target.value.split("-");
			var type = arr[0];
			var value = arr[1];
			var changes = {
				cell: null,
				col: null,
				row: null
			}
			changes[type] = value;
			console.log('changes', changes)
			app.updateState(changes);
			return;
		} else if (event.target.name == "value") { // Update config for tracks
			if (this.state.col) {
				config.cols[1*this.state.col] = event.target.value;
			} else if (this.state.row) {
				config.rows[1*this.state.row] = event.target.value;
			} 		
		} else if (this.state.cell) { // Update cells
			var arr = event.target.name.split("-");
			var cellProperty = arr[1];
			if (arr[0] != 'cell') {return;}
		
			config.cells[this.state.cell][cellProperty] =  event.target.value;
		} else {
			return;
		}

		// Reflect config changes in the state
		console.log('config', config);
		app.updateState({q: window.btoa(JSON.stringify(config || {}))});
	},
	updateField: function(name, value) {
		if (!this.el) {return;}
		var fieldEl = this.el.querySelector('[name="'+name+'"]')
		if (!fieldEl) {return;}
		fieldEl.value = value;
	},
	updateSelect: function(name, optionIndex,  value, label) {
		if (!this.el) {return;}
		var fieldEl = this.el.querySelector('[name="'+name+'"]');
		if (!fieldEl) {return;}
		if (!fieldEl.options[optionIndex]) {fieldEl.appendChild(document.createElement('option'))}
		fieldEl.options[optionIndex].setAttribute('value', value);
		fieldEl.options[optionIndex].innerHTML = label;
		return fieldEl;
	},
	updateCell: function(cellProperties) {
		console.log('updateCell', cellProperties);
		if (!cellProperties || typeof cellProperties != "object") {return;}
		this.updateField("cell-col", cellProperties.col || "");
		this.updateField("cell-text", cellProperties.text || "");
		this.updateField("cell-colSpan", cellProperties.colSpan || "");
		this.updateField("cell-rowSpan", cellProperties.rowSpan || "");
		this.updateField("cell-row", cellProperties.row || "");
		this.updateField("cell-align", cellProperties.align || "");
		this.updateField("cell-justify", cellProperties.justify || "");
	},
	render: function() {
		console.log('render');
		this.updateField('rows',  config.rows.length);
		this.updateField('cols',  config.cols.length);
		this.updateField('cells', config.cells.length);
		
		var selectField, value, cellIndex;


		// Update rows
		for(var i=0;i<config.rows.length; i++) {
			selectField = this.updateSelect('track', i, "row-" + i, 'row ' + (i+1));
		}
		if (selectField && this.state && this.state.row >=0) {
			alert('row' + this.state.row);
			selectField.selectedIndex = 1*this.state.row;
			value = config.rows[1*this.state.row];
		}

		// Update cols
		for(var j=0; j<config.cols.length; j++) {
			selectField = this.updateSelect('track', i+j, "col-" + j, 'col ' + (j+1));
		}
		if (selectField && this.state && this.state.col>=0) {
			alert('col' + this.state.col);
			selectField.selectedIndex = i+1*this.state.col;
			value = config.cols[1*this.state.col];
		}
		
		// Update cells
		for(var k=0; k<config.cells.length; k++) {
			selectField = this.updateSelect('track', i+j+k, "cell-" + k, 'cell ' + (k+1));
		}
		if (selectField && this.state && this.state.cell>=0) {
			alert('cell' + this.state.cell);
			cellIndex = 1*this.state.cell;
			value = config.cells[cellIndex];
			selectField.selectedIndex = i+j-1+cellIndex;
		}
		
		if (selectField) {
			alert(cellIndex);
			if (cellIndex !== undefined) { // Cell
				this.updateCell(config.cells[cellIndex]);
			} else { // Track				
				this.updateField('value', value);
			}
		} else {
			this.el.querySelector('[name="value"]').parentNode.style.display = 'none';
			this.el.querySelector('[name="value"]').parentNode.style.display = 'none';
		}
		//this.updateField('');
	},
};