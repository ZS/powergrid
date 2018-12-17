var alert = {
	type: '',
	message: '',
	onconnected: function (event) {
		this.render();
	},
	onattributechanged: function (e) {
		if (e.oldValue === e.newValue) {
			return;
		}
		if (e.attributeName === 'type') {
			this.type = e.newValue;
			this.render();
		} else if (e.attributeName === 'message') {
			this.message = e.newValue;
			this.render();
		}
	},
	render: function () {
		this.el.innerHTML = '<strong alert-type>' + this.type + '</strong> <span class="message">' + this.message + '</span><button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>';
	}
};

wickedElements.define('.alert', alert);