<div align="center">
  <img src="./assets/hero-surge.svg" alt="Surge by Aioneas" width="100%" />
  <h1>Surge</h1>
  <p>A personal Surge / Sugar setup for iPhone.</p>
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
> 面向长期使用整理的一套个人配置：减少外部依赖，保留清晰结构，把常用能力拆成可维护、可复用、可按需组合的模块。

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

## At a glance

- **Main Config**: [`Conf/surge.conf`](./Conf/surge.conf)

- **Modules**: [`Module/`](./Module)

- **Scripts**: [`Script/`](./Script)

- **Icons**: [`Icon/`](./Icon)

- **Focus**: Stability-first · Minimal · Self-hosted · iPhone / Surge

> [!NOTE]
> 关键脚本放在 [`Script/`](./Script)，关键图标放在 [`Icon/`](./Icon)，尽量避免第三方资源失效带来的长期维护成本。

## Configuration Highlights

- 独立策略组覆盖 Apple / Google / OpenAI / Claude / GitHub / YouTube / Netflix / Disney / Telegram / Spotify / Steam / PayPal / Speedtest 等常用场景
- 已内置 `Claude` 独立分流，并使用自托管图标 [`Icon/claude.png`](./Icon/claude.png)
- Rewrite 与 MITM 范围保持克制，优先降低副作用与误伤概率
- 配置、模块、脚本、图标分目录维护，适合作为长期迭代的个人主配置基底
- 关键资源尽量自托管，减少外链失效带来的不可控问题

<a id="modules"></a>
## Modules

### Daily modules

| 模块 | 功能 | 安装链接 | 备注 |
| --- | --- | --- | --- |
| [`adblock.sgmodule`](./Module/adblock.sgmodule) | 常规广告过滤 | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/adblock.sgmodule) | 基础模块 |
| [`youtube.aioneas.hide-shorts.sgmodule`](./Module/youtube.aioneas.hide-shorts.sgmodule) | YouTube 去广告 + PIP / 后台播放 + 隐藏 Shorts | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/youtube.aioneas.hide-shorts.sgmodule) | 当前仅保留 hide-Shorts 版 |
| [`kanlixiang.sgmodule`](./Module/kanlixiang.sgmodule) | 看理想 VIP 解锁 + 资料页清理 | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/kanlixiang.sgmodule) | 脚本自托管 |
| [`sanlianzhongdu.sgmodule`](./Module/sanlianzhongdu.sgmodule) | 三联中读匿名登录自动 7 天会员 + 去推广 | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/sanlianzhongdu.sgmodule) | 脚本自托管 |

### News redirect modules

> [!WARNING]
> 注意：镜像站（`best.viatl.de` / `best.998888.best` 系列）为私域付费站，内容非免费；一般情况不建议使用。如确有需求请自行安装，镜像站页面底部有 TG 联系方式。作者仅做 Surge / Loon / QX 适配，非镜像站运营方。

| 模块 | 支持范围 | Surge / Sugar | Loon | Quantumult X | 说明 |
| --- | --- | --- | --- | --- | --- |
| [`news.redirect.aioneas.sgmodule`](./Module/news.redirect.aioneas.sgmodule) | 财新主站 / FT 中文 / FT 英文 / WSJ / Bloomberg / Economist / NYT / 端传媒 | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/news.redirect.aioneas.sgmodule) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/loon/news.redirect.aioneas.plugin) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/quantumultx/news.redirect.aioneas.conf) | 跳转目标：`best.viatl.de` |
| [`news.redirect.caixin.sgmodule`](./Module/news.redirect.caixin.sgmodule) | 财新 DeepView / Entities / 三联生活周刊 / 混沌 / 三联中读 | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/Module/news.redirect.caixin.sgmodule) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/loon/news.redirect.caixin.plugin) | [Install](https://raw.githubusercontent.com/Aioneas/Surge/main/quantumultx/news.redirect.caixin.conf) | 跳转目标：`best.998888.best` 系列 |

<details>
  <summary><strong>展开查看新闻模块补充说明</strong></summary>

- `news.redirect.aioneas.sgmodule` 已兼容 `www.ftchinese.com` / `ftchinese.com` / `m.ftchinese.com` 下的 `story/&lt;id&gt;` 与 `interactive/&lt;id&gt;` 页面
- `news.redirect.caixin.sgmodule` 覆盖财新周边产品线与三联生活周刊 / 混沌 / 三联中读等站点
- 三联生活周刊属于 SPA 页面，站内跳转后通常需要手动刷新一次才能触发跳转
- 两个模块覆盖站点互补，可同时安装，也可单独使用
- Loon 版位于 [`loon/`](./loon)，Quantumult X 版位于 [`quantumultx/`](./quantumultx)

</details>

<a id="principles"></a>
## Principles

### Stability first
优先保证日常可用性，而不是盲目堆积规则与功能；Rewrite、MITM 与策略组尽量维持在够用、可控、低副作用的范围内。

### Self-host where it matters
脚本与图标尽可能放回仓库自托管，避免外部图标库、脚本源、第三方站点失效后牵连主配置。

### Modular by default
主配置负责提供稳定骨架，功能通过独立模块按需叠加；这样更清晰，也更方便长期维护与问题定位。

### Public repo hygiene
公开版仓库始终坚持脱敏原则：私人订阅、凭据、证书等信息不进入公开仓库，避免误传与泄漏风险。

## Current Focus

- Apple / Google / Microsoft / GitHub
- OpenAI / ChatGPT / Claude
- YouTube / Netflix / Disney / Spotify / Steam
- Telegram / PayPal / Speedtest / BiliBili / Bahamut
- AMap / 12306 / Tesla / Mi Home
- 百度网盘 / Infuse / 微信读书 / 掌阅等常用应用

<a id="structure"></a>
## Structure

```text
Surge/
├── assets/        # README 视觉资源
│   └── hero-surge.svg
├── Conf/          # 主配置
│   └── surge.conf
├── Module/        # Surge / Sugar 模块
├── loon/          # Loon 适配版
├── quantumultx/   # Quantumult X 适配版
├── Script/        # 模块自托管脚本
├── Icon/          # 策略组与模块图标
└── README.md
```

## Usage Notes

- 想直接使用：从 [`Conf/surge.conf`](./Conf/surge.conf) 开始
- 想按功能叠加：从 [`Module/`](./Module) 里选择需要的模块单独安装
- 想看具体实现：脚本请查看 [`Script/`](./Script)，图标请查看 [`Icon/`](./Icon)

## Maintainer

**Aioneas**
