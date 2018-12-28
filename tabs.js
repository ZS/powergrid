var wickedTabsContainer = {
    onclick: function (e) {
        var tab = !e.target.getAttribute("tab-id") ? "" : e.target;

        if (tab) {
            this.toggleTabVisibility(tab);
            this.updateUrlHash(tab.getAttribute("tab-id"));
        }
    },
    onstatechange: function (e) {
        var activeTab = (e.detail.newState.activeTab && e.detail.newState.activeTab.length) > 0 ? e.detail.newState.activeTab : null;
        if (activeTab) {
            var activeEl = this.el.querySelector("[tab-id='" + activeTab + "']");
            if (activeEl) {

                this.toggleTabVisibility(activeEl);

                // If current tab not visible, make parent tab visible first.
                if (!activeEl.offsetHeight && !activeEl.offsetWidth) {
                    var parent, el = activeEl;
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
    updateUrlHash: function (activeTab) {
        if (activeTab && app) {
            app.updateState({ activeTab: activeTab });
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