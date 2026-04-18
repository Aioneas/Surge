<div align="center">
  <img src="./assets/hero-surge.svg" alt="Surge by Aioneas" width="100%" />
  <h1>Surge</h1>
  <p>Personal Surge config with self-hosted modules, clean routing, and stability-first maintenance.</p>
  <p>
    <a href="https://raw.githubusercontent.com/Aioneas/Surge/main/Conf/surge.conf"><strong>Remote Config</strong></a>
    ·
    <a href="#modules"><strong>Modules</strong></a>
    ·
    <a href="#policy-groups"><strong>Policy Groups</strong></a>
    ·
    <a href="#principles"><strong>Principles</strong></a>
    ·
    <a href="#structure"><strong>Structure</strong></a>
  </p>
</div>

> [!TIP]
> 面向长期使用整理的一套个人 Surge 配置：减少外部依赖、保持目录清晰，把常用能力拆成可维护、可复用、可按需组合的模块。

## Quick Start

### Remote Config

```text
https://raw.githubusercontent.com/Aioneas/Surge/main/Conf/surge.conf
```

### Replace your subscription

打开 [`Conf/surge.conf`](./Conf/surge.conf)，找到：

```ini
policy-path=请替换为你自己的Surge订阅地址
```

把占位符替换为你自己的 Surge 订阅链接，保存并重新导入即可。

> [!IMPORTANT]
> 本仓库为公开仓库，主配置默认只保留安全占位符，不会写入私人订阅地址、证书口令或其他敏感信息。

## Highlights

- 独立策略组覆盖 Apple / Google / OpenAI / Claude / GitHub / YouTube / Netflix / Disney / Telegram / Spotify / Steam / PayPal / Link / Economist / NewYorkTimes / Caixin / Speedtest 等常用场景
- Economist / NewYorkTimes / Caixin 已改为自托管远程规则集（`List/economist.list` / `List/newyorktimes.list` / `List/caixin.list`），主配置通过 `RULE-SET` 拉取，便于后续独立维护
- `Link`（Stripe Link）独立策略组，规则集自托管于 [`List/link.list`](./List/link.list)，图标自托管于 [`Icon/Link.png`](./Icon/Link.png)；默认走 PayPal 节点，可按需切换
- 核心规则集（YouTube / Netflix / Global / China / Lan / Google / Microsoft / GitHub / OpenAI / Claude / Apple 等）已统一改为自托管镜像，主维护入口位于 [`List/`](./List) 与 [`tools/build_rule_mirrors.py`](./tools/build_rule_mirrors.py)
- `Apple` 规则补丁源位于 [`List/apple.patch.list`](./List/apple.patch.list)，构建脚本会合并上游 Apple 规则并输出 Surge / Clash 双版本
- `Claude` 独立策略组，图标自托管于 [`Icon/claude.png`](./Icon/claude.png)
- Rewrite 与 MITM 范围保持克制，优先降低副作用与误伤概率
- 配置、模块、脚本、图标分目录维护，适合作为长期迭代的个人主配置基底
- 关键资源尽量自托管，减少外链失效带来的不可控问题

## Repository at a glance

| 路径 | 说明 |
| --- | --- |
| [`Conf/`](./Conf) | 主配置 |
| [`Module/`](./Module) | Surge 模块 |
| [`List/`](./List) | 自托管规则集（Link / Apple / YouTube / Google / Global 等）及外部广告模块 `DOMAIN-SET` 列表 |
| [`Script/`](./Script) | 自托管脚本 |
| [`tools/`](./tools) | 规则生成与维护脚本 |
| [`Icon/`](./Icon) | 图标资源 |
| [`loon/`](./loon) | Loon 适配版 |
| [`quantumultx/`](./quantumultx) | Quantumult X 适配版 |

<a id="modules"></a>
## Modules

### Core modules

> [!IMPORTANT]
> `youtube.aioneas.hide-shorts.sgmodule` 建议作为 **Surge 模块列表中的第一个模块（最置顶）** 安装/启用。
> **建议在 Surge 模块中置顶**；可改善后台小窗 / PIP 首次转圈问题。如与其他模块同时使用，请优先保证它的加载顺序最高。

