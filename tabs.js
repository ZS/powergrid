var wickedTabsContainer = {
    onclick: function (e) {
        var tab = !e.target.getAttribute("tab-id") ? "" : e.target;

        if (tab) {
            this.toggleTabVisibility(tab);
        }
    },
    onconnected: function () {
        var activeTab = this.el.querySelector("[tab-id].active");

        if (activeTab) {
            this.toggleTabVisibility(activeTab);
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