const url = $request.url || "";
const body = $response.body || "";
const STORE_KEY = "klx_subscription_injection_cache_v1";

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
}

function doneWithRawBody(rawBody) {
  $done({ body: rawBody });
}

function readStore() {
  if (typeof $persistentStore === "undefined") {
    return { latestContentId: "", contents: {} };
  }

  const raw = $persistentStore.read(STORE_KEY);
  const parsed = parseJson(raw || "");
  if (!parsed || typeof parsed !== "object") {
    return { latestContentId: "", contents: {} };
  }

  if (!parsed.contents || typeof parsed.contents !== "object") {
    parsed.contents = {};
  }
  if (typeof parsed.latestContentId !== "string") {
    parsed.latestContentId = "";
  }
  return parsed;
}

function writeStore(store) {
  if (typeof $persistentStore === "undefined") {
    return;
  }
  $persistentStore.write(JSON.stringify(store), STORE_KEY);
}

function setFlag(target, key, value) {
  if (target && typeof target === "object") {
    target[key] = value;
  }
}

function asString(value) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value);
}

function normalizeUrl(value) {
  return typeof value === "string" && value.trim() ? value : "";
}

function firstNonEmptyString(values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    if (typeof value === "number") {
      return String(value);
    }
  }
  return "";
}

function getNestedString(source, keys) {
  if (!source || typeof source !== "object") {
    return "";
  }

  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    if (typeof value === "number") {
      return String(value);
    }
  }
  return "";
}

function getArray(value) {
  return Array.isArray(value) ? value : [];
}

function parseContentIdFromUrl(currentUrl) {
  const contentShowMatch = currentUrl.match(/\/content-show\/(\d+)/);
  if (contentShowMatch) {
    return contentShowMatch[1];
  }

  const articleListMatch = currentUrl.match(/[?&]content_id=(\d+)/);
  if (articleListMatch) {
    return articleListMatch[1];
  }

  return "";
}

function upsertCachedContent(contentId) {
  if (!contentId) {
    return { latestContentId: "", contents: {} };
  }

  const store = readStore();
  if (!store.contents[contentId] || typeof store.contents[contentId] !== "object") {
    store.contents[contentId] = {};
  }

  store.latestContentId = contentId;
  store.contents[contentId].updatedAt = Date.now();
  trimStore(store, contentId);
  return store;
}

function trimStore(store, keepContentId) {
  const entries = Object.entries(store.contents || {});
  if (entries.length <= 6) {
    return;
  }

  entries
    .sort((left, right) => {
      const leftTime =
        left[0] === keepContentId ? Number.MAX_SAFE_INTEGER : Number(left[1].updatedAt || 0);
      const rightTime =
        right[0] === keepContentId ? Number.MAX_SAFE_INTEGER : Number(right[1].updatedAt || 0);
      return rightTime - leftTime;
    })
    .slice(6)
    .forEach(([contentId]) => {
      delete store.contents[contentId];
    });
}

function unlockEpisode(item) {
  if (!item || typeof item !== "object") {
    return;
  }

  const fullUrl =
    normalizeUrl(item.optional_media_key_full_url) ||
    normalizeUrl(item.media_key_full_url);

  setFlag(item, "is_lock", "0");
  setFlag(item, "is_listen", "1");
  setFlag(item, "is_trial", "0");
  setFlag(item, "is_purchased", "1");
  setFlag(item, "is_subscribed", "1");
  setFlag(item, "is_vip_free", "1");
  setFlag(item, "is_vip_only", "0");
  setFlag(item, "is_part_buy", "1");
  setFlag(item, "is_part_charge", "0");
  setFlag(item, "is_receive", "1");
  setFlag(item, "share_free_count", "999");
  setFlag(item, "part_charge_text", "");

  if (fullUrl) {
    setFlag(item, "optional_media_key_full_url", fullUrl);
    setFlag(item, "media_key_full_url", fullUrl);
    setFlag(item, "sample_media_full_url", fullUrl);
  }
}

function normalizeAuthorName(data) {
  return firstNonEmptyString([
    data.author,
    data.author_name,
    getNestedString(data.author_info, ["nickname", "name", "author_name"]),
    getNestedString(data.author, ["nickname", "name", "author_name"]),
    getNestedString(getArray(data.author_list)[0], ["nickname", "name", "author_name"]),
  ]);
}

function normalizeAuthorId(data) {
  return firstNonEmptyString([
    data.author_id,
    getNestedString(data.author_info, ["id", "author_id", "user_id"]),
    getNestedString(data.author, ["id", "author_id", "user_id"]),
    getNestedString(getArray(data.author_list)[0], ["id", "author_id", "user_id"]),
  ]);
}

function normalizeAuthorIds(data, authorId) {
  if (Array.isArray(data.author_ids) && data.author_ids.length) {
    return data.author_ids.map((value) => asString(value)).filter(Boolean);
  }
  return authorId ? [authorId] : [];
}