| 模块 | 功能 | Surge | Loon | Quantumult X | 说明 |
| --- | --- | --- | --- | --- | --- |
| [`youtube.aioneas.hide-shorts.sgmodule`](./Module/youtube.aioneas.hide-shorts.sgmodule) | YouTube 去广告 + PIP / 后台播放 + 隐藏 Shorts | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/youtube.aioneas.hide-shorts.sgmodule) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/loon/youtube.aioneas.hide-shorts.plugin) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/quantumultx/youtube.aioneas.hide-shorts.conf) | **建议置顶安装**；可改善后台小窗 / PIP 首次转圈问题 |
| [`adblock.sgmodule`](./Module/adblock.sgmodule) | 常规广告过滤 | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/adblock.sgmodule) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/loon/adblock.plugin) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/quantumultx/adblock.conf) | 基础模块 |
| [`kanlixiang.sgmodule`](./Module/kanlixiang.sgmodule) | 看理想 VIP 解锁 + 资料页清理 | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/kanlixiang.sgmodule) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/loon/kanlixiang.plugin) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/quantumultx/kanlixiang.conf) | 脚本自托管 |
| [`sanlianzhongdu.sgmodule`](./Module/sanlianzhongdu.sgmodule) | 三联中读匿名登录自动 7 天会员 + 去推广 | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/sanlianzhongdu.sgmodule) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/loon/sanlianzhongdu.plugin) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/quantumultx/sanlianzhongdu.conf) | 脚本自托管 |
| [`qqzone.adblock.aioneas.sgmodule`](./Module/qqzone.adblock.aioneas.sgmodule) | QQ 空间去开屏广告 | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/qqzone.adblock.aioneas.sgmodule) | — | — | 基于实际抓包分析，规则覆盖广告素材、SDK、上报、追踪全链路 |
| [`shuzhiyizheng.adblock.aioneas.sgmodule`](./Module/shuzhiyizheng.adblock.aioneas.sgmodule) | 数智易正去广告 | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/shuzhiyizheng.adblock.aioneas.sgmodule) | — | — | 基于实际抓包分析，拦截多家广告SDK聚合、数据追踪、日志上报 |

<details>
  <summary><strong>展开查看 QQ 空间去广告模块说明</strong></summary>

基于对 QQ 空间 App 启动流程的完整抓包分析（HAR + PCAP），覆盖以下广告链路：

| 分类 | 域名 | 说明 |
| --- | --- | --- |
| 广告素材 CDN | `pgdt.gtimg.cn` | 开屏广告图片/视频素材下载，单次启动可拉取 4–5 MB |
| 广告曝光上报 | `rpt.gdt.qq.com` | `/creative_view` 广告曝光打点 |
| 广告 SDK 配置 | `tangram.e.qq.com` | `/updateSetting` 广告 SDK 初始化配置下发 |
| 广告 SDK 上报 | `sdkreport.e.qq.com` | `/link_event` SDK 事件上报 |
| 广告请求接口 | `us.l.qq.com` | `/exapp` 开屏广告拉取接口（posid 参数标识广告位） |
| 广告点击追踪 | `p.l.qq.com` | `/p` 广告点击 ping |
| 腾讯广告联盟 | `*.gdt.qq.com` | 兜底拦截全部 GDT 子域名 |
| 数据上报 | `mazu.m.qq.com` | 腾讯数据平台上报 |
| 测速上报 | `wspeed.qq.com` | 网络测速数据上报 |
| 崩溃/性能上报 | `ios.rqd.qq.com` | RQD 崩溃与性能数据 |
| 视频广告上报 | `soup.v.qq.com` | cmd=54 广告相关配置 |
| DNS 探测追踪 | `ping.huatuo.qq.com` + `*.imtmp.net` | 动态子域名 DNS 探测，用于广告链路追踪 |
| 广告配置下发 | `snowflake.qq.com` | 开屏广告开关与频控配置 |
| QQ 空间广告上报 | `h5.qzone.qq.com/report/*` | `/report/native` 与 `/report/compass` 广告曝光 |

> 模块同时包含 URL Rewrite 规则，对无法通过域名整体拦截的接口（如与正常功能共用域名）精确匹配路径拦截，避免误伤。
> 需要在 Surge 中开启 MITM 并信任 CA 证书，URL Rewrite 规则才能生效。

