/*
 * Vistopia / Kanlixiang VIP H5 cleanup for Surge.
 *
 * The native VIP tab opens a WebView at shop.vistopia.com.cn/vip_rights.
 * This script hides the purchase card area, comparison block, and bottom
 * purchase CTA, while preserving the program-benefit module list below it.
 */

const STYLE_ID = "klx-vip-purchase-hide-style";
const RUNTIME_ID = "klx-vip-purchase-hide-runtime";

let body = $response.body || "";
const headers = {};

for (const key of Object.keys($response.headers || {})) {
  if (!/^(content-length|content-security-policy|content-security-policy-report-only)$/i.test(key)) {
    headers[key] = $response.headers[key];
  }
}

if (typeof body !== "string" || !body || !/\/vip_rights(?:\?|#|$)/.test($request.url || "")) {
  $done({ headers, body });
} else {
  const style = `<style id="${STYLE_ID}">
html.klx-vip-purchase-hidden .vip_top_card,
html.klx-vip-purchase-hidden .vip_equity,
html.klx-vip-purchase-hidden .vip_rights_box,
html.klx-vip-purchase-hidden .vip_bottoms,
html.klx-vip-purchase-hidden main.vip-page > section.plans {
  display: none !important;
  height: 0 !important;
  min-height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
  visibility: hidden !important;
}

html.klx-vip-purchase-hidden .home_h5 .module_list_wrap {
  margin-top: var(--klx-vip-fixed-top, 31.55216vw) !important;
  padding-top: 0 !important;
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 18vw) !important;
}

@media screen and (min-width: 500px) {
  html.klx-vip-purchase-hidden .home_h5 .module_list_wrap {
    margin-top: var(--klx-vip-fixed-top, 216px) !important;
    padding-bottom: 72px !important;
  }
}

html.klx-vip-purchase-hidden main.vip-page > section.rights {
  margin-top: 0 !important;
}
</style>`;

  const runtime = `<script id="${RUNTIME_ID}">
(function () {
  var rootClass = "klx-vip-purchase-hidden";
  var hiddenSelector = [
    ".vip_top_card",
    ".vip_equity",
    ".vip_rights_box",
    ".vip_bottoms",
    "main.vip-page > section.plans"
  ].join(",");
  var scheduled = false;
  var observer = null;
  var raf = window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : function (callback) { return window.setTimeout(callback, 16); };

  function isVipRightsPage() {
    return location.pathname.indexOf("/vip_rights") !== -1;
  }

  function setImportant(el, name, value) {
    if (
      el.style.getPropertyValue(name) !== value ||
      el.style.getPropertyPriority(name) !== "important"
    ) {
      el.style.setProperty(name, value, "important");
    }
  }

  function hideElement(el) {
    if (!el) {
      return;
    }
    setImportant(el, "display", "none");
    setImportant(el, "height", "0");
    setImportant(el, "min-height", "0");
    setImportant(el, "margin", "0");
    setImportant(el, "padding", "0");
    setImportant(el, "overflow", "hidden");
    setImportant(el, "visibility", "hidden");
    if (el.getAttribute("data-klx-vip-hidden") !== "1") {
      el.setAttribute("aria-hidden", "true");
      el.setAttribute("data-klx-vip-hidden", "1");
    }
  }

  function programBottomPadding() {
    if (window.innerWidth >= 500) {
      return "72px";
    }
    return "calc(env(safe-area-inset-bottom, 0px) + 18vw)";
  }

  function fixedHeaderBottom() {
    var bottom = 0;
    var nodes = document.querySelectorAll(".top_flag, .fix_box");
    for (var i = 0; i < nodes.length; i += 1) {
      var node = nodes[i];
      if (window.getComputedStyle(node).display === "none") {
        continue;
      }
      var rect = node.getBoundingClientRect();
      if (rect.bottom > bottom) {
        bottom = rect.bottom;
      }
    }
    return Math.max(0, Math.ceil(bottom));
  }

  function placeProgramList() {
    var moduleList = document.querySelector(".module_list_wrap");
    if (!moduleList) {
      return;
    }
    var top = fixedHeaderBottom();
    if (top > 0) {
      var value = top + "px";
      document.documentElement.style.setProperty("--klx-vip-fixed-top", value);
      setImportant(moduleList, "margin-top", value);
    }
    setImportant(moduleList, "padding-top", "0");
    setImportant(moduleList, "padding-bottom", programBottomPadding());
  }

  function apply() {
    if (!isVipRightsPage()) {
      return;
    }
    document.documentElement.classList.add(rootClass);
    var nodes = document.querySelectorAll(hiddenSelector);
    for (var i = 0; i < nodes.length; i += 1) {
      hideElement(nodes[i]);
    }
    placeProgramList();
  }

  function scheduleApply() {
    if (scheduled) {
      return;
    }
    scheduled = true;
    raf(function () {
      scheduled = false;
      apply();
    });
  }

  function startObserver() {
    if (observer || !document.documentElement || !window.MutationObserver) {
      return;
    }
    observer = new MutationObserver(scheduleApply);
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  apply();
  startObserver();
  document.addEventListener("DOMContentLoaded", function () {
    apply();
    startObserver();
  });
  window.addEventListener("load", apply);
  window.addEventListener("resize", apply);

  var tries = 0;
  var timer = setInterval(function () {
    apply();
    tries += 1;
    if (tries >= 80) {
      clearInterval(timer);
    }
  }, 250);
})();
</scr` + `ipt>`;

  if (!body.includes(STYLE_ID)) {
    if (/<\/head>/i.test(body)) {
      body = body.replace(/<\/head>/i, style + runtime + "</head>");
    } else {
      body = style + runtime + body;
    }
  }

  $done({ headers, body });
}
