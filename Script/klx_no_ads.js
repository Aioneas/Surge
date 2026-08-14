/**
 * 看理想 - 广告/推广清理脚本
 *
 * 覆盖接口：
 *   - /api/v2/home/advertisement
 *   - /api/v2/home/header-new
 *   - /api/v2/other/config
 *
 * 作用：
 *   - 清空开屏推荐广告 data[]
 *   - 从首页信息流移除商品广告卡片、新人会员推广及商品轮播
 *   - 清除 config 中 advertisements[] / dialog
 *   - 保留首页内容推荐和其余正常功能配置字段
 *
 * 实测于看理想 v4.14.5 / macOS（iPad 兼容版）/ 2026-08-14
 */

const url = $request.url;
const body = $response.body;

const isPromotionLink = (link) =>
  typeof link === 'string' &&
  (/^vistopia:\/\/(?:goods|buy)(?:\?|$)/.test(link) ||
    /(?:^|\/\/)shop\.vistopia\.com\.cn\//.test(link));

try {
  const data = JSON.parse(body);

  if (/\/api\/v2\/home\/advertisement(\?|$)/.test(url)) {
    data.status = data.status || 'success';
    data.data = [];
    $done({ body: JSON.stringify(data) });
    return;
  }

  if (/\/api\/v2\/home\/header-new(\?|$)/.test(url) && Array.isArray(data.data)) {
    data.data = data.data
      .filter((section) => {
        if (!section || typeof section !== 'object') return true;
        if (section.type === 'new_trial') return false;
        if (section.type !== 'card_image') return true;

        const items = Array.isArray(section.data) ? section.data : [];
        return !items.some((item) => isPromotionLink(item && item.link_url));
      })
      .map((section) => {
        if (section && section.type === 'home_sliders' && Array.isArray(section.data)) {
          section.data = section.data.filter(
            (item) => !isPromotionLink(item && item.link_url)
          );
        }
        return section;
      });

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
