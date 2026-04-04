# Surge

我的 Surge 配置与模块仓库。

## Raw URL

```text
https://raw.githubusercontent.com/Aioneas/Surge/main/Conf/surge.conf
```

## GitHub Path

```text
https://github.com/Aioneas/Surge/tree/main/Conf
```

## Modules

| 模块 | 功能 | Raw URL |
|------|------|---------|
| 去广告 | 广告过滤 | `https://raw.githubusercontent.com/Aioneas/Surge/main/Module/adblock.sgmodule` |
| YouTube（原版兼容） | 去广告 + PIP/后台播放 | `https://raw.githubusercontent.com/Aioneas/Surge/main/Module/youtube.sgmodule` |
| YouTube 稳定版@Aioneas | 基于自托管稳定逻辑：去广告 + PIP/后台播放 | `https://raw.githubusercontent.com/Aioneas/Surge/main/Module/youtube.aioneas.stable.sgmodule` |
| YouTube 隐藏Shorts版@Aioneas | 在稳定版基础上额外隐藏 Shorts 入口与底部上传/创建（+）按钮 | `https://raw.githubusercontent.com/Aioneas/Surge/main/Module/youtube.aioneas.hide-shorts.sgmodule` |
| 看理想 | VIP解锁 + 资料页去推广昵称 | `https://raw.githubusercontent.com/Aioneas/Surge/main/Module/kanlixiang.sgmodule` |
| 三联中读 | 匿名登录自动7天会员 + 去推广 | `https://raw.githubusercontent.com/Aioneas/Surge/main/Module/sanlianzhongdu.sgmodule` |
| 新闻网站智能重定向@Aioneas | 财新 / FT中文 / FT / WSJ / Bloomberg / Economist / NYT / 端传媒 自动跳转镜像阅读页 | `https://raw.githubusercontent.com/Aioneas/Surge/main/Module/news.redirect.aioneas.sgmodule` |

> YouTube 当前提供原版兼容、稳定版、隐藏 Shorts 版三个模块；其中隐藏 Shorts 版已同步包含底部“+”创建/上传按钮隐藏逻辑。

> 所有模块脚本均自托管在 `Script/` 目录下，不依赖外部脚本源。

> 新增“新闻网站智能重定向@Aioneas”模块：将 3 个油猴新闻跳转脚本整合为 Surge 模块，当前覆盖 财新 / FT中文 / FT / WSJ / Bloomberg / Economist / NYT / 端传媒，采用 URL Rewrite 302 自动跳转到镜像阅读页。

## Structure

