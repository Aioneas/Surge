<div align="center">
  <img src="./assets/hero-surge.svg" alt="Surge by Aioneas" width="100%" />
  <h1>Surge</h1>
  <p>Personal Surge config — self-hosted modules, clean routing, stability-first.</p>
  <p>
    <a href="https://raw.githubusercontent.com/Aioneas/Surge/main/Conf/surge.conf"><strong>Remote Config</strong></a>
    ·
    <a href="#modules"><strong>Modules</strong></a>
    ·
    <a href="#policy-groups"><strong>Policy Groups</strong></a>
    ·
    <a href="#structure"><strong>Structure</strong></a>
  </p>
</div>

## Quick Start

```text
https://raw.githubusercontent.com/Aioneas/Surge/main/Conf/surge.conf
```

打开 [`Conf/surge.conf`](./Conf/surge.conf)，将 `policy-path=请替换为你自己的Surge订阅地址` 替换为你的订阅链接后重新导入。

> [!IMPORTANT]
> 公开仓库不保存订阅地址、证书口令等敏感信息。

---

<a id="modules"></a>
## Modules

### Core

> [!TIP]
> `youtube.aioneas.hide-shorts.sgmodule` 建议**置顶安装**，可改善后台小窗 / PIP 首次转圈问题。

| 模块 | 功能 | Surge | Loon | QX |
| --- | --- | --- | --- | --- |
| [`youtube.aioneas.hide-shorts`](./Module/youtube.aioneas.hide-shorts.sgmodule) | YouTube 去广告 + PIP / 后台播放 + 隐藏 Shorts | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/youtube.aioneas.hide-shorts.sgmodule) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/loon/youtube.aioneas.hide-shorts.plugin) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/quantumultx/youtube.aioneas.hide-shorts.conf) |
| [`adblock`](./Module/adblock.sgmodule) | 常规广告过滤 | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/adblock.sgmodule) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/loon/adblock.plugin) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/quantumultx/adblock.conf) |
| [`kanlixiang`](./Module/kanlixiang.sgmodule) | 看理想 VIP 解锁 + 资料页清理 | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/kanlixiang.sgmodule) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/loon/kanlixiang.plugin) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/quantumultx/kanlixiang.conf) |
| [`sanlianzhongdu`](./Module/sanlianzhongdu.sgmodule) | 三联中读匿名登录自动 7 天会员 + 去推广 | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/sanlianzhongdu.sgmodule) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/loon/sanlianzhongdu.plugin) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/quantumultx/sanlianzhongdu.conf) |
| [`qqzone.adblock`](./Module/qqzone.adblock.aioneas.sgmodule) | QQ 空间去广告 | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/qqzone.adblock.aioneas.sgmodule) | — | — |
| [`shuzhiyizheng.adblock`](./Module/shuzhiyizheng.adblock.aioneas.sgmodule) | 数智易正去广告 | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/shuzhiyizheng.adblock.aioneas.sgmodule) | — | — |

<details>
<summary><strong>QQ 空间去广告 — 规则说明</strong></summary>

基于完整抓包分析（HAR + 实时监控），覆盖开屏广告全链路：

| 分类 | 域名 / 规则 |
| --- | --- |
| 广告素材 CDN | `pgdt.gtimg.cn` |
| 广告曝光上报 | `rpt.gdt.qq.com` |
| 广告 SDK 配置 | `tangram.e.qq.com` |
| 广告 SDK 上报 | `sdkreport.e.qq.com` |
| 广告请求接口 | `us.l.qq.com` |
| 广告点击追踪 | `p.l.qq.com` |
| 腾讯广告联盟（兜底） | `*.gdt.qq.com` |
| 数据 / 测速 / 崩溃上报 | `mazu.m.qq.com` · `wspeed.qq.com` · `ios.rqd.qq.com` |
| 视频广告 / DNS 追踪 | `soup.v.qq.com` · `ping.huatuo.qq.com` · `*.imtmp.net` |
| 广告配置下发 | `snowflake.qq.com` |
| QQ 空间广告上报 | `h5.qzone.qq.com/report/*` |

