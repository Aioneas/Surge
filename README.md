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

- 去广告：`Module/adblock.sgmodule`
- 去广告 Raw URL：`https://raw.githubusercontent.com/Aioneas/Surge/main/Module/adblock.sgmodule`

## Structure

```text
Surge/
├── Conf/
│   └── surge.conf
└── Module/
    └── adblock.sgmodule
```

## Features

- Optimized for iOS Surge
- Lightweight Rewrite and MITM
- GitHub-hosted remote config
- Focused on daily-use apps and services
- Cleaner structure for long-term maintenance
- Supports independent remote modules
- Added Speedtest traffic redirection group and rule set
- Updated adblock module with Jooan compatibility fixes

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
- This repository is meant to be a personal long-term remote config source.

## Usage

Import the raw URL into Surge as a remote configuration source, or import individual modules separately.

## 如何替换订阅地址

下载或打开 `Conf/surge.conf`，找到以下内容：

```text
policy-path=请替换为你自己的Surge订阅地址
```

将 `请替换为你自己的Surge订阅地址` 替换为你的机场订阅 URL（Surge 格式），保存后重新导入即可。

## Maintainer

**Aioneas**
