// Web video compatibility for Surge. Never forwards account tokens or headers.
(function () {
  const url = $request.url || '';
  const method = ($request.method || 'GET').toUpperCase();
  const raw = $response.body || '';
  if (method !== 'GET') return $done({});
  const tokenRequest = /\/api\/v2\/services\/play-token\?/.test(url);
  const listRequest = /\/api\/v[12]\/content\/article_list(?:\?|$)/.test(url);
  const detailRequest = /\/api\/v[12]\/content\/content-show\/\d+(?:\?|$)/.test(url);
  const sectionRequest = /\/api\/v1\/reader\/section-detail(?:\?|$)/.test(url);
  const key = 'klx.web.video.ids.v1';
  const seed = ['736119','937925','939725','941225','943175','946275','948475'];
  function parse(text) { try { return JSON.parse(text); } catch (_) { return null; } }
  function video(item) { return item && (item.media_type_en === 'video' || item.content_media_type_en === 'video'); }
  function unlock(item) {
    item.is_purchased = '1';
    item.is_subscribed = '1';
    item.vip_type = 'lixiangjia';
    if ('is_listen' in item) item.is_listen = '1';
    if ('is_lock' in item) item.is_lock = '0';
  }
  function knownIds() {
    const cached = parse($persistentStore.read(key) || '[]');
    return seed.concat(Array.isArray(cached) ? cached : []);
  }
  if (listRequest || detailRequest || sectionRequest) {
    const payload = parse(raw);
    if (!payload || payload.status !== 'success' || !payload.data) return $done({});
    let changed = false;
    const ids = knownIds();
    if (listRequest && Array.isArray(payload.data.article_list)) {
      payload.data.article_list.forEach(function (item) {
        if (!video(item)) return;
        if (/^\d+$/.test(String(item.article_id))) ids.push(String(item.article_id));
        unlock(item); changed = true;
      });
      if (changed) $persistentStore.write(JSON.stringify(Array.from(new Set(ids)).slice(-3000)), key);
    }
    if (detailRequest && video(payload.data)) { unlock(payload.data); changed = true; }
    if (sectionRequest && video(payload.data)) {
      unlock(payload.data); changed = true;
      (payload.data.part || []).forEach(function (item) {
        if (!video(item)) return;
        unlock(item);
        if (/^\d+$/.test(String(item.article_id))) ids.push(String(item.article_id));
      });
      $persistentStore.write(JSON.stringify(Array.from(new Set(ids)).slice(-3000)), key);
    }
    return $done(changed ? { body: JSON.stringify(payload) } : {});
  }
  if (!tokenRequest) return $done({});
  const match = url.match(/[?&]article_id=(\d+)(?:&|$)/);
  if (!match || /[?&]library_article_id=/.test(url) || !knownIds().includes(match[1])) return $done({});
  // The official public section response includes the original video credential.
  // Request only the article ID; account tokens are not needed.
  $httpClient.get({
    url: 'https://api.vistopia.com.cn/api/v1/reader/section-detail?article_id=' + match[1],
    headers: { Accept: 'application/json' },
    timeout: 12
  }, function (error, response, body) {
    const payload = parse(body);
    const part = payload && payload.data && Array.isArray(payload.data.part) && payload.data.part.find(function (item) {
      return String(item.article_id) === match[1] && video(item);
    });
    if (!error && response && response.status === 200 && payload && payload.status === 'success' &&
        part && part.vid && part.play_token) {
      return $done({ body: JSON.stringify({status:'success',data:{
        is_listen:'1',play_way:'2',play_url:'',optional_play_url:'',
        vid:part.vid,play_token:part.play_token,
        video_urls:(part.media_files || []).filter(function (item) {return video(item);})
      }}) });
    }
    console.log('[klx-web-video] video service unavailable; preserving original response');
    $done({});
  });
})();