需开启 MITM 并信任 CA 证书，URL Rewrite 规则才能生效。

</details>

<details>
<summary><strong>数智易正去广告 — 规则说明</strong></summary>

基于完整抓包分析，覆盖广告 SDK、数据追踪、日志上报全链路：

| 分类 | 域名 / 规则 |
| --- | --- |
| 广告 SDK 聚合 | `api/tk/da.anythinktech.com` · `api.bridgeoos.com` |
| 广告 SDK | `ad.baihemob.com` · `ad/report.shunchangzhixing.com` · `admin.hzjizhun.cn` |
| 广告素材 CDN | `adimage.bwton.com` |
| 广告交换 / 追踪 | `s.adxvip.com` · `i.youjingnetwork.com` |
| IP 直连广告 | `120.46.138.110/32` |
| 数据追踪 | `*.umeng.com` · `*.umengcloud.com` |
| 推送 SDK | `sdk.push.mob.com` · `api.share.mob.com` |
| 日志上报（阿里云） | `compus-browse-statistics/second-card/compus-log.cn-hangzhou.log.aliyuncs.com` |
| 反作弊 / 设备指纹 | `*.dutils.com` · `yumao.puata.info` · `audid-api.taobao.com` |
| 崩溃上报 | `ios.bugly.qq.com` |
| 配置 / 上报 | `cfgc.zztfly.com` · `upc.zztfly.com` |
| 开屏广告接口（MITM） | `compus.xiaofubao.com` → `getStartupAdvertising` / `getAdvertisingMap` |

需开启 MITM 并信任 CA 证书，开屏广告拦截规则才能生效。  
业务域名 `compus.xiaofubao.com` / `application.xiaofubao.com` / `oss.yixiaoyuan.com` 未被整体拦截，App 正常功能不受影响。

</details>

---

### External Ad Filters

> [!NOTE]
> 将 EasyList / EasyPrivacy / uBlock / AdGuard Mobile Ads 中可映射到 Surge 网络层的**纯域名规则**拆成独立模块，按需安装。不含元素隐藏、脚本替换等浏览器扩展专属能力。

<!-- external-ad-filter-table:start -->

| 模块 | 来源 | 安装链接 | 当前规模 |
| --- | --- | --- | --- |
| [`easylist.sgmodule`](./Module/easylist.sgmodule) | EasyList | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/easylist.sgmodule) | 53,823 条拦截域名 / 0 条放行域名 |
| [`adguard.mobile-ads.sgmodule`](./Module/adguard.mobile-ads.sgmodule) | AdGuard/uBO – Mobile Ads | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/adguard.mobile-ads.sgmodule) | 934 条拦截域名 / 2 条放行域名 |
| [`ublock.filters.sgmodule`](./Module/ublock.filters.sgmodule) | uBlock filters – Ads, trackers, and more | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/ublock.filters.sgmodule) | 401 条拦截域名 / 4 条放行域名 |
| [`easyprivacy.sgmodule`](./Module/easyprivacy.sgmodule) | EasyPrivacy | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/easyprivacy.sgmodule) | 6,410 条拦截域名 / 4 条放行域名 |

<!-- external-ad-filter-table:end -->

<details>
<summary><strong>实现说明</strong></summary>

- 模块本体在 [`Module/`](./Module)，域名列表在 [`List/`](./List)，采用 `DOMAIN-SET` + 远程列表方式
- 规则生成脚本：[`tools/build_surge_adlists.py`](./tools/build_surge_adlists.py)
- 仅提取 `||domain^` 纯域名规则及其 allowlist，跳过元素隐藏、参数移除、复杂正则等浏览器专属语法

</details>

---

### News Redirect

> [!WARNING]
> 镜像站（`best.viatl.de` / `best.998888.best`）为私域付费站，非免费内容。作者仅做客户端适配，非镜像站运营方。

