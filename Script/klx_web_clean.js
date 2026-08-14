const STYLE_ID = "klx-web-clean-style";
const RUNTIME_ID = "klx-web-full-audio-runtime";

const FULL_AUDIO_RUNTIME = String.raw`
(() => {
  if (window.__KLX_WEB_FULL_AUDIO__) {
    return;
  }
  window.__KLX_WEB_FULL_AUDIO__ = true;

  const metaCache = Object.create(null);
  const routePattern = {
    article: /^\/article\/(\d+)/,
  };

  let bar = null;
  let titleEl = null;
  let audio = null;
  let currentArticleId = "";
  let currentTitle = "";

  function normalizeUrl(url) {
    return String(url || "").trim().replace(/^http:\/\//i, "https://");
  }

  function currentRouteKind() {
    if (routePattern.article.test(location.pathname || "")) {
      return "article";
    }
    if (/^\/detail\/\d+/.test(location.pathname || "")) {
      return "detail";
    }
    return "other";
  }

  function getCurrentArticleId() {
    const routeMatch = (location.pathname || "").match(routePattern.article);
    if (routeMatch) {
      return routeMatch[1];
    }
    const nuxt = window.__NUXT__ || {};
    const pageData = (nuxt.data || [])[0] || {};
    const pageArticleId =
      pageData.article_id ||
      (pageData.ad_mini && pageData.ad_mini.article_id) ||
      (pageData.ad &&
        Array.isArray(pageData.ad.part) &&
        pageData.ad.part[0] &&
        pageData.ad.part[0].article_id);
    return pageArticleId ? String(pageArticleId) : "";
  }

  function pickLocalArticle(articleId) {
    const nuxt = window.__NUXT__ || {};
    const pageData = (nuxt.data || [])[0] || {};
    const matches = [];

    function push(item) {
      if (item && String(item.article_id || "") === String(articleId)) {
        matches.push(item);
      }
    }

    function scanCatalogue(node) {
      if (!node || typeof node !== "object") {
        return;
      }
      if (Array.isArray(node.article_list)) {
        node.article_list.forEach(push);
      }
      if (Array.isArray(node.catalogue)) {
        node.catalogue.forEach((group) => {
          if (group && Array.isArray(group.article_list)) {
            group.article_list.forEach(push);
          }
        });
      }
    }

    scanCatalogue(pageData.catalogue_list);
    push(pageData.ad_mini);
    if (pageData.ad && Array.isArray(pageData.ad.part)) {
      pageData.ad.part.forEach(push);
    }
    if (String(pageData.article_id || "") === String(articleId)) {
      push(pageData);
    }

    for (const item of matches) {
      const fullUrl = normalizeUrl(
        item.optional_media_key_full_url || item.media_key_full_url || item.share_url
      );
      if (!fullUrl) {
        continue;
      }
      return {
        articleId: String(articleId),
        title: item.title || document.title || "完整音频",
        duration: item.duration_str || "",
        fullUrl,
      };
    }

    return null;
  }

  function fetchSectionDetailSync(articleId) {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        "https://api.vistopia.com.cn/api/v2/reader/section-detail?article_id=" +
          encodeURIComponent(articleId),
        false
      );
      xhr.send(null);
      if (xhr.status < 200 || xhr.status >= 300 || !xhr.responseText) {
        return null;
      }
      const payload = JSON.parse(xhr.responseText);
      const item = payload && payload.data && payload.data.part && payload.data.part[0];
      if (!item) {
        return null;
      }
      const fullUrl = normalizeUrl(
        item.optional_media_key_full_url || item.media_key_full_url || item.share_url
      );
      if (!fullUrl) {
        return null;
      }
      return {
        articleId: String(articleId),
        title: item.title || document.title || "完整音频",
        duration: item.duration_str || "",
        fullUrl,
      };
    } catch (error) {
      return null;
    }
  }

  function resolveArticleMeta(articleId) {
    const key = String(articleId || "");
    if (!key) {
      return null;
    }
    if (metaCache[key]) {
      return metaCache[key];
    }

    const routeKind = currentRouteKind();
    const meta =
      (routeKind === "article"
        ? fetchSectionDetailSync(key) || pickLocalArticle(key)
        : pickLocalArticle(key) || fetchSectionDetailSync(key)) || null;

    if (meta) {
      metaCache[key] = meta;
    }
    return meta;
  }

  function ensureUi() {
    if (bar) {
      return;
    }

    const style = document.createElement("style");
    style.id = "klx-web-full-audio-style";
    style.textContent = [
      "#klx-web-full-audio-bar{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483647;background:rgba(17,22,30,.96);color:#fff;border-radius:16px;box-shadow:0 16px 48px rgba(0,0,0,.28);padding:12px 14px 10px;backdrop-filter:blur(12px);}",
      "#klx-web-full-audio-bar[hidden]{display:none!important;}",
      "#klx-web-full-audio-bar .klx-web-full-audio-top{display:flex;align-items:center;gap:10px;margin-bottom:8px;}",
      "#klx-web-full-audio-bar .klx-web-full-audio-badge{flex:0 0 auto;font-size:12px;line-height:1;padding:6px 8px;border-radius:999px;background:rgba(255,255,255,.14);color:#f5d7a1;}",
      "#klx-web-full-audio-bar .klx-web-full-audio-title{flex:1 1 auto;min-width:0;font-size:14px;line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}",
      "#klx-web-full-audio-bar .klx-web-full-audio-close{flex:0 0 auto;border:0;background:transparent;color:rgba(255,255,255,.82);font-size:13px;cursor:pointer;padding:0;}",
      "#klx-web-full-audio-bar audio{display:block;width:100%;height:42px;}",
      "#mediaPlayer.mobile-article-player{display:none!important;}",
      "@media (max-width: 640px){#klx-web-full-audio-bar{left:12px;right:12px;bottom:12px;padding-bottom:calc(10px + env(safe-area-inset-bottom));}}",
    ].join("");
    document.head.appendChild(style);

    bar = document.createElement("div");
    bar.id = "klx-web-full-audio-bar";
    bar.hidden = true;
    bar.innerHTML = [
      '<div class="klx-web-full-audio-top">',
      '<div class="klx-web-full-audio-badge">完整音频</div>',
      '<div class="klx-web-full-audio-title">等待播放</div>',
      '<button type="button" class="klx-web-full-audio-close">收起</button>',
      "</div>",
      '<audio controls preload="metadata" playsinline></audio>',
    ].join("");
    document.body.appendChild(bar);

    titleEl = bar.querySelector(".klx-web-full-audio-title");
    audio = bar.querySelector("audio");

    const closeBtn = bar.querySelector(".klx-web-full-audio-close");
    closeBtn.addEventListener("click", () => {
      audio.pause();
      bar.hidden = true;
      syncUi();
    });

    ["play", "pause", "loadedmetadata", "ended"].forEach((eventName) => {
      audio.addEventListener(eventName, syncUi);
    });
  }

  function updateTitle(durationText) {
    if (!titleEl) {
      return;
    }
    const suffix = durationText ? " · " + durationText : "";
    titleEl.textContent = (currentTitle || "完整音频") + suffix;
    titleEl.title = currentTitle || "完整音频";
  }

  function syncDetailIcons() {
    if (!document.querySelector(".li_item")) {
      return;
    }
    document.querySelectorAll('.li_item a[href*="/article/"]').forEach((anchor) => {
      const match = (anchor.getAttribute("href") || "").match(/\/article\/(\d+)/);
      const articleId = match ? match[1] : "";
      const iconWrap = anchor.querySelector(".icon_wrap");
      anchor.querySelectorAll(".lock").forEach((lockEl) => {
        lockEl.style.display = "none";
      });
      anchor.querySelectorAll(".islock").forEach((node) => {
        node.classList.remove("islock");
      });
      if (!iconWrap) {
        return;
      }
      iconWrap.style.display = "";
      const playEl = iconWrap.querySelector(".play");
      const playingEl = iconWrap.querySelector(".playing");
      const active =
        articleId &&
        articleId === currentArticleId &&
        audio &&
        !audio.paused &&
        !audio.ended;
      if (playEl) {
        playEl.style.display = active ? "none" : "";
      }
      if (playingEl) {
        playingEl.style.display = active ? "" : "none";
      }
    });
  }

  function syncArticleButtons() {
    const active =
      currentArticleId &&
      currentArticleId === getCurrentArticleId() &&
      audio &&
      !audio.paused &&
      !audio.ended;
    document
      .querySelectorAll(".player_info_wrap.islock, .infoplayer-item.islock")
      .forEach((node) => {
        node.classList.remove("islock");
      });
    document
      .querySelectorAll(".player_info_wrap .lock, .infoplayer-item .lock")
      .forEach((lockEl) => {
        lockEl.style.display = "none";
      });
    document.querySelectorAll(".tocPlay, .mobile-main-play").forEach((node) => {
      node.style.display = active ? "none" : "";
    });
    document.querySelectorAll(".tocPlaying, .mobile-main-pause").forEach((node) => {
      node.style.display = active ? "" : "none";
    });
  }

  function syncUi() {
    if (!audio || !bar) {
      return;
    }
    if (!audio.src) {
      bar.hidden = true;
    } else if (audio.ended) {
      currentArticleId = "";
    }
    syncDetailIcons();
    syncArticleButtons();
  }

  function currentSource() {
    return normalizeUrl((audio && (audio.currentSrc || audio.src)) || "");
  }

  function setSource(meta) {
    ensureUi();
    if (!meta || !meta.fullUrl) {
      return false;
    }
    currentArticleId = meta.articleId;
    currentTitle = meta.title || currentTitle;
    updateTitle(meta.duration);
    bar.hidden = false;
    if (currentSource() !== meta.fullUrl) {
      audio.pause();
      audio.src = meta.fullUrl;
      audio.load();
    }
    return true;
  }

  function shouldHandleClick(target) {
    if (!target || !target.closest) {
      return false;
    }
    return !!target.closest(
      ".icon_wrap, .lock, .tocPlay, .tocPlaying, .mobile-main-play, .mobile-main-pause, .player_info_wrap .infoplayer-item"
    );
  }

  function extractArticleId(target) {
    const anchor = target && target.closest && target.closest('a[href*="/article/"]');
    if (anchor) {
      const match = (anchor.getAttribute("href") || "").match(/\/article\/(\d+)/);
      if (match) {
        return match[1];
      }
    }
    return getCurrentArticleId();
  }

  function togglePlayback(meta) {
    const sameTrack =
      currentArticleId === meta.articleId && currentSource() === normalizeUrl(meta.fullUrl);

    if (!sameTrack) {
      if (!setSource(meta)) {
        return;
      }
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          updateTitle(meta.duration);
          syncUi();
        });
      }
      syncUi();
      return;
    }

    if (audio.paused || audio.ended) {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          updateTitle(meta.duration);
          syncUi();
        });
      }
    } else {
      audio.pause();
    }
    syncUi();
  }

  function handleClick(event) {
    const target = event.target;
    if (!shouldHandleClick(target)) {
      return;
    }
    const articleId = extractArticleId(target);
    const meta = resolveArticleMeta(articleId);
    if (!meta || !meta.fullUrl) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    togglePlayback(meta);
  }

  function refreshUiLater() {
    window.setTimeout(syncUi, 120);
  }

  document.addEventListener("click", handleClick, true);
  window.addEventListener("popstate", refreshUiLater);

  const originalPushState = history.pushState;
  history.pushState = function pushStatePatched() {
    const output = originalPushState.apply(this, arguments);
    refreshUiLater();
    return output;
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function replaceStatePatched() {
    const output = originalReplaceState.apply(this, arguments);
    refreshUiLater();
    return output;
  };

  const observer = new MutationObserver(() => {
    syncUi();
  });

  function startObserver() {
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startObserver, { once: true });
  } else {
    startObserver();
  }

  ensureUi();
  syncUi();
})();
`;

