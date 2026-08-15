/**
 * 看理想 - 隐藏 App WebView 会员购买导流
 *
 * 覆盖页面：
 *   - https://shop.vistopia.com.cn/vip_rights...
 *
 * 作用：
 *   - 隐藏移动端会员页里的套餐卡、权益对比表、购买底栏、活动规则浮层
 *   - 保留顶部用户/会员状态和后续权益内容模块
 *   - 兼容普通 Web 版 /_nuxt 会员页的购买区隐藏
 */

const url = $request.url || "";
let body = $response.body || "";

if (!/https?:\/\/shop\.vistopia\.com\.cn\/vip_rights(?:\?|$)/.test(url) || !body) {
  $done({ body });
} else {
  const css = `
:root {
  --klx-vip-top-gap: 46vw;
}

@media screen and (min-width: 500px) {
  :root {
    --klx-vip-top-gap: 188px;
  }
}

/* App mobile H5: hide subscription/payment promotion surfaces. */
.vip_buy_outer .vip_top_card,
.vip_buy_outer .vip_equity,
.vip_buy_outer .vip_bottoms,
.vip_buy_outer .home_h5 .vip_bottoms,
.vip_buy_outer .home_h5 .vip_bottom,
.vip_buy_outer .home_h5 .bottom_tips,
.vip_buy_outer .home_h5 .gift-block,
.vip_buy_outer .bottom-view,
.home_h5 .vip_bottoms,
.bottom-view,
.vip_buy_outer .float_btn_rule,
.vip_buy_outer .counselling,
.vip_buy_outer .top_flag,
.vip_buy_outer .vip_protocol_box,
.vip_buy_outer .top_buy_btn,
.vip_buy_outer .buy_btn01,
.vip_buy_outer .price_box,
.vip_buy_outer .ori_price_box,
.vip_buy_outer .mask02,
.vip_buy_outer .mask03,
.vip_buy_outer .mask04 {
  display: none !important;
  visibility: hidden !important;
  pointer-events: none !important;
  width: 0 !important;
  height: 0 !important;
  min-height: 0 !important;
  max-height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
}

.vip_buy_outer .home_h5 > .pull_wrapper {
  padding-top: var(--klx-vip-top-gap) !important;
  box-sizing: border-box !important;
}

.vip_buy_outer .home_h5 .module_list_wrap,
.vip_buy_outer .home_h5 .module_list_wrap.hasSafeBottom {
  padding-bottom: max(16px, env(safe-area-inset-bottom)) !important;
}

/* Web/Nuxt fallback. */
.vip-page .plans.section,
.vip-page .plan-list,
.vip-page .plan-detail,
.vip-page .buy-button,
.vip-page .protocol,
.vip-page .rights-comparison {
  display: none !important;
  visibility: hidden !important;
  pointer-events: none !important;
  height: 0 !important;
  min-height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
}

.vip-page .rights {
  padding-bottom: 24px !important;
}
`;

  const js = `
(function () {
  if (!/\\/vip_rights(?:$|[?#])/.test(location.pathname + location.search + location.hash)) {
    return;
  }

  var hiddenSelectors = [
    ".vip_buy_outer .vip_top_card",
    ".vip_buy_outer .vip_equity",
    ".vip_buy_outer .vip_bottoms",
    ".vip_buy_outer .home_h5 .vip_bottoms",
    ".vip_buy_outer .home_h5 .vip_bottom",
    ".vip_buy_outer .home_h5 .bottom_tips",
    ".vip_buy_outer .home_h5 .gift-block",
    ".vip_buy_outer .bottom-view",
    ".home_h5 .vip_bottoms",
    ".bottom-view",
    ".vip_buy_outer .float_btn_rule",
    ".vip_buy_outer .counselling",
    ".vip_buy_outer .top_flag",
    ".vip_buy_outer .vip_protocol_box",
    ".vip_buy_outer .top_buy_btn",
    ".vip_buy_outer .buy_btn01",
    ".vip-page .plans.section",
    ".vip-page .plan-list",
    ".vip-page .plan-detail",
    ".vip-page .buy-button",
    ".vip-page .protocol",
    ".vip-page .rights-comparison"
  ];

  function hideElement(el) {
    if (!el || el.__klxVipHidden) return;
    el.__klxVipHidden = true;
    el.setAttribute("aria-hidden", "true");
    el.style.setProperty("display", "none", "important");
    el.style.setProperty("visibility", "hidden", "important");
    el.style.setProperty("pointer-events", "none", "important");
  }

  function updateSpacing() {
    var root = document.documentElement;
    var fixedHeader = document.querySelector(".vip_buy_outer .home_h5 .fix_box");
    if (fixedHeader) {
      var height = Math.ceil(fixedHeader.getBoundingClientRect().height || fixedHeader.offsetHeight || 0);
      if (height > 0) {
        root.style.setProperty("--klx-vip-top-gap", height + "px");
      }
    }

    var moduleList = document.querySelector(".vip_buy_outer .home_h5 .module_list_wrap");
    if (moduleList) {
      moduleList.style.setProperty("padding-bottom", "max(16px, env(safe-area-inset-bottom))", "important");
    }
  }

  function classText(el) {
    var value = el && el.className;
    return typeof value === "string" ? value : "";
  }

  function isFixedNearBottom(el) {
    var style = window.getComputedStyle(el);
    var rect = el.getBoundingClientRect();
    return /^(fixed|sticky)$/.test(style.position) &&
      rect.bottom >= window.innerHeight - Math.max(120, window.innerHeight * 0.22);
  }

  function hideBottomPurchaseBars() {
    var nodes = document.querySelectorAll(".vip_buy_outer div, .home_h5 div, .vip_buy_outer button, .home_h5 button");
    nodes.forEach(function (el) {
      var text = (el.innerText || el.textContent || "").replace(/\s+/g, "");
      if (!/(加入理想家|赠好友|开通会员|续费|立即购买)/.test(text)) return;

      var target = el;
      for (var i = 0; i < 4 && target.parentElement; i++) {
        var parent = target.parentElement;
        if (isFixedNearBottom(parent) || /(vip_)?bottoms?|bottom-view|gift-block/.test(classText(parent))) {
          target = parent;
        }
      }

      if (isFixedNearBottom(target) || /(vip_)?bottoms?|bottom-view|gift-block|buy_btn/.test(classText(target))) {
        hideElement(target);
      }
    });
  }

  function applyHide() {
    hiddenSelectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(hideElement);
    });
    hideBottomPurchaseBars();
    updateSpacing();
  }

  applyHide();
  window.addEventListener("load", applyHide, { once: true });
  window.addEventListener("resize", updateSpacing);

  var observer = new MutationObserver(applyHide);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
`;

  const styleTag = `<style id="klx-vip-rights-hide">${css}</style>`;
  const scriptTag = `<script id="klx-vip-rights-hide-runtime">${js}</script>`;

  if (!body.includes("klx-vip-rights-hide")) {
    if (/<\/head>/i.test(body)) {
      body = body.replace(/<\/head>/i, `${styleTag}</head>`);
    } else {
      body = `${styleTag}${body}`;
    }
  }

  if (!body.includes("klx-vip-rights-hide-runtime")) {
    if (/<\/body>/i.test(body)) {
      body = body.replace(/<\/body>/i, `${scriptTag}</body>`);
    } else {
      body += scriptTag;
    }
  }

  $done({
    body,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}
