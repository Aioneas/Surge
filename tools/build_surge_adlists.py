#!/usr/bin/env python3
from __future__ import annotations

import ipaddress
import json
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin

ROOT = Path(__file__).resolve().parents[1]
LIST_DIR = ROOT / "List"
MODULE_DIR = ROOT / "Module"
README_PATH = ROOT / "README.md"
RAW_BASE = "https://raw.githubusercontent.com/Aioneas/Surge/main"
AD_ICON = "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Advertising.png"
USER_AGENT = "Aioneas-Surge-List-Builder/1.0 (+https://github.com/Aioneas/Surge)"
PURE_HOST_RULE_RE = re.compile(r"^\|\|([0-9A-Za-z*._-]+)(?:\^\|?|\|)?$")
SAFE_IGNORED_BLOCK_OPTIONS = {"third-party", "3p", "important", "match-case"}
SAFE_IGNORED_ALLOW_OPTIONS: set[str] = set()

SPECS = [
    {
        "slug": "easylist",
        "display_name": "EasyList（Surge适配）",
        "author": "EasyList + Aioneas",
        "source_name": "EasyList",
        "desc": "将 EasyList 中可稳定映射到 Surge 的域名级广告规则独立拆分为模块。说明：Surge 为网络层拦截，不包含浏览器元素隐藏 / 脚本替换等扩展专属能力。",
        "urls": [
            "https://raw.githubusercontent.com/easylist/easylist/master/easylist/easylist_adservers.txt",
            "https://raw.githubusercontent.com/easylist/easylist/master/easylist/easylist_adservers_popup.txt",
            "https://raw.githubusercontent.com/easylist/easylist/master/easylist/easylist_thirdparty.txt",
            "https://raw.githubusercontent.com/easylist/easylist/master/easylist/easylist_thirdparty_popup.txt",
            "https://raw.githubusercontent.com/easylist/easylist/master/easylist/easylist_allowlist.txt",
            "https://raw.githubusercontent.com/easylist/easylist/master/easylist/easylist_allowlist_dimensions.txt",
            "https://raw.githubusercontent.com/easylist/easylist/master/easylist/easylist_allowlist_popup.txt",
        ],
        "expand_includes": False,
        "module_filename": "easylist.sgmodule",
    },
    {
        "slug": "adguard-mobile-ads",
        "display_name": "AdGuard Mobile Ads（Surge适配）",
        "author": "AdGuard Team + Aioneas",
        "source_name": "AdGuard/uBO – Mobile Ads",
        "desc": "将 AdGuard/uBO – Mobile Ads 中可稳定映射到 Surge 的移动广告网络域名规则独立拆分为模块。说明：Surge 为网络层拦截，不包含浏览器元素隐藏 / 脚本替换等扩展专属能力。",
        "urls": [
            "https://filters.adtidy.org/extension/ublock/filters/11.txt",
        ],
        "expand_includes": False,
        "module_filename": "adguard.mobile-ads.sgmodule",
    },
    {
        "slug": "ublock-filters",
        "display_name": "uBlock filters（Surge适配）",
        "author": "uBlockOrigin/uAssets + Aioneas",
        "source_name": "uBlock filters – Ads, trackers, and more",
        "desc": "将 uBlock filters – Ads, trackers, and more 中可稳定映射到 Surge 的网络层域名规则独立拆分为模块。说明：Surge 为网络层拦截，不包含浏览器元素隐藏 / 脚本替换 / 参数移除等扩展专属能力。",
        "urls": [
            "https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/filters.txt",
        ],
        "expand_includes": True,
        "module_filename": "ublock.filters.sgmodule",
    },
    {
        "slug": "easyprivacy",
        "display_name": "EasyPrivacy（Surge适配）",
        "author": "EasyList + Aioneas",
        "source_name": "EasyPrivacy",
        "desc": "将 EasyPrivacy 中可稳定映射到 Surge 的追踪 / 统计域名规则独立拆分为模块。说明：Surge 为网络层拦截，不包含浏览器元素隐藏 / 脚本替换 / 参数移除等扩展专属能力。",
        "urls": [
            "https://raw.githubusercontent.com/easylist/easylist/master/easyprivacy/easyprivacy_trackingservers.txt",
            "https://raw.githubusercontent.com/easylist/easylist/master/easyprivacy/easyprivacy_trackingservers_general.txt",
            "https://raw.githubusercontent.com/easylist/easylist/master/easyprivacy/easyprivacy_trackingservers_international.txt",
            "https://raw.githubusercontent.com/easylist/easylist/master/easyprivacy/easyprivacy_trackingservers_notifications.txt",
            "https://raw.githubusercontent.com/easylist/easylist/master/easyprivacy/easyprivacy_trackingservers_admiral.txt",
            "https://raw.githubusercontent.com/easylist/easylist/master/easyprivacy/easyprivacy_trackingservers_mining.txt",
            "https://raw.githubusercontent.com/easylist/easylist/master/easyprivacy/easyprivacy_trackingservers_thirdparty.txt",
            "https://raw.githubusercontent.com/easylist/easylist/master/easyprivacy/easyprivacy_allowlist.txt",
            "https://raw.githubusercontent.com/easylist/easylist/master/easyprivacy/easyprivacy_allowlist_international.txt",
        ],
        "expand_includes": False,
        "module_filename": "easyprivacy.sgmodule",
    },
]

