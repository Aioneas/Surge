const url = $request.url || "";
const body = $response.body || "";

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
}

function setFlag(target, key, value) {
  if (target && typeof target === "object") {
    target[key] = value;
  }
}

function unlockContent(target) {
  if (!target || typeof target !== "object") {
    return;
  }

  setFlag(target, "is_purchased", "1");
  setFlag(target, "is_subscribed", "1");
  setFlag(target, "is_vip_free", "1");
  setFlag(target, "is_vip_only", "0");
  setFlag(target, "is_friend_vip", "1");
  setFlag(target, "is_vip_expired", "0");
  setFlag(target, "vip_type", "svip");
  setFlag(target, "old_vip_type", "svip");
}

function handleArticlesPlayToken(payload) {
  if (!payload || payload.status !== "success" || !Array.isArray(payload.data)) {
    return payload;
  }

  payload.data.forEach((item) => {
    if (!item || typeof item !== "object") {
      return;
    }
    unlockContent(item);
    if (item.play_url && !item.optional_play_url) {
      setFlag(item, "optional_play_url", item.play_url);
    }
  });

  return payload;
}

function handleContentBatch(payload) {
  if (!payload || payload.status !== "success" || !Array.isArray(payload.data)) {
    return payload;
  }

  payload.data.forEach(unlockContent);
  return payload;
}

const payload = parseJson(body);
if (!payload) {
  $done({ body });
} else if (/\/api\/v2\/services\/articles-play-token(?:\?|$)/.test(url)) {
  $done({ body: JSON.stringify(handleArticlesPlayToken(payload)) });
} else if (/\/api\/v2\/content\/batch(?:\?|$)/.test(url)) {
  $done({ body: JSON.stringify(handleContentBatch(payload)) });
} else {
  $done({ body });
}
