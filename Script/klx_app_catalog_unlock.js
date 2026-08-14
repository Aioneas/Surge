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

function setFlag(target, key, value) {
  if (target && typeof target === "object") {
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

  if (fullUrl) {
    setFlag(item, "optional_media_key_full_url", fullUrl);
    setFlag(item, "media_key_full_url", fullUrl);
    setFlag(item, "sample_media_full_url", fullUrl);
  }
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