_cache: dict[str, str] = {}


def fetch_text(url: str) -> str:
    if url not in _cache:
        proc = subprocess.run(
            [
                "curl",
                "-LfsS",
                "--retry",
                "3",
                "--retry-delay",
                "2",
                "--retry-all-errors",
                "-A",
                USER_AGENT,
                url,
            ],
            capture_output=True,
            text=True,
            timeout=240,
            check=False,
        )
        if proc.returncode != 0:
            raise RuntimeError(f"failed to fetch {url}: {proc.stderr.strip()}")
        _cache[url] = proc.stdout
    return _cache[url]


def expand_uassets(url: str, seen: set[str] | None = None) -> list[str]:
    if seen is None:
        seen = set()
    if url in seen:
        return []
    seen.add(url)
    text = fetch_text(url)
    base = url.rsplit("/", 1)[0] + "/"
    lines: list[str] = []
    for raw_line in text.splitlines():
        line = raw_line.rstrip("\n")
        if line.startswith("!#include "):
            include_path = line.split(None, 1)[1].strip()
            include_url = urljoin(base, include_path)
            lines.extend(expand_uassets(include_url, seen))
        else:
            lines.append(line)
    return lines


def normalize_host(host: str) -> str | None:
    host = host.strip().lower().strip(".")
    if host.startswith("*."):
        host = host[2:]
    elif host.startswith("."):
        host = host[1:]
    if not host or "*" in host or ".." in host:
        return None
    if host.count(".") < 1:
        return None
    if any(ch not in "abcdefghijklmnopqrstuvwxyz0123456789.-" for ch in host):
        return None
    labels = host.split(".")
    if any(not label or label.startswith("-") or label.endswith("-") for label in labels):
        return None
    try:
        ipaddress.ip_address(host)
        return None
    except ValueError:
        pass
    return "." + host


def parse_host_rule(line: str) -> tuple[bool, str] | None:
    text = line.strip()
    if not text or text.startswith("!") or text.startswith("["):
        return None

    is_exception = False
    if text.startswith("@@"):
        is_exception = True
        text = text[2:]

    if "#" in text:
        return None
    if not text.startswith("||"):
        return None
    if text.startswith("|||"):
        return None
    if text.startswith("||/"):
        return None

    pattern, _, options = text.partition("$")
    option_set = {opt.strip().lower() for opt in options.split(",") if opt.strip()}
    if "badfilter" in option_set:
        is_exception = True

    effective_options = option_set - {"badfilter"}
    safe_options = SAFE_IGNORED_ALLOW_OPTIONS if is_exception else SAFE_IGNORED_BLOCK_OPTIONS
    if effective_options - safe_options:
        return None

    match = PURE_HOST_RULE_RE.match(pattern)
    if not match:
        return None

    host = normalize_host(match.group(1))
    if host is None:
        return None
    return is_exception, host