</details>

<details>
  <summary><strong>展开查看数智易正去广告模块说明</strong></summary>

基于对数智易正 App（`cn.com.yunma.company.app`）启动流程的完整抓包分析（HAR + PCAP），覆盖以下广告与追踪链路：

| 分类 | 域名 | 说明 |
| --- | --- | --- |
| 广告 SDK 聚合 | `api.anythinktech.com` / `tk.anythinktech.com` / `da.anythinktech.com` | TopOn (AnyThink) 广告聚合平台，`/v2/open/app` 初始化、`/v2/open/placement` 广告位请求 |
| 广告 SDK 聚合 | `api.bridgeoos.com` | BridgeOOS 广告聚合，与 AnyThink 同接口结构 |
| 广告 SDK | `ad.baihemob.com` | 百合互动广告 SDK，`/setGInfo` 设备信息上报、`/checkCd` 广告频控、`/infoConfig` 配置拉取 |
| 广告 SDK | `ad.shunchangzhixing.com` / `inner-empty.shunchangzhixing.com` / `static.shunchangzhixing.com` / `report.shunchangzhixing.com` | 顺昌智行广告 SDK，`/init2` 初始化、`/ck.js` 点击追踪、`/channel/report` 广告事件上报 |
| 广告 SDK | `admin.hzjizhun.cn` | 杭州极准广告 SDK，接口结构与百合互动一致 |
| 广告素材与追踪 | `adimage.bwton.com` | 广告图片素材 CDN |
| 广告交换与追踪 | `s.adxvip.com` / `i.youjingnetwork.com` | 广告交换平台与有景网络追踪，`/jy3c` `/jypi` `/jyci` 广告请求，`/e` `/c` `/s` 事件追踪 |
| IP 直连广告 | `120.46.138.110` / `43.160.156.0/24` / `101.32.133.0/24` | 广告服务器 IP 直连，`/init2` 初始化、`/ad2` 广告请求、`/mmtls/*` 加密通信 |
| 数据追踪 | `cnlogs.umeng.com` / `cnlogs.umengcloud.com` / `utoken.umeng.com` / `resolve.umeng.com` / `ucc.umeng.com` | 友盟统计、设备标识、域名解析、配置下发 |
| 推送 SDK | `sdk.push.mob.com` / `api.share.mob.com` | MobTech 推送与分享 SDK |
| 日志上报 | `compus-browse-statistics.cn-hangzhou.log.aliyuncs.com` / `second-card.cn-hangzhou.log.aliyuncs.com` / `compus-log.cn-hangzhou.log.aliyuncs.com` | 阿里云日志服务，浏览统计、二级卡片、业务日志 |
| 反作弊 SDK | `cdn-api-verify.dutils.com` / `log-verify.dutils.com` / `m.mpl.dutils.com` / `h.m.mpl.dutils.com` | 数盾 (dutils) 反作弊与设备指纹 |
| 设备指纹 | `yumao.puata.info` / `audid-api.taobao.com` | 羽毛设备指纹、淘宝设备 ID |
| 崩溃上报 | `ios.bugly.qq.com` | 腾讯 Bugly 崩溃上报 |
| 配置与上报 | `cfgc.zztfly.com` / `upc.zztfly.com` | 配置下发与数据上报 |

> 模块同时包含 IP-CIDR 规则拦截 IP 直连广告服务器（含微信 mmtls 加密通信），以及 URL Rewrite 精确匹配路径拦截，避免误伤业务接口。
> 业务域名 `compus.xiaofubao.com` / `application.xiaofubao.com` / `oss.yixiaoyuan.com` 未被拦截，确保 App 正常功能不受影响。

</details>

### External ad filter modules

> [!IMPORTANT]
> 以下 4 个模块把 EasyList / EasyPrivacy / uBlock filters / AdGuard Mobile Ads 中**可稳定映射到 Surge 网络层**的域名级规则拆成独立模块，适合按需安装、单独更新。
>
> - 适合"拆开装，避免单模块过大"的使用方式
> - **不包含** 元素隐藏、脚本替换、参数移除等浏览器扩展专属能力
> - `easylist.sgmodule` 体量最大，首次下载与更新会更慢一些

<!-- external-ad-filter-table:start -->

