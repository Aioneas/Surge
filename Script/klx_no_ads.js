/**
 * 看理想 - 去广告脚本
 * 处理接口：
 *   1. /api/v2/home/advertisement         → 返回空数组，不弹开屏内容推荐
 *   2. /api/v2/other/config               → 清除 advertisements / dialog 字段，保留其他配置
 *   3. /api/v2/other/pop-up               → 返回空结构，不弹弹窗
 *
 * 实测于看理想 v4.11.2 / iOS 26
 */

const url = $request.url;
let body = $response.body;

try {
  const data = JSON.parse(body);

  // ── 1. 开屏内容推荐（Banner 广告）────────────────────────────
  if (/\/api\/v2\/home\/advertisement(\?|$)/.test(url)) {
    data.data = [];
    $done({ body: JSON.stringify(data) });
    return;
  }

  // ── 2. 全局配置接口 - 清除广告字段 ───────────────────────────
  if (/\/api\/v2\/other\/config(\?|$)/.test(url)) {
    if (data.data) {
      // 清除开屏广告图片列表
      data.data.advertisements = [];
      // 清除弹窗
      data.data.dialog = null;
    }
    $done({ body: JSON.stringify(data) });
    return;
  }

  // ── 3. 弹窗广告（兜底，URL Rewrite reject-200 优先命中）──────
  if (/\/api\/v2\/other\/pop-up(\?|$)/.test(url)) {
    data.data = {
      id: "0", pop_up_image: "", number: " ", image: "",
      background_image: "", black_background_image: "",
      mark_image: "", title: "", receive_date: "",
      desc: [], btn_text: "", btn_url: ""
    };
    $done({ body: JSON.stringify(data) });
    return;
  }

} catch (e) {
  // JSON 解析失败，原样放行
}

$done({});
