/**
 * 看理想 - 广告配置清理脚本
 *
 * 覆盖接口：/api/v2/other/config
 * 作用：清除服务端下发的广告字段，保留所有正常功能配置
 *
 * 实测于看理想 v4.11.2 / iOS 26 / 2026-04-19
 *
 * 注：advertisement 和 pop-up 接口已由 [Map Local] 在请求阶段拦截，
 *     本脚本仅处理 config 接口（需要保留响应体其余字段，故不能用 Map Local）
 */

const url = $request.url;
let body = $response.body;

try {
  const data = JSON.parse(body);

  if (/\/api\/v2\/other\/config(\?|$)/.test(url) && data.data) {
    // 清除服务端弹窗
    data.data.dialog = null;
    $done({ body: JSON.stringify(data) });
    return;
  }

} catch (e) {
  // JSON 解析失败，原样放行
}

$done({});
