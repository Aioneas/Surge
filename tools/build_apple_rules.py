#!/usr/bin/env python3
from __future__ import annotations

import urllib.request
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATCH_PATH = ROOT / 'List' / 'apple.patch.list'
SURGE_OUT = ROOT / 'List' / 'apple.list'
CLASH_OUT = ROOT / 'List' / 'apple.clash.yaml'

UPSTREAM_SURGE = 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Apple/Apple.list'
UPSTREAM_CLASH = 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Apple/Apple.yaml'


def fetch_text(url: str) -> str:
    req = urllib.request.Request(url, headers={'User-Agent': 'Minis/AppleRulesBuilder'})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read().decode('utf-8')


def load_patch_rules() -> list[str]:
    rules: list[str] = []
    for line in PATCH_PATH.read_text(encoding='utf-8').splitlines():
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        rules.append(line)
    return rules


def parse_surge_rules(text: str) -> list[str]:
    rules: list[str] = []
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        rules.append(line)
    return rules


def parse_clash_rules(text: str) -> list[str]:
    rules: list[str] = []
    in_payload = False
    for raw in text.splitlines():
        line = raw.rstrip()
        if line.strip() == 'payload:':
            in_payload = True
            continue
        if not in_payload:
            continue
        s = line.strip()
        if not s or s.startswith('#'):
            continue
        if s.startswith('- '):
            rules.append(s[2:].strip())
    return rules


def uniq_keep_first(items: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for item in items:
        if item in seen:
            continue
        seen.add(item)
        out.append(item)
    return out


def write_surge(rules: list[str]) -> None:
    updated = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    lines = [
        '# NAME: Apple',
        '# AUTHOR: Minis',
        '# REPO: https://github.com/Aioneas/Surge',
        f'# UPDATED: {updated}',
        '# SOURCE: upstream blackmatrix7 Apple.list + local apple.patch.list',
        '# NOTES: self-hosted Apple rule for Surge / OpenClash shared maintenance',
        '#',
    ]
    lines.extend(rules)
    SURGE_OUT.write_text('\n'.join(lines) + '\n', encoding='utf-8')


def write_clash(rules: list[str]) -> None:
    updated = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    lines = [
        '# NAME: Apple',
        '# AUTHOR: Minis',
        '# REPO: https://github.com/Aioneas/Surge',
        f'# UPDATED: {updated}',
        '# SOURCE: upstream blackmatrix7 Apple.yaml + local apple.patch.list',
        '# NOTES: self-hosted Apple rule for OpenClash provider',
        'payload:',
    ]
    lines.extend(f'  - {rule}' for rule in rules)
    CLASH_OUT.write_text('\n'.join(lines) + '\n', encoding='utf-8')


def main() -> None:
    patch_rules = load_patch_rules()
    surge_rules = parse_surge_rules(fetch_text(UPSTREAM_SURGE))
    clash_rules = parse_clash_rules(fetch_text(UPSTREAM_CLASH))

    merged_surge = uniq_keep_first(patch_rules + surge_rules)
    merged_clash = uniq_keep_first(patch_rules + clash_rules)

    write_surge(merged_surge)
    write_clash(merged_clash)

    print(f'patch_rules={len(patch_rules)}')
    print(f'surge_rules={len(merged_surge)} -> {SURGE_OUT}')
    print(f'clash_rules={len(merged_clash)} -> {CLASH_OUT}')


if __name__ == '__main__':
    main()
