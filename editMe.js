


(function ($) {
	var _defaults  = {
		onchange: function(newValue) {
			console.log('change', newValue);
		}
	}



	/**
	 * Edit anything anywhere
	 * @param {*} options 
	 */
	$.fn.editMe = function(opt) {		
		var options = $.extend(_defaults, opt);
			
		console.log(this);
		return $(this).each(function() {
			var el = this, 
				$el = $(this),
				that = this;

			console.log(that, that);

			$el.on('click', function(e) {
				that.targetClick(e);
			});
		});
		
	}


	function showField() {

	}

	$.fn.isInside = function() {
		if ($(td).parents('.zs-edit-overlay').length) {
			return;
		}
	}

	$.fn.editMe.prototype.targetClick = function(event) {
		console.log(this);
		var target = event.target;
		if (!this.insideField) {

		}
		
	}

}(jQuery));