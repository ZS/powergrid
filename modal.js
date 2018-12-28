//modal component
var pgModal = {
    onconnected: function () {
        window.addEventListener('statechange', this);
        this.addClose();
    },
    onattributechanged: function (event) {
        if (event.attributeName == "isopen" && event.oldValue != event.newValue) {
            this.toggleModal();
        }
    },
    onstatechange: function (e) {

        if (e.detail.newState.dialogOpen) {
            if ((e.detail.newState.dialogOpen) == "true") {
                this.el.setAttribute('isopen', 'true');
            }
            else {
                this.el.setAttribute('isopen', 'false');
            }
        }
    },
    onOpen: function () {
        var openEvent = new CustomEvent('onOpen');
        this.el.dispatchEvent(openEvent);
    },
    onClose: function () {
        var closeEvent = new CustomEvent('onClose');
        this.el.dispatchEvent(closeEvent);
    },

    toggleModal: function () {
        if (""+this.el.getAttribute('isopen') == "true") {
            $(this.el).fadeIn();
            if (app.state.dialogOpen != "true") {
                app.updateState({ dialogOpen: "true" });
            }
            this.onOpen();
        }
        else {
            $(this.el).fadeOut();
            if (app.state.dialogOpen != "false") {
                app.updateState({ dialogOpen: "false" });
            }
            this.onClose();
        }
    },
    addClose: function () {
        var self = this;
        var closeEle = document.createElement('span');
        closeEle.classList.add('close');
        closeEle.innerHTML = "&times";
        var modalHeader = this.el.querySelector('.pg-modal-header');
        modalHeader.appendChild(closeEle);
        modalHeader.addEventListener('click', function () {
            self.el.setAttribute('isopen', 'false');
        });
    }
};
wickedElements.define('.pg-modal', pgModal);
