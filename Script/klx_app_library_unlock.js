const url = $request.url || "";
const body = $response.body || "";

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
}

function done(payload) {
  $done({ body: JSON.stringify(payload) });
}

function doneRaw() {
  $done({ body });
}

function setFlag(target, key, value) {
  if (target && typeof target === "object") {
    target[key] = value;
  }
}

function parseUrlQuery(input) {
  try {
    return new URL(input).searchParams;
  } catch (error) {
    return new Map();
  }
}

function unlockLibraryItem(item) {
  if (!item || typeof item !== "object") {
    return;
  }

  setFlag(item, "is_lock", "0");
  setFlag(item, "is_listen", "1");
  setFlag(item, "is_trial", "0");
  setFlag(item, "is_purchased", "1");
  setFlag(item, "is_subscribed", "1");
  setFlag(item, "is_vip_free", "1");
  setFlag(item, "is_vip_only", "0");
  setFlag(item, "is_receive", "1");
  setFlag(item, "share_free_count", "999");

  if (item.duration_str) {
    setFlag(item, "sample_duration_str", item.duration_str);
  }

  if ("play_url" in item && item.play_url) {
    setFlag(item, "optional_play_url", item.play_url);
  } else if ("optional_play_url" in item && item.optional_play_url) {
    setFlag(item, "play_url", item.optional_play_url);
  }

  if ("voice_enhance_url" in item && !item.voice_enhance_url && item.play_url) {
    setFlag(item, "voice_enhance_url", item.play_url);
  }
}

function mergePlayTokenFields(item, tokenData) {
  if (!item || typeof item !== "object" || !tokenData || typeof tokenData !== "object") {
    return;
  }

  unlockLibraryItem(item);

  if (tokenData.play_token) {
    setFlag(item, "play_token", tokenData.play_token);
  }

  if (tokenData.vid) {
    setFlag(item, "vid", tokenData.vid);
  }

  if (tokenData.duration_str) {
    setFlag(item, "duration_str", tokenData.duration_str);
    setFlag(item, "sample_duration_str", tokenData.duration_str);
  }

  if (tokenData.duration) {
    setFlag(item, "duration", tokenData.duration);
  }

  if (tokenData.play_url) {
    setFlag(item, "play_url", tokenData.play_url);
    setFlag(item, "optional_play_url", tokenData.play_url);
  }
}

function handlePlayList(payload) {
  if (!payload || payload.status !== "success" || !payload.data) {
    return payload;
  }

  const articles = payload.data.articles;
  if (Array.isArray(articles)) {
    articles.forEach(unlockLibraryItem);
  }

  return payload;
}

function handlePlayToken(payload) {
  if (!payload || payload.status !== "success" || !payload.data) {
    return payload;
  }

  const data = payload.data;
  unlockLibraryItem(data);
  return payload;
}

function buildPlayTokenUrl(libraryArticleId, shareUid) {
  const params = [`library_article_id=${encodeURIComponent(libraryArticleId)}`];
  if (shareUid) {
    params.push(`share_uid=${encodeURIComponent(shareUid)}`);
  }
  return `https://api.vistopia.com.cn/api/v2/services/play-token?${params.join("&")}`;
}

function fetchPlayToken(libraryArticleId, shareUid, callback) {
  if (!libraryArticleId) {
    callback(null);
    return;
  }

  $httpClient.get(buildPlayTokenUrl(libraryArticleId, shareUid), (error, response, responseBody) => {
    if (error || !responseBody) {
      callback(null);
      return;
    }

    const payload = parseJson(responseBody);
    if (!payload || payload.status !== "success" || !payload.data) {
      callback(null);
      return;
    }

    callback(payload.data);
  });
}

function handleArticleDetail(payload, callback) {
  if (!payload || payload.status !== "success" || !payload.data) {
    callback(payload);
    return;
  }

  const data = payload.data;
  unlockLibraryItem(data);

  if (data.play_token) {
    callback(payload);
    return;
  }

  const searchParams = parseUrlQuery(url);
  const shareUid = searchParams.get ? searchParams.get("share_uid") : "";
  fetchPlayToken(data.library_article_id, shareUid, (tokenData) => {
    mergePlayTokenFields(data, tokenData);
    callback(payload);
  });
}

const payload = parseJson(body);
if (!payload) {
  doneRaw();
} else if (/\/api\/v2\/library\/play_list(?:\?|$)/.test(url)) {
  done(handlePlayList(payload));
} else if (/\/api\/v2\/library\/article-detail(?:\?|$)/.test(url)) {
  handleArticleDetail(payload, done);
} else if (/\/api\/v2\/services\/play-token\?library_article_id=/.test(url)) {
  done(handlePlayToken(payload));
} else {
  doneRaw();
}