| 模块 | 覆盖站点 | Surge | Loon | QX |
| --- | --- | --- | --- | --- |
| [`news.redirect.aioneas`](./Module/news.redirect.aioneas.sgmodule) | 财新 / FT 中英文 / WSJ / Bloomberg / Economist / NYT / 端传媒 | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/news.redirect.aioneas.sgmodule) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/loon/news.redirect.aioneas.plugin) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/quantumultx/news.redirect.aioneas.conf) |
| [`news.redirect.caixin`](./Module/news.redirect.caixin.sgmodule) | 财新 DeepView / Entities / 三联 / 混沌 / 三联中读 | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/news.redirect.caixin.sgmodule) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/loon/news.redirect.caixin.plugin) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/quantumultx/news.redirect.caixin.conf) |

<details>
<summary><strong>补充说明</strong></summary>

- `news.redirect.aioneas`：跳转目标 `best.viatl.de`，兼容 `ftchinese.com` 的 `story/<id>` 与 `interactive/<id>` 页面
- `news.redirect.caixin`：跳转目标 `best.998888.best` 系列，覆盖财新周边产品线与三联系列
- 三联生活周刊为 SPA，站内跳转后通常需手动刷新一次才能触发
- 两个模块覆盖站点互补，可同时安装

</details>

---

<a id="policy-groups"></a>
## Policy Groups

共 23 个策略组：`Proxies` · `Google` · `Apple` · `OpenAI` · `Claude` · `YouTube` · `Netflix` · `Disney` · `HBOMax` · `Bahamut` · `BiliBili` · `Spotify` · `Steam` · `Telegram` · `Microsoft` · `GitHub` · `PayPal` · `Link` · `Economist` · `NewYorkTimes` · `Caixin` · `Speedtest` · `Final`

<details>
<summary><strong>展开完整列表</strong></summary>

| 策略组 | 默认候选 | 说明 |
| --- | --- | --- |
| `Proxies` | 订阅节点 | 主节点组 |
| `Final` | Proxies / DIRECT | 兜底 |
| `Google` | Proxies / 地区组 | — |
| `Apple` | Proxies / DIRECT / 地区组 | — |
| `OpenAI` | Proxies / 地区组 | — |
| `Claude` | Proxies / 地区组 | 图标自托管 |
| `YouTube` | Proxies / 地区组 | — |
| `Netflix` | Proxies / 地区组 | — |
| `Disney` | Proxies / 地区组 | — |
| `HBOMax` | Proxies / 地区组 | — |
| `Bahamut` | Proxies / HK / TW | — |
| `BiliBili` | DIRECT / HK / TW | — |
| `Spotify` | Proxies / DIRECT / 地区组 | — |
| `Steam` | Proxies / DIRECT / 地区组 | — |
| `Telegram` | Proxies / 地区组 | — |
| `Microsoft` | Proxies / DIRECT / 地区组 | — |
| `GitHub` | Proxies / DIRECT / 地区组 | — |
| `PayPal` | Proxies / DIRECT / 地区组 | — |
| `Link` | PayPal / Proxies / DIRECT / 地区组 | Stripe Link，默认跟随 PayPal |
| `Economist` | SG / Proxies / HK / JP / TW / US / DIRECT | 默认 SG |
| `NewYorkTimes` | SG / Proxies / HK / JP / TW / US / DIRECT | 默认 SG |
| `Caixin` | SG / Proxies / HK / JP / TW / US / DIRECT | 默认 SG |
| `Speedtest` | DIRECT / Proxies / 地区组 | — |

</details>

---

<a id="structure"></a>
## Structure

```text
Surge/
├── Conf/          # 主配置
├── Module/        # Surge 模块
├── List/          # 自托管规则集 + 广告模块 DOMAIN-SET 列表
├── Script/        # 自托管脚本
├── Icon/          # 策略组与模块图标
├── tools/         # 规则生成与维护脚本
├── loon/          # Loon 适配版
├── quantumultx/   # Quantumult X 适配版
└── assets/        # README 视觉资源
```

## Maintainer

**Aioneas**
