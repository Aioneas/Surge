<div align="center">
  <img src="./assets/hero-surge.svg" alt="Surge by Aioneas" width="100%" />
  <h1>Surge</h1>
  <p>Personal Surge configuration, modules, and self-hosted assets for iPhone.</p>
  <p>
    <a href="https://raw.githubusercontent.com/Aioneas/Surge/main/Conf/surge.conf"><strong>Remote Config</strong></a>
    ·
    <a href="#modules"><strong>Modules</strong></a>
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

- 独立策略组覆盖 Apple / Google / OpenAI / Claude / GitHub / YouTube / Netflix / Disney / Telegram / Spotify / Steam / PayPal / Link / Speedtest 等常用场景
- `Link`（Stripe Link）独立策略组，规则集自托管于 [`List/link.list`](./List/link.list)，图标自托管于 [`Icon/Link.png`](./Icon/Link.png)；默认走 PayPal 节点，可按需切换
- `Claude` 独立策略组，图标自托管于 [`Icon/claude.png`](./Icon/claude.png)
- Rewrite 与 MITM 范围保持克制，优先降低副作用与误伤概率
- 配置、模块、脚本、图标分目录维护，适合作为长期迭代的个人主配置基底
- 关键资源尽量自托管，减少外链失效带来的不可控问题

## Policy Groups

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
| `Speedtest` | DIRECT / Proxies / 地区组 | Speedtest | — |

## Repository at a glance

| 路径 | 说明 |
| --- | --- |
| [`Conf/`](./Conf) | 主配置 |
| [`Module/`](./Module) | Surge 模块 |
| [`List/`](./List) | 自托管规则集（Link 等）及外部广告模块 `DOMAIN-SET` 列表 |
| [`Script/`](./Script) | 自托管脚本 |
| [`tools/`](./tools) | 规则生成与维护脚本 |
| [`Icon/`](./Icon) | 图标资源 |
| [`loon/`](./loon) | Loon 适配版 |
| [`quantumultx/`](./quantumultx) | Quantumult X 适配版 |

<a id="modules"></a>
## Modules

### Core modules

| 模块 | 功能 | 安装链接 | 备注 |
| --- | --- | --- | --- |
| [`adblock.sgmodule`](./Module/adblock.sgmodule) | 常规广告过滤 | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/adblock.sgmodule) | 基础模块 |
| [`youtube.aioneas.hide-shorts.sgmodule`](./Module/youtube.aioneas.hide-shorts.sgmodule) | YouTube 去广告 + PIP / 后台播放 + 隐藏 Shorts | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/youtube.aioneas.hide-shorts.sgmodule) | 当前仅保留 hide-Shorts 版 |
| [`kanlixiang.sgmodule`](./Module/kanlixiang.sgmodule) | 看理想 VIP 解锁 + 资料页清理 | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/kanlixiang.sgmodule) | 脚本自托管 |
| [`sanlianzhongdu.sgmodule`](./Module/sanlianzhongdu.sgmodule) | 三联中读匿名登录自动 7 天会员 + 去推广 | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/sanlianzhongdu.sgmodule) | 脚本自托管 |

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
| [`easylist.sgmodule`](./Module/easylist.sgmodule) | EasyList | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/easylist.sgmodule) | 55,138 条拦截域名 / 0 条放行域名 |
| [`adguard.mobile-ads.sgmodule`](./Module/adguard.mobile-ads.sgmodule) | AdGuard/uBO – Mobile Ads | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/adguard.mobile-ads.sgmodule) | 923 条拦截域名 / 2 条放行域名 |
| [`ublock.filters.sgmodule`](./Module/ublock.filters.sgmodule) | uBlock filters – Ads, trackers, and more | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/ublock.filters.sgmodule) | 416 条拦截域名 / 4 条放行域名 |
| [`easyprivacy.sgmodule`](./Module/easyprivacy.sgmodule) | EasyPrivacy | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/easyprivacy.sgmodule) | 6,380 条拦截域名 / 4 条放行域名 |

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
> 注意：镜像站（`best.viatl.de` / `best.998888.best` 系列）为私域付费站，内容非免费；一般情况不建议使用。如确有需求请自行安装，镜像站页面底部有 TG 联系方式。作者仅做 Surge / Loon / QX 适配，非镜像站运营方。

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
- 想按功能叠加：从 [`Module/`](./Module) 里选择需要的模块单独安装
- 想看具体实现：脚本请查看 [`Script/`](./Script)，图标请查看 [`Icon/`](./Icon)
- 想看外部广告模块如何生成：请查看 [`tools/build_surge_adlists.py`](./tools/build_surge_adlists.py) 与 [`List/manifest.json`](./List/manifest.json)

## Maintainer

**Aioneas**
