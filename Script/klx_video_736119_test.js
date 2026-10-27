// Isolated test for article 736119. Account tokens and request headers are never forwarded.
const match = ($request.url || "").match(/[?&]article_id=(\d+)(?:&|$)/);
if (!match || match[1] !== "736119") {
  $done({});
} else {
  $httpClient.get({
    url: "https://klx-proxy.pages.dev/proxy/api.vistopia.com.cn/api/v2/services/play-token?article_id=736119",
    headers: { "Accept": "application/json" },
    timeout: 12
  }, (error, response, body) => {
    try {
      const data = JSON.parse(body);
      if (!error && response && response.status === 200 && data.status === "success" &&
          data.data && data.data.vid && data.data.play_token) {
        return $done({ body });
      }
    } catch (_) {}
    $done({});
  });
}