def collect_domains(spec: dict) -> tuple[set[str], set[str]]:
    block: set[str] = set()
    allow: set[str] = set()
    for url in spec["urls"]:
        if spec.get("expand_includes"):
            lines = expand_uassets(url)
        else:
            lines = fetch_text(url).splitlines()
        for line in lines:
            parsed = parse_host_rule(line)
            if parsed is None:
                continue
            is_exception, host = parsed
            if is_exception:
                allow.add(host)
            else:
                block.add(host)
    block -= allow
    return block, allow


def write_domainset(path: Path, items: set[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    text = "\n".join(sorted(items))
    if text:
        text += "\n"
    path.write_text(text, encoding="utf-8")


def module_text(spec: dict, block_count: int, allow_count: int) -> str:
    slug = spec["slug"]
    lines = [
        f"#!name={spec['display_name']}@Aioneas",
        f"#!desc={spec['desc']}",
        f"#!author={spec['author']}",
        "#!homepage=https://github.com/Aioneas/Surge",
        f"#!icon={AD_ICON}",
        "#!category=Aioneas",
        "",
        "[Rule]",
        "# Auto-generated by tools/build_surge_adlists.py",
        f"# Block domains: {block_count}",
        f"# Allow domains: {allow_count}",
    ]
    if allow_count:
        lines.extend(
            [
                "# 仅在命中拦截域名且未命中放行域名时才 REJECT；未命中则继续走主配置的原始分流",
                f"AND,((DOMAIN-SET,{RAW_BASE}/List/{slug}.block.domainset,extended-matching),(NOT,((DOMAIN-SET,{RAW_BASE}/List/{slug}.allow.domainset,extended-matching)))),REJECT",
            ]
        )
    else:
        lines.append(
            f"DOMAIN-SET,{RAW_BASE}/List/{slug}.block.domainset,REJECT,extended-matching"
        )
    return "\n".join(lines) + "\n"


def update_readme_table(manifest: dict) -> None:
    start_marker = "<!-- external-ad-filter-table:start -->"
    end_marker = "<!-- external-ad-filter-table:end -->"
    readme = README_PATH.read_text(encoding="utf-8")
    table_lines = [start_marker]
    for item in manifest["items"]:
        table_lines.append(
            f"| [`{Path(item['module']).name}`](./{item['module']}) | {item['source_name']} | "
            f"[Install]({RAW_BASE}/{item['module']}) | "
            f"{item['block_count']:,} 条拦截域名 / {item['allow_count']:,} 条放行域名 |"
        )
    table_lines.append(end_marker)
    replacement = "\n".join(table_lines)
    pattern = re.compile(
        rf"{re.escape(start_marker)}.*?{re.escape(end_marker)}",
        re.S,
    )
    updated = pattern.sub(replacement, readme)
    README_PATH.write_text(updated, encoding="utf-8")


def main() -> int:
    LIST_DIR.mkdir(parents=True, exist_ok=True)
    MODULE_DIR.mkdir(parents=True, exist_ok=True)

    manifest = {
        "generated_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
        "generator": "tools/build_surge_adlists.py",
        "items": [],
    }

    for spec in SPECS:
        block, allow = collect_domains(spec)
        write_domainset(LIST_DIR / f"{spec['slug']}.block.domainset", block)
        write_domainset(LIST_DIR / f"{spec['slug']}.allow.domainset", allow)
        module_filename = spec["module_filename"]
        (MODULE_DIR / module_filename).write_text(
            module_text(spec, len(block), len(allow)),
            encoding="utf-8",
        )
        manifest["items"].append(
            {
                "slug": spec["slug"],
                "display_name": spec["display_name"],
                "source_name": spec["source_name"],
                "module": f"Module/{module_filename}",
                "block_count": len(block),
                "allow_count": len(allow),
                "sources": spec["urls"],
            }
        )
        print(f"{spec['slug']}: block={len(block)} allow={len(allow)}")

    (LIST_DIR / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    update_readme_table(manifest)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
