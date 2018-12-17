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
        $(tabEl).siblings("[tab-id]").removeClass("active");
        $(tabEl).addClass("active");
        $(tabEl.parentElement).siblings("[source-id]").hide();
        $(tabEl.parentElement).siblings("[source-id='" + tabEl.getAttribute("tab-id") + "']").show();
    }
}

wickedElements.define("pg-tabs-container", wickedTabsContainer);