import {state} from "state.js";
import {powergrid} from "powergrid.js";

$(function() {
	'use strict';
	// Init components
	let $modal = $('.modal');
	$modal.modal('hide');

	$.extend($modal[0], state);	
	$modal[0].watchLocation();


	$modal.on('hidden.bs.modal', function() {
		//TODO: change the state back here and sync url.
		this.updateState({open: "false"});
	});

	$modal.on('statechange', function(e) {
		console.log('statechange', e);
		if (e.detail.changed !== undefined && e.detail.changed.open === undefined) {return;}

		if (this.state.open && this.state.open != "false" ) {
			$(this).modal('show');
		} else {
			$(this).modal('hide');
		}
		console.log('modal state changed', e.detail.newState);
	});
	$modal[0].updateUrl();			

})

