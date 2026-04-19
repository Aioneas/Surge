/**
 * 看理想 - 开屏/广告配置清理脚本
 *
 * 覆盖接口：
 *   - /api/v2/home/advertisement
 *   - /api/v2/other/config
 *
 * 作用：
 *   - 清空开屏推荐广告 data[]
 *   - 清除 config 中 advertisements[] / dialog
 *   - 保留其余正常功能配置字段
 *
 * 实测于看理想 v4.11.2 / iOS 26 / 2026-04-19
 */

const url = $request.url;
let body = $response.body;

try {
  const data = JSON.parse(body);

  if (/\/api\/v2\/home\/advertisement(\?|$)/.test(url)) {
    data.status = data.status || 'success';
    data.data = [];
    $done({ body: JSON.stringify(data) });
    return;
  }

  if (/\/api\/v2\/other\/config(\?|$)/.test(url) && data.data) {
    data.data.dialog = null;
    if (Array.isArray(data.data.advertisements)) {
      data.data.advertisements = [];
    }
    $done({ body: JSON.stringify(data) });
    return;
  }

} catch (e) {
  // JSON 解析失败，原样放行
}

$done({});