| 模块 | 来源 | 安装链接 | 当前规模 |
| --- | --- | --- | --- |
| [`easylist.sgmodule`](./Module/easylist.sgmodule) | EasyList | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/easylist.sgmodule) | 54,470 条拦截域名 / 0 条放行域名 |
| [`adguard.mobile-ads.sgmodule`](./Module/adguard.mobile-ads.sgmodule) | AdGuard/uBO – Mobile Ads | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/adguard.mobile-ads.sgmodule) | 929 条拦截域名 / 2 条放行域名 |
| [`ublock.filters.sgmodule`](./Module/ublock.filters.sgmodule) | uBlock filters – Ads, trackers, and more | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/ublock.filters.sgmodule) | 400 条拦截域名 / 4 条放行域名 |
| [`easyprivacy.sgmodule`](./Module/easyprivacy.sgmodule) | EasyPrivacy | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/easyprivacy.sgmodule) | 6,405 条拦截域名 / 4 条放行域名 |

<!-- external-ad-filter-table:end -->

<details>
  <summary><strong>展开查看外部广告模块实现说明</strong></summary>

- 模块本体放在 [`Module/`](./Module)，实际域名列表放在 [`List/`](./List)
- 采用 `DOMAIN-SET` + 远程列表的方式，便于后续持续更新上游规则
- 规则生成脚本为 [`tools/build_surge_adlists.py`](./tools/build_surge_adlists.py)
- 当前仅提取 `||domain^` 这类**纯域名网络规则**及其 allowlist / exception，刻意跳过：
  - 元素隐藏（`##` / `#@#`）
  - 参数移除 / replace / redirect / scriptlet
  - 复杂 URL 正则与依赖扩展语法的规则
- 目标不是"100% 复刻浏览器扩展效果"，而是优先保证 **Surge 下可用、可维护、可更新**

</details>

### News redirect modules

> [!WARNING]
> 注意：镜像站（`best.viatl.de` / `best.998888.best` 系列）为私域付费站，内容非免费；一般情况不建议使用。如确有需求请自行安装，镜像站页面底部有 TG 联系方式。作者仅做 Surge / Loon / Quantumult X 适配，非镜像站运营方。

| 模块 | 支持范围 | Surge | Loon | Quantumult X | 说明 |
| --- | --- | --- | --- | --- | --- |
| [`news.redirect.aioneas.sgmodule`](./Module/news.redirect.aioneas.sgmodule) | 财新主站 / FT 中文 / FT 英文 / WSJ / Bloomberg / Economist / NYT / 端传媒 | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/news.redirect.aioneas.sgmodule) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/loon/news.redirect.aioneas.plugin) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/quantumultx/news.redirect.aioneas.conf) | 跳转目标：`best.viatl.de` |
| [`news.redirect.caixin.sgmodule`](./Module/news.redirect.caixin.sgmodule) | 财新 DeepView / Entities / 三联生活周刊 / 混沌 / 三联中读 | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/news.redirect.caixin.sgmodule) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/loon/news.redirect.caixin.plugin) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/quantumultx/news.redirect.caixin.conf) | 跳转目标：`best.998888.best` 系列 |

<details>
  <summary><strong>展开查看新闻模块补充说明</strong></summary>

- `news.redirect.aioneas.sgmodule` 已兼容 `www.ftchinese.com` / `ftchinese.com` / `m.ftchinese.com` 下的 `story/<id>` 与 `interactive/<id>` 页面
- `news.redirect.caixin.sgmodule` 覆盖财新周边产品线与三联生活周刊 / 混沌 / 三联中读等站点
- 三联生活周刊属于 SPA 页面，站内跳转后通常需要手动刷新一次才能触发跳转
- 两个模块覆盖站点互补，可同时安装，也可单独使用
- Loon 版位于 [`loon/`](./loon)，Quantumult X 版位于 [`quantumultx/`](./quantumultx)

</details>

---

<a id="policy-groups"></a>
## Policy Groups

共 23 个策略组，覆盖 `Proxies` · `Google` · `Apple` · `OpenAI` · `Claude` · `YouTube` · `Netflix` · `Disney` · `HBOMax` · `Bahamut` · `BiliBili` · `Spotify` · `Steam` · `Telegram` · `Microsoft` · `GitHub` · `PayPal` · `Link` · `Economist` · `NewYorkTimes` · `Caixin` · `Speedtest` · `Final`。

