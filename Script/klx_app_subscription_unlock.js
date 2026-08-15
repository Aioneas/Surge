const url = $request.url || "";
const body = $response.body || "";

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

function setIfPresent(target, key, value) {
  if (target && typeof target === "object" && hasOwn(target, key)) {
    target[key] = value;
  }
}

function normalizeUrl(value) {
  return typeof value === "string" && value.trim() ? value : "";
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