function injectStyle(body, css) {
  if (!body || body.includes(STYLE_ID)) {
    return body;
  }
  const style = `<style id="${STYLE_ID}">${css}</style>`;
  return body.replace(/<\/head>/i, `${style}</head>`);
}

function injectRuntime(body) {
  if (!body || body.includes(RUNTIME_ID)) {
    return body;
  }
  const script = `<script id="${RUNTIME_ID}">${FULL_AUDIO_RUNTIME}</script>`;
  return body.replace(/<\/body>/i, `${script}</body>`);
}

function patchHome(body) {
  console.log("[klx-web-clean] patch home");
  body = body.replace(
    /<button type="button" class="nav-link pointer"[^>]*>\s*下载App[\s\S]*?<\/button>\s*<\/nav>/,
    "</nav>"
  );
  body = body.replace(/<div class="swipe_wrap"[\s\S]*?(?=<div class="tabs_wrap")/, "");
  body = body.replace(/banner_data:\[[\s\S]*?\]/, "banner_data:[]");
  body = injectStyle(
    body,
    [
      ".page-home .swipe_wrap{display:none!important;}",
      ".main-nav .nav-link:last-child{display:none!important;}",
      ".download-panel{display:none!important;}",
      "#share{display:none!important;}",
    ].join("")
  );
  return injectRuntime(body);
}