<details>
  <summary><strong>展开查看完整策略组列表</strong></summary>

| 策略组 | 默认候选 | 图标 | 说明 |
| --- | --- | --- | --- |
| `Proxies` | 订阅节点 | Global | 主节点组，所有分组的流量出口 |
| `Final` | Proxies / DIRECT | — | 兜底策略 |
| `Google` | Proxies / 地区组 | Google | — |
| `Apple` | Proxies / DIRECT / 地区组 | Apple | — |
| `OpenAI` | Proxies / 地区组 | ChatGPT | — |
| `Claude` | Proxies / 地区组 | Claude | — |
| `YouTube` | Proxies / 地区组 | YouTube | — |
| `Netflix` | Proxies / 地区组 | Netflix | — |
| `Disney` | Proxies / 地区组 | Disney | — |
| `HBOMax` | Proxies / 地区组 | HBO | — |
| `Bahamut` | Proxies / HK / TW | Bahamut | — |
| `BiliBili` | DIRECT / HK / TW | bilibili | — |
| `Spotify` | Proxies / DIRECT / 地区组 | Spotify | — |
| `Steam` | Proxies / DIRECT / 地区组 | Steam | — |
| `Telegram` | Proxies / 地区组 | Telegram | — |
| `Microsoft` | Proxies / DIRECT / 地区组 | Microsoft | — |
| `GitHub` | Proxies / DIRECT / 地区组 | GitHub | — |
| `PayPal` | Proxies / DIRECT / 地区组 | PayPal | — |
| `Link` | PayPal / Proxies / DIRECT / 地区组 | Link | Stripe Link，默认跟随 PayPal |
| `Economist` | SG / Proxies / HK / JP / TW / US / DIRECT | Economist | 经济学人分流，默认 SG |
| `NewYorkTimes` | SG / Proxies / HK / JP / TW / US / DIRECT | NewYorkTimes | 纽约时报分流，默认 SG |
| `Caixin` | SG / Proxies / HK / JP / TW / US / DIRECT | Caixin | 财新分流，默认 SG |
| `Speedtest` | DIRECT / Proxies / 地区组 | Speedtest | — |

</details>

<a id="principles"></a>
## Principles

- **Stability first**：优先保证日常可用性，而不是盲目堆积规则与功能；Rewrite、MITM 与策略组尽量维持在够用、可控、低副作用的范围内。
- **Self-host where it matters**：脚本与图标尽可能放回仓库自托管，避免外部图标库、脚本源、第三方站点失效后牵连主配置。
- **Modular by default**：主配置负责提供稳定骨架，功能通过独立模块按需叠加；这样更清晰，也更方便长期维护与问题定位。
- **Public repo hygiene**：公开版仓库始终坚持脱敏原则：私人订阅、凭据、证书等信息不进入公开仓库，避免误传与泄漏风险。

<a id="structure"></a>
## Structure

```text
Surge/
├── assets/        # README 视觉资源
│   └── hero-surge.svg
├── Conf/          # 主配置
│   └── surge.conf
├── Module/        # Surge 模块
├── List/          # 自托管规则集（link.list 等）及广告模块 DOMAIN-SET 列表
│   └── link.list  # Stripe Link 分流规则集
├── loon/          # Loon 适配版
├── quantumultx/   # Quantumult X 适配版
├── Script/        # 模块自托管脚本
├── Icon/          # 策略组与模块图标（含 Link.png）
├── tools/         # 规则生成与维护脚本
└── README.md
```

## Usage Notes

- 想直接使用：从 [`Conf/surge.conf`](./Conf/surge.conf) 开始
- 想按功能叠加：可按所用客户端从 [`Module/`](./Module) / [`loon/`](./loon) / [`quantumultx/`](./quantumultx) 选择对应模块单独安装
- 想看具体实现：脚本请查看 [`Script/`](./Script)，图标请查看 [`Icon/`](./Icon)
- 想看外部广告模块如何生成：请查看 [`tools/build_surge_adlists.py`](./tools/build_surge_adlists.py) 与 [`List/manifest.json`](./List/manifest.json)

## Maintainer

**Aioneas**
