# Surge

Personal Sugar / Surge configuration for iOS.

## Remote Config

### Raw URL

```text
https://raw.githubusercontent.com/Aioneas/Surge/main/Conf/Sugar.conf
```

### GitHub Path

```text
https://github.com/Aioneas/Surge/tree/main/Conf
```

## Structure

```text
Surge/
└── Conf/
    └── Sugar.conf
```

## Features

- Optimized for iOS Sugar 5
- Lightweight Rewrite and MITM
- GitHub-hosted remote config
- Focused on daily-use apps and services
- Cleaner structure for long-term maintenance

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
- This repository is meant to be a personal long-term remote config source.

## Usage

Import the raw URL into Sugar as a remote configuration source.

## 如何替换订阅地址

下载或打开 `Conf/Sugar.conf`，找到以下内容：

```text
policy-path=这里替换成你的订阅地址
```

将 `这里替换成你的订阅地址` 替换为你的机场订阅 URL（Surge 格式），保存后重新导入即可。

## Maintainer

**Aioneas**