function normalizeContentCard(data, contentId) {
  const authorId = normalizeAuthorId(data);
  return {
    content_id: asString(contentId || data.content_id || data.id),
    title: firstNonEmptyString([data.title, data.name]),
    subtitle: firstNonEmptyString([data.subtitle, data.sub_title, data.summary]),
    author: normalizeAuthorName(data),
    author_id: authorId,
    author_ids: normalizeAuthorIds(data, authorId),
    small_background_img: firstNonEmptyString([
      data.small_background_img,
      data.small_background_image,
      data.background_img,
      data.cover_url,
      data.cover_img,
      data.image,
    ]),
    media_type: firstNonEmptyString([data.media_type, data.content_type, "audio"]),
    media_type_en: firstNonEmptyString([data.media_type_en, data.media_type, "audio"]),
    type: firstNonEmptyString([data.type, data.content_kind, "0"]),
    update_text: firstNonEmptyString([
      data.update_text,
      data.status_text,
      data.publish_status_text,
      data.content_status_text,
      data.status,
    ]),
    link_url: firstNonEmptyString([data.link_url, data.share_url]),
    promotion_price: firstNonEmptyString([data.promotion_price, data.price_text]),
    article_update_time: firstNonEmptyString([data.article_update_time, data.updated_at]),
    status: firstNonEmptyString([data.status, data.content_status]),
    is_listen: firstNonEmptyString([data.is_listen, "1"]),
    is_purchased: "1",
    is_subscribed: "1",
    is_vip_free: "1",
    is_vip_only: "0",
    vip_type: "svip",
    is_presell: firstNonEmptyString([data.is_presell, "0"]),
    is_top: firstNonEmptyString([data.is_top, "0"]),
  };
}

function normalizeCachedEpisode(item) {
  return {
    article_id: asString(item.article_id || item.id),
    title: firstNonEmptyString([item.title, item.article_title, item.name]),
    is_lock: "0",
    is_listen: "1",
    is_trial: "0",
    is_purchased: "1",
    is_subscribed: "1",
    is_vip_free: "1",
    is_vip_only: "0",
    is_part_buy: "1",
    is_part_charge: "0",
    is_receive: "1",
    share_free_count: "999",
    part_charge_text: "",
    media_key_full_url: normalizeUrl(item.media_key_full_url),
    optional_media_key_full_url: normalizeUrl(item.optional_media_key_full_url),
    sample_media_full_url: normalizeUrl(item.sample_media_full_url),
  };
}

function cacheContentShow(data, contentId) {
  const normalized = normalizeContentCard(data, contentId);
  if (!normalized.content_id || !normalized.title) {
    return;
  }

  const store = upsertCachedContent(normalized.content_id);
  store.contents[normalized.content_id].content = normalized;
  writeStore(store);
}

function cacheArticleList(data, contentId) {
  const normalizedContentId = asString(contentId || data.content_id || data.id);
  if (!normalizedContentId) {
    return;
  }

  const articles = getArray(data.article_list)
    .map((item) => normalizeCachedEpisode(item))
    .filter((item) => item.title || item.article_id)
    .slice(0, 6);

  if (!articles.length) {
    return;
  }

  const store = upsertCachedContent(normalizedContentId);
  store.contents[normalizedContentId].article_list = articles;
  if (store.contents[normalizedContentId].content) {
    store.contents[normalizedContentId].content.part =
      store.contents[normalizedContentId].content.part || articles[0].title || "";
  }
  writeStore(store);
}

function unlockTrialArticles(trialArticles) {
  if (!Array.isArray(trialArticles)) {
    return;
  }
  trialArticles.forEach(unlockEpisode);
}

function handleArticleList(payload) {
  if (!payload || payload.status !== "success" || !payload.data) {
    return payload;
  }

  const data = payload.data;
  if (Array.isArray(data.article_list)) {
    data.article_list.forEach(unlockEpisode);
    const count = String(data.article_list.length);
    setFlag(data, "article_count", data.article_count || count);
    setFlag(data, "count", data.count || count);
    setFlag(data, "exper_num", count);
    setFlag(data, "exper_use_num", count);
    setFlag(data, "max_count", count);
    setFlag(data, "min_count", "1");
    setFlag(data, "next_count", "0");
    setFlag(data, "prev_count", "0");
  }

  cacheArticleList(data, parseContentIdFromUrl(url));
  return payload;
}

function handleContentShow(payload) {
  if (!payload || payload.status !== "success" || !payload.data) {
    return payload;
  }

  const data = payload.data;
  setFlag(data, "is_purchased", "1");
  setFlag(data, "is_subscribed", "1");
  setFlag(data, "is_vip_free", "1");
  setFlag(data, "is_vip_only", "0");
  setFlag(data, "is_can_subscribed", "1");
  setFlag(data, "is_friend_vip", "1");
  setFlag(data, "is_vip_expired", "0");
  setFlag(data, "vip_type", "svip");
  setFlag(data, "old_vip_type", "svip");

  if (Array.isArray(data.catalog)) {
    data.catalog.forEach((catalog) => {
      setFlag(catalog, "is_vip_free", "1");
      setFlag(catalog, "audio_is_show", "1");
    });
  }

  unlockTrialArticles(data.trial_articles);

  if (data.popup && typeof data.popup === "object") {
    setFlag(data.popup, "label_text", "");
    setFlag(data.popup, "link_url", "");
  }

  cacheContentShow(data, parseContentIdFromUrl(url));
  return payload;
}

const payload = parseJson(body);
if (!payload) {
  doneWithRawBody(body);
} else if (/\/api\/v2\/content\/article_list(?:\?|$)/.test(url)) {
  doneWithRawBody(JSON.stringify(handleArticleList(payload)));
} else if (/\/api\/v2\/content\/content-show\//.test(url)) {
  doneWithRawBody(JSON.stringify(handleContentShow(payload)));
} else {
  doneWithRawBody(body);
}
