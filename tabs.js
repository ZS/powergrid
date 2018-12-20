var wickedTabsContainer = {
    onclick: function (e) {
        var tab = !e.target.getAttribute("tab-id") ? "" : e.target;

        if (tab) {
            this.toggleTabVisibility(tab);
            this.updateUrlHash(tab.getAttribute("tab-id"));
        }
    },
    onstatechange: function (e) {
        var hash = e.detail.newState.hash.length > 0 ? e.detail.newState.hash.split("#")[1] : null;
        if (hash) {
            var hashEl = this.el.querySelector("[tab-id='" + hash + "']");
            if (hashEl) {

                this.toggleTabVisibility(hashEl);

                // If current tab not visible, make parent tab visible first.
                if (!hashEl.offsetHeight && !hashEl.offsetWidth) {
                    var parent, el = hashEl;
                    while (el) {
                        parent = el.parentElement;
                        if (parent && parent.getAttribute("source-id")) {
                            break;
                        }
                        el = parent;
                    }

                    if (parent) {
                        var parentTab = parent.parentElement.querySelector("[tab-id='" + parent.getAttribute("source-id") + "'");
                        if (parentTab) {
                            //parentTab.dispatchEvent(new CustomEvent("click",{bubbles:true}));
                            this.toggleTabVisibility(parentTab);
                        }
                    }
                }
                //setTimeout(function () { hashEl.dispatchEvent(new CustomEvent("click",{bubbles:false})); }, 100);
            }
        }
    },
    onconnected: function () {
        var activeTab = this.el.querySelector("[tab-id].active");

        if (activeTab) {
            this.toggleTabVisibility(activeTab);
        }

        window.addEventListener('statechange', this);
    },
    updateUrlHash: function (hash) {
        if (hash && app) {
            app.updateState({ hash: "#" + hash });
        }
    },
    toggleTabVisibility: function (tabEl) {
        var tabSiblings = tabEl.parentNode.querySelectorAll("[tab-id]");
        var tabContentContainer = tabEl.parentNode.parentNode.firstElementChild;

        for (var i = 0; i < tabSiblings.length; i++) {
            tabSiblings[i].classList.remove("active");
        }

        tabEl.classList.add("active");

        while (tabContentContainer != null) {
            if (tabContentContainer.getAttribute("source-id") && (tabContentContainer.getAttribute("source-id") != tabEl.getAttribute("tab-id"))) {
                tabContentContainer.style.display = "none";
            } else if (tabContentContainer.getAttribute("source-id") && (tabContentContainer.getAttribute("source-id") == tabEl.getAttribute("tab-id"))) {
                tabContentContainer.style.display = "block";
            }
            tabContentContainer = tabContentContainer.nextElementSibling;
        }
    }
}

wickedElements.define("pg-tabs-container", wickedTabsContainer);