(function initializeLandingTabs(global) {
  "use strict";

  const DEFAULT_TAB = "accueil";
  const INSTALL_FLOW_KEY = "oenaris-install-flow-confirmed";
  const LEGACY_INSTALL_FLOW_KEY = "oenova-install-flow-confirmed";
  const tabs = [...document.querySelectorAll("[data-site-tab]")];
  const panels = [...document.querySelectorAll("[data-site-panel]")];
  const tabNames = new Set(tabs.map((tab) => tab.dataset.siteTab));

  if (!tabs.length || !panels.length) return;

  function normalizeTab(value) {
    return tabNames.has(value) ? value : DEFAULT_TAB;
  }

  function updateUrl(tabName, mode, replace = false) {
    const url = new URL(global.location.href);
    url.searchParams.set("tab", tabName);
    if (tabName === "compte" && mode) url.searchParams.set("mode", mode);
    else url.searchParams.delete("mode");
    global.history[replace ? "replaceState" : "pushState"]({ tab: tabName }, "", url);
  }

  function setActiveTab(tabName, options = {}) {
    const nextTab = normalizeTab(tabName);
    const activeTab = tabs.find((tab) => tab.dataset.siteTab === nextTab);
    tabs.forEach((tab) => {
      const isActive = tab.dataset.siteTab === nextTab;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });
    panels.forEach((panel) => {
      const isActive = panel.dataset.sitePanel === nextTab;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
    document.body.dataset.activeSiteTab = nextTab;
    document.title = `${activeTab?.textContent.trim() || "Oenaris"} | Oenaris`;

    if (global.matchMedia?.("(max-width: 860px)").matches && activeTab?.parentElement) {
      const nav = activeTab.parentElement;
      const centerActiveTab = () => {
        nav.scrollLeft = activeTab.offsetLeft - (nav.clientWidth - activeTab.clientWidth) / 2;
      };
      centerActiveTab();
      global.requestAnimationFrame(centerActiveTab);
    }

    if (options.updateUrl !== false) updateUrl(nextTab, options.mode, options.replace === true);
    if (options.focus === true) tabs.find((tab) => tab.dataset.siteTab === nextTab)?.focus();
    if (options.scroll !== false) global.scrollTo({ top: 0, behavior: "smooth" });
    return nextTab;
  }

  function isInstalled() {
    return global.matchMedia?.("(display-mode: standalone)").matches || global.navigator.standalone === true;
  }

  function renderInstallState() {
    const message = isInstalled()
      ? "Oenaris est installée sur cet appareil."
      : "Oenaris peut être installée depuis le menu de votre navigateur.";
    document.querySelectorAll("[data-install-state]").forEach((element) => {
      element.textContent = message;
      element.dataset.installed = String(isInstalled());
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      setActiveTab(tab.dataset.siteTab);
    });
    tab.addEventListener("keydown", (event) => {
      let targetIndex = null;
      if (["ArrowRight", "ArrowDown"].includes(event.key)) targetIndex = (index + 1) % tabs.length;
      if (["ArrowLeft", "ArrowUp"].includes(event.key)) targetIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") targetIndex = 0;
      if (event.key === "End") targetIndex = tabs.length - 1;
      if (targetIndex === null) return;
      event.preventDefault();
      setActiveTab(tabs[targetIndex].dataset.siteTab, { focus: true });
    });
  });

  document.querySelectorAll("[data-site-tab-target]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      setActiveTab(link.dataset.siteTabTarget, { mode: link.dataset.landingAuthOpen });
    });
  });

  document.querySelectorAll("[data-continue-to-app]").forEach((link) => {
    link.addEventListener("click", () => {
      sessionStorage.setItem(INSTALL_FLOW_KEY, "true");
    });
  });

  global.addEventListener("popstate", () => {
    setActiveTab(new URLSearchParams(global.location.search).get("tab"), { updateUrl: false, scroll: false });
  });
  global.addEventListener("appinstalled", renderInstallState);

  document.body.classList.add("tabs-ready");
  const params = new URLSearchParams(global.location.search);
  setActiveTab(params.get("tab"), { updateUrl: false, scroll: false });
  renderInstallState();

  global.OenarisLandingTabs = Object.freeze({
    setActiveTab,
    isInstalled,
    INSTALL_FLOW_KEY,
    LEGACY_INSTALL_FLOW_KEY
  });
  global.OenovaLandingTabs = global.OenarisLandingTabs;
})(window);
