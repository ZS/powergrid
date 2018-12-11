(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["./state.js", ".powergrid.js"], factory);
	} else if (typeof exports !== "undefined") {
		factory(require("./state.js"), require(".powergrid.js"));
	} else {
		var mod = {
			exports: {}
		};
		factory(global.state, global.powergrid);
		global.bundle = mod.exports;
	}
})(this, function (_state, _powergrid) {
	"use strict";

	$(function () {
		'use strict';
		// Init components

		var $modal = $('.modal');
		$modal.modal('hide');

		$.extend($modal[0], _state.state);
		$modal[0].watchLocation();

		$modal.on('hidden.bs.modal', function () {
			//TODO: change the state back here and sync url.
			this.updateState({ open: "false" });
		});

		$modal.on('statechange', function (e) {
			console.log('statechange', e);
			if (e.detail.changed !== undefined && e.detail.changed.open === undefined) {
				return;
			}

			if (this.state.open && this.state.open != "false") {
				$(this).modal('show');
			} else {
				$(this).modal('hide');
			}
			console.log('modal state changed', e.detail.newState);
		});
		$modal[0].updateUrl();
	});
});