```text
Surge/
├── Conf/
│   └── surge.conf
├── Icon/
│   ├── Apple.png
│   ├── Bahamut.png
│   ├── ChatGPT.png
│   ├── Disney.png
│   ├── Final.png
│   ├── GitHub.png
│   ├── Global.png
│   ├── Google.png
│   ├── HBO.png
│   ├── Hong_Kong.png
│   ├── Japan.png
│   ├── Microsoft.png
│   ├── Netflix.png
│   ├── PayPal.png
│   ├── Singapore.png
│   ├── Speedtest.png
│   ├── Spotify.png
│   ├── Steam.png
│   ├── Taiwan.png
│   ├── Telegram.png
│   ├── United_States.png
│   ├── YouTube.png
│   ├── bilibili_3.png
│   ├── claude.png
│   ├── kanlixiang.png
│   └── sanlianzhongdu.png
├── Module/
│   ├── adblock.sgmodule
│   ├── kanlixiang.sgmodule
│   ├── news.redirect.aioneas.sgmodule
│   ├── sanlianzhongdu.sgmodule
│   ├── youtube.aioneas.hide-shorts.sgmodule
│   ├── youtube.aioneas.stable.sgmodule
│   └── youtube.sgmodule
├── Script/
│   ├── kanlixiang_vip.js
│   ├── klx_profile_clean.js
│   ├── sanlianzhongdu.vip.js
│   └── youtube.response.js
└── README.md

## Features

- Optimized for iOS Surge
- Lightweight Rewrite and MITM
- GitHub-hosted remote config
- Focused on daily-use apps and services
- Cleaner structure for long-term maintenance
- Supports independent remote modules
- Added Speedtest traffic redirection group and rule set
- Added dedicated Claude policy group and rule set
- Added self-hosted Claude icon for stable remote loading
- All policy group icons are now self-hosted under `Icon/` for long-term stability
- Updated adblock module with Jooan compatibility fixes
- Added 看理想 (Vistopia) VIP unlock + profile ad cleanup module with self-hosted scripts
- Added 三联中读 (Lifeweek) VIP unlock + ad removal module with self-hosted scripts
- Added 新闻网站智能重定向模块 for 财新 / FT中文 / FT / WSJ / Bloomberg / Economist / NYT / 端传媒
- All module scripts are self-hosted under `Script/` — no external script dependencies
- Added YouTube module variants: original-compatible module, Aioneas stable module, and hide-Shorts module
- The Aioneas hide-Shorts module now also hides the bottom create/upload (+) button

## Current Focus

This configuration is tuned around the following daily-use ecosystem:

- Apple official apps and services
- WeChat / QQ / Telegram
- YouTube / Netflix / PayPal
- OpenAI / ChatGPT / Claude / GitHub
- AMap / 12306 / Tesla / Mi Home
- Baidu Netdisk / Infuse / WeRead / iReader

## Notes

- Rule sets are kept intentionally stable.
- Rewrite rules are trimmed to reduce side effects.
- MITM scope is minimized for better reliability.
- Speedtest traffic can be switched between DIRECT and proxy groups.
- Claude traffic is split into an independent policy group via blackmatrix7 rule set.
- The Claude icon is now self-hosted in this repository to avoid external icon library misses.
- All icons referenced in the config are self-hosted under `Icon/` — no external icon dependencies.
- 新闻网站智能重定向模块当前走 `URL Rewrite 302` 方案，适合作为 Surge/Sugar 模块替代原油猴自动跳转脚本；当前仅保留自动模式，不包含油猴版手动按钮/菜单配置界面。
- This repository is meant to be a personal long-term remote config source.

## Usage

Import the raw URL into Surge as a remote configuration source, or import individual modules separately.

## Claude 分流说明

- 新增独立 `Claude` 策略组，默认可在 `Proxies / HK / JP / SG / TW / US` 之间手动选择。
- 规则集使用 `blackmatrix7/ios_rule_script` 的 `rule/Surge/Claude/Claude.list`。
- 当前匹配范围主要覆盖：`claude.ai`、`anthropic.com` 与 `cdn.usefathom.com`。
- 由于 Qure 图标库当前没有 Claude 专用图标，本仓库已自托管 `Icon/claude.png`，避免远程图标失效。
- 所有策略组图标均已从 Qure 外链迁移到本仓库 `Icon/` 目录下自托管，彻底消除外部图标库依赖。
- README 已同步说明这次变更，后续你直接拉公开配置就能拿到该分流组。

## 新闻网站智能重定向模块说明

- 模块文件：`Module/news.redirect.aioneas.sgmodule`
- Raw URL：`https://raw.githubusercontent.com/Aioneas/Surge/main/Module/news.redirect.aioneas.sgmodule`
- 支持站点：财新、FT中文、FT英文、WSJ、Bloomberg、Economist、NYT、端传媒
- FT中文当前已兼容 `www.ftchinese.com` / `ftchinese.com` / `m.ftchinese.com` 下的 `story/<id>` 与 `interactive/<id>` 页面
- 技术实现：使用 Surge `URL Rewrite 302` 做自动跳转，替代原本运行在油猴/Tampermonkey 中的 3 份新闻跳转脚本
- 当前镜像目标统一使用 `https://best.viatl.de`
- 与油猴增强版的差异：当前模块版仅保留“自动跳转”能力，不包含菜单配置、手动跳转按钮、按站点切换模式等前端交互功能
- 适用场景：更适合放进 Surge / Sugar 作为长期稳定可远程安装的模块

## 如何替换订阅地址

下载或打开 `Conf/surge.conf`，找到以下内容：

```text
policy-path=请替换为你自己的Surge订阅地址
```

将 `请替换为你自己的Surge订阅地址` 替换为你的机场订阅 URL（Surge 格式），保存后重新导入即可。

## Maintainer

**Aioneas**


