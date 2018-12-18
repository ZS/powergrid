var gridEditor = {
	state: null,
	init: function(event) {
		this.el = event.target;
	},
	onconnected: function() {
		window.addEventListener('statechange', this);
	},
	onstatechange: function(event) {
		console.log('statechange', event);
		this.state = event.detail.newState;
		this.render();
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
			app.updateState(changes);
		}
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
		if (!cellProperties || typeof cellProperties != "object") {return;}
		this.updateField("cell-text", cellProperties.text || "");
		this.updateField("cell-colSpan", cellProperties.colSpan || "");
		return;
		this.updateSelect("cell-rowSpan", cellProperties.rowSpan || "");
		this.updateSelect("cell-col", cellProperties.col || "");
		this.updateSelect("cell-row", cellProperties.row || "");
		this.updateSelect("cell-col", cellProperties.col || "");
		this.updateSelect("cell-col", cellProperties.col || "");
	},
	render: function() {
		this.updateField('rows',  config.rows.length);
		this.updateField('cols',  config.cols.length);
		this.updateField('cells', config.cells.length);
		
		var selectField, value, cellIndex;


		// Update rows
		for(var i=0;i<config.rows.length; i++) {
			selectField = this.updateSelect('track', i, "row-" + i, 'row ' + (i+1));
		}
		if (selectField && this.state && this.state.row >=0) {
			selectField.selectedIndex[1*this.state.row];
			value = config.rows[1*this.state.rows];
		}

		// Update cols
		for(var j=0; j<config.cols.length; j++) {
			selectField = this.updateSelect('track', i+j, "col-" + j, 'col ' + (j+1));
		}
		if (selectField && this.state && this.state.col>=0) {
			selectField.selectedIndex[i-1*this.state.col];
			value = config.cols[1*this.state.col];
		}
		
		// Update cells
		for(var k=0; k<config.cells.length; k++) {
			selectField = this.updateSelect('track', i+j+k, "cell-" + k, 'cell ' + (k+1));
		}
		if (selectField && this.state && this.state.cell>=0) {
			cellIndex = 1*this.state.cell;
			value = config.cells[cellIndex];
			selectField.selectedIndex[i+j-1+cellIndex];
		}

		if (selectField) {
			if (cellIndex !== undefined) { // Cell
				this.updateCell(config.cells[k]);
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