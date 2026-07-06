(function registerOenarisServiceWorker(global) {
  "use strict";

  if (!("serviceWorker" in navigator)) return;

  global.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js?v=35")
      .then((registration) => registration.update())
      .catch((error) => {
        global.dispatchEvent(new CustomEvent("oenaris:service-worker-error", { detail: error }));
      });
  });
})(window);
