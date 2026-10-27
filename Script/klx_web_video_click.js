// Update only video objects in Nuxt's initial page data before hydration.
(function () {
  if (($request.method || 'GET').toUpperCase() !== 'GET') return $done({});
  const body = $response.body || '';
  if (!body.includes('window.__NUXT__=')) return $done({});
  // The video container identifies direct video page loads before API requests start.
  const article = ($request.url || '').match(/\/article\/(\d+)(?:\?|$)/) || ($request.url || '').match(/[?&]article_id=(\d+)(?:&|$)/);
  if (article && /class="[^"]*\bvideo-article-wrap\b/.test(body)) {
    const key = 'klx.web.video.ids.v1';
    let ids;
    try { ids = JSON.parse($persistentStore.read(key) || '[]'); } catch (_) { ids = []; }
    if (!Array.isArray(ids)) ids = [];
    $persistentStore.write(JSON.stringify(Array.from(new Set(ids.concat(article[1]))).slice(-3000)), key);
  }
  const runtime = `<script id="klx-web-video-state">(function(){
    var seen=new WeakSet();
    function visit(x){
      if(!x||typeof x!=='object'||seen.has(x))return;
      seen.add(x);
      if(x.content_id&&(x.media_type_en==='video'||x.content_media_type_en==='video')){
        x.is_purchased='1';x.is_subscribed='1';x.vip_type='lixiangjia';
        if('is_listen'in x)x.is_listen='1';if('is_lock'in x)x.is_lock='0';
      }
      Object.keys(x).forEach(function(k){visit(x[k]);});
    }
    if(/^\\/(detail|article)(\\/|$)/.test(location.pathname))visit(window.__NUXT__);
    // A catalogue click expresses playback intent. Start the original player
    // once the site's SPA finishes mounting it. Native episode switching stays native.
    document.addEventListener('click',function(e){
      var a=e.target.closest('.page-detail a[href]');
      if(!a)return;
      var match=a.getAttribute('href').match(/\\/article\\/(\\d+)/);
      if(!match)return;
      var expected=match[1],finished=false,observed=new WeakSet();
      function attempt(){
        if(finished||location.pathname!=='/article/'+expected)return;
        var v=document.querySelector('.the-video-article video');
        if(!v)return;
        if(!observed.has(v)){
          observed.add(v);v.addEventListener('loadeddata',attempt,{once:true});
          v.addEventListener('canplay',attempt,{once:true});
        }
        if(v.readyState<2)return;
        var p=v.play();
        if(p&&p.then)p.then(function(){finished=true;observer.disconnect();}).catch(function(){});
      }
      var observer=new MutationObserver(attempt);
      observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
      setTimeout(function(){finished=true;observer.disconnect();},15000);
      attempt();
    },true);
  })();</script>`;
  $done({body:body.replace('</body>',runtime+'</body>')});
})();