function patchDetail(body) {
  console.log("[klx-web-clean] patch detail");
  body = injectStyle(
    body,
    [
      ".page-detail .price-btn{display:none!important;}",
      ".page-detail .vip-only-button{display:none!important;}",
      ".page-detail .modal.mask{display:none!important;}",
      ".page-detail .modal.mask1{display:none!important;}",
      "#share{display:none!important;}",
      ".part-charge-upgrade-tip{display:none!important;}",
      ".part-charge-upgrade-confirm-dialog{display:none!important;}",
      '.page-detail .li_item a[href*="/article/"] .lock{display:none!important;}',
      '.page-detail .li_item a[href*="/article/"] .icon_wrap{display:block!important;}',
    ].join("")
  );

  body = body.replace(
    'popup:{label_text:"会员免费，点击了解\\u003E\\u003E",link_url:"vistopia:\\u002F\\u002Fbuy-list?type=lixiangjia_trial_entity_&tm=&spm=content",location:c}',
    "popup:{label_text:b,link_url:b,location:b}"
  );
  body = body.replace(/is_listen:a,is_lock:c/g, "is_listen:c,is_lock:a");
  body = body.replace(
    /video_poster:b,is_purchased:a,is_subscribed:a,vip_type:b,is_limited_free:a/g,
    "video_poster:b,is_purchased:c,is_subscribed:c,vip_type:l,is_limited_free:c"
  );
  body = body.replace(/userInfo:\{vip_type:b,is_new_register/g, "userInfo:{vip_type:l,is_new_register");
  body = body.replace(/is_purchased:a/g, "is_purchased:c");
  body = body.replace(/is_subscribed:a/g, "is_subscribed:c");
  body = body.replace(/is_lock:c/g, "is_lock:a");
  return injectRuntime(body);
}

function patchArticlePage(body) {
  console.log("[klx-web-clean] patch article page");
  body = injectStyle(
    body,
    [
      ".page-article .price-btn{display:none!important;}",
      ".page-article .vip-only-button{display:none!important;}",
      ".page-article .modal.mask{display:none!important;}",
      ".page-article .modal.mask1{display:none!important;}",
      ".part-charge-upgrade-tip{display:none!important;}",
      ".part-charge-upgrade-confirm-dialog{display:none!important;}",
      "#share{display:none!important;}",
      ".page-article .player_info_wrap.islock,.page-article .infoplayer-item.islock{background-image:none!important;}",
      ".page-article .player_info_wrap .lock,.page-article .infoplayer-item .lock{display:none!important;}",
    ].join("")
  );
  body = body.replace(/D\.is_lock=c;/g, "D.is_lock=a;");
  return injectRuntime(body);
}

function patchArticleContent(body) {
  console.log("[klx-web-clean] patch article api");
  body = injectStyle(
    body,
    [
      ".part-charge-upgrade-tip{display:none!important;}",
      ".part-charge-upgrade-confirm-dialog{display:none!important;}",
    ].join("")
  );
  body = body.replace(/"part_charge_upgrade_data":\{"show":1/g, '"part_charge_upgrade_data":{"show":0');
  body = body.replace(/var part_charge_upgrade_data = \{"show":1/g, 'var part_charge_upgrade_data = {"show":0');
  body = body.replace(/var is_sample = true;/g, "var is_sample = false;");
  return body;
}

const url = $request.url;
let body = $response.body || "";

if (!body) {
  $done({});
}

if (/^https?:\/\/(www\.)?vistopia\.com\.cn\/(?:\?|$)/.test(url)) {
  body = patchHome(body);
} else if (/^https?:\/\/(www\.)?vistopia\.com\.cn\/detail\/\d+(?:\?|$)/.test(url)) {
  body = patchDetail(body);
} else if (/^https?:\/\/(www\.)?vistopia\.com\.cn\/article\/\d+(?:\?|$)/.test(url)) {
  body = patchArticlePage(body);
} else if (/^https?:\/\/api\.vistopia\.com\.cn\/api\/v1\/web\/article-content\/[A-Za-z0-9]+(?:\?|$)/.test(url)) {
  body = patchArticleContent(body);
}

$done({ body });
