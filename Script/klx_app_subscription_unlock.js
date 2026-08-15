const url = $request.url || "";
const body = $response.body || "";
const STORE_KEY = "klx_subscription_injection_cache_v1";
const FORCED_CONTENT_IDS = {
  "446": true,
};

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

function hasOwn(target, key) {
  return Object.prototype.hasOwnProperty.call(target, key);
}

function hasAnyKey(target, keys) {
  return keys.some((key) => hasOwn(target, key));
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

function setIfPresent(target, key, value) {
  if (target && typeof target === "object" && hasOwn(target, key)) {
    target[key] = value;
  }
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

function cloneObject(value) {
  return parseJson(JSON.stringify(value || null));
}

function incrementCount(value) {
  if (typeof value === "number") {
    return value + 1;
  }
  if (typeof value === "string" && /^\d+$/.test(value)) {
    return String(Number(value) + 1);
  }
  return value;
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
  setIfPresent(item, "lock_status", "0");
  setIfPresent(item, "can_play", "1");
  setIfPresent(item, "can_listen", "1");

  if (fullUrl) {
    setFlag(item, "optional_media_key_full_url", fullUrl);
    setFlag(item, "media_key_full_url", fullUrl);
    setFlag(item, "sample_media_full_url", fullUrl);
  }
}

function buildFallbackEpisode(content) {
  return {
    article_id: "virtual-" + asString(content.content_id),
    title: firstNonEmptyString([content.part, content.update_text, content.title]),
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
    media_key_full_url: "",
    optional_media_key_full_url: "",
    sample_media_full_url: "",
  };
}

function unlockContent(item) {
  if (!item || typeof item !== "object") {
    return;
  }

  setFlag(item, "is_purchased", "1");
  setFlag(item, "is_subscribed", "1");
  setFlag(item, "is_vip_free", "1");
  setFlag(item, "is_vip_only", "0");
  setFlag(item, "is_can_subscribed", "1");
  setFlag(item, "is_friend_vip", "1");
  setFlag(item, "is_vip_expired", "0");
  setFlag(item, "vip_type", "svip");
  setFlag(item, "old_vip_type", "svip");
  setIfPresent(item, "lock_status", "0");
  setIfPresent(item, "subscribe_status", "1");
  setIfPresent(item, "sub_status", "1");
  setIfPresent(item, "buy_status", "1");
  setIfPresent(item, "can_play", "1");
  setIfPresent(item, "can_listen", "1");
  setIfPresent(item, "audio_is_show", "1");

  if (Array.isArray(item.catalog)) {
    item.catalog.forEach((catalog) => {
      setFlag(catalog, "is_vip_free", "1");
      setFlag(catalog, "audio_is_show", "1");
    });
  }

  if (Array.isArray(item.trial_articles)) {
    item.trial_articles.forEach(unlockEpisode);
  }

  if (Array.isArray(item.article_list)) {
    item.article_list.forEach(unlockEpisode);
  }
}

function looksLikeContent(item) {
  if (!item || typeof item !== "object") {
    return false;
  }

  return hasAnyKey(item, [
    "content_id",
    "is_subscribed",
    "is_purchased",
    "vip_type",
    "old_vip_type",
    "article_count",
    "article_list",
    "audio_is_show",
    "content_type",
    "trial_articles",
    "catalog",
  ]);
}

function looksLikeEpisode(item) {
  if (!item || typeof item !== "object") {
    return false;
  }

  return hasAnyKey(item, [
    "article_id",
    "is_lock",
    "is_listen",
    "is_trial",
    "media_key_full_url",
    "optional_media_key_full_url",
    "sample_media_full_url",
    "is_part_charge",
  ]);
}

function getCachedEntry() {
  const store = readStore();
  const entries = Object.entries(store.contents || {})
    .filter(([contentId, entry]) => {
      return FORCED_CONTENT_IDS[asString(contentId)] && entry && typeof entry === "object";
    })
    .sort((left, right) => Number(right[1].updatedAt || 0) - Number(left[1].updatedAt || 0));
  const matchedEntry = entries[0];
  if (!matchedEntry) {
    return null;
  }

  const entry = matchedEntry[1];
  if (!entry.content) {
    return null;
  }

  return {
    content: cloneObject(entry.content),
    article_list: Array.isArray(entry.article_list)
      ? entry.article_list.map((item) => cloneObject(item)).filter(Boolean)
      : [],
  };
}

function buildSubscriptionsListItem(cached) {
  const content = cached.content || {};
  const articles = cached.article_list.length
    ? cached.article_list
    : [buildFallbackEpisode(content)];
  const latestEpisode = articles[0] || buildFallbackEpisode(content);

  return {
    author: asString(content.author),
    content_id: asString(content.content_id),
    is_listen: "1",
    is_presell: asString(content.is_presell || "0"),
    is_purchased: "1",
    is_subscribed: "1",
    is_top: asString(content.is_top || "0"),
    is_vip_free: "1",
    is_vip_only: "0",
    last_listened_time: "",
    list_type: "injected",
    media_type: firstNonEmptyString([content.media_type, "audio"]),
    media_type_en: firstNonEmptyString([content.media_type_en, content.media_type, "audio"]),
    part: firstNonEmptyString([content.part, latestEpisode.title]),
    presell_time: "",
    small_background_img: asString(content.small_background_img),
    status: asString(content.status),
    subtitle: asString(content.subtitle),
    title: asString(content.title),
    type: firstNonEmptyString([content.type, "0"]),
    update_text: asString(content.update_text),
    vip_type: "svip",
  };
}

function buildSubUpdateListItem(cached) {
  const content = cached.content || {};
  const articles = cached.article_list.length
    ? cached.article_list
    : [buildFallbackEpisode(content)];

  return {
    article_list: articles,
    article_update_time: asString(content.article_update_time),
    author: asString(content.author),
    author_id: asString(content.author_id),
    author_ids: Array.isArray(content.author_ids) ? content.author_ids : [],
    content_id: asString(content.content_id),
    is_listen: "1",
    link_url: asString(content.link_url),
    media_type: firstNonEmptyString([content.media_type, "audio"]),
    media_type_en: firstNonEmptyString([content.media_type_en, content.media_type, "audio"]),
    promotion_price: asString(content.promotion_price),
    small_background_img: asString(content.small_background_img),
    subtitle: asString(content.subtitle),
    title: asString(content.title),
    type: firstNonEmptyString([content.type, "0"]),
    update_text: firstNonEmptyString([content.update_text, "更新"]),
    update_type: "injected",
  };
}

function injectCachedContent(payload) {
  const data = payload && payload.data;
  const list = data && Array.isArray(data.data) ? data.data : null;
  if (!list) {
    return payload;
  }

  const cached = getCachedEntry();
  if (!cached || !cached.content || !cached.content.content_id || !cached.content.title) {
    return payload;
  }

  const targetContentId = asString(cached.content.content_id);
  const alreadyExists = list.some(
    (item) => asString(item && (item.content_id || item.id)) === targetContentId
  );
  if (alreadyExists) {
    return payload;
  }

  const injectedItem = /\/api\/v2\/user\/sub-update-list(?:\?|$)/.test(url)
    ? buildSubUpdateListItem(cached)
    : buildSubscriptionsListItem(cached);

  unlockContent(injectedItem);
  if (Array.isArray(injectedItem.article_list)) {
    injectedItem.article_list.forEach(unlockEpisode);
  }

  list.unshift(injectedItem);

  if (data && hasOwn(data, "total")) {
    data.total = incrementCount(data.total);
  }
  if (data && hasOwn(data, "to")) {
    data.to = incrementCount(data.to);
  }
  return payload;
}

function walkAndUnlock(node, seen) {
  if (!node || typeof node !== "object") {
    return;
  }

  if (seen.has(node)) {
    return;
  }
  seen.add(node);

  if (Array.isArray(node)) {
    node.forEach((item) => walkAndUnlock(item, seen));
    return;
  }

  if (looksLikeContent(node)) {
    unlockContent(node);
  }

  if (looksLikeEpisode(node)) {
    unlockEpisode(node);
  }

  Object.keys(node).forEach((key) => {
    walkAndUnlock(node[key], seen);
  });
}

function handleSubscriptionList(payload) {
  if (!payload || payload.status !== "success" || !payload.data) {
    return payload;
  }

  walkAndUnlock(payload.data, new WeakSet());
  injectCachedContent(payload);
  return payload;
}

const payload = parseJson(body);
if (!payload) {
  doneWithRawBody(body);
} else if (
  /\/api\/v2\/user\/(sub-update-list|subscriptions-list)(?:\?|$)/.test(url)
) {
  doneWithRawBody(JSON.stringify(handleSubscriptionList(payload)));
} else {
  doneWithRawBody(body);
}
