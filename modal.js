//modal component
var pgModal = {
    onconnected: function () {
        console.log('modal conneted');
        this.render();
    },
    onattributechanged: function (event) {
        if (event.attributeName == "isopen") {
            this.toggleModal();
        }
    },
    onOpen: function(){
        var openEvent = new CustomEvent('onOpen');
        this.el.dispatchEvent(openEvent);
    },
    onClose: function(){
        var closeEvent = new CustomEvent('onClose');
        this.el.dispatchEvent(closeEvent);
    },
    render: function () {
        this.addClose();
        this.toggleModal();
    },
    toggleModal: function () {
        if (this.el.getAttribute('isopen') == "true") {
            $(this.el).fadeIn();
            this.onOpen();
        }
        else {
            $(this.el).fadeOut();
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