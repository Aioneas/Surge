#!/usr/bin/env python3
from __future__ import annotations

import urllib.request
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIST_DIR = ROOT / 'List'

RULES = [
    {'name':'Apple','slug':'apple','surge':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Apple/Apple.list','clash':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Apple/Apple.yaml','patch':LIST_DIR/'apple.patch.list'},
    {'name':'YouTube','slug':'youtube','surge':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/YouTube/YouTube.list','clash':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/YouTube/YouTube.yaml'},
    {'name':'Disney','slug':'disney','surge':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Disney/Disney.list','clash':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Disney/Disney.yaml'},
    {'name':'HBOMax','slug':'hbomax','surge':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/HBOUSA/HBOUSA.list','clash':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/HBOUSA/HBOUSA.yaml'},
    {'name':'Netflix','slug':'netflix','surge':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Netflix/Netflix.list','clash':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Netflix/Netflix.yaml'},
    {'name':'Bahamut','slug':'bahamut','surge':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Bahamut/Bahamut.list','clash':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Bahamut/Bahamut.yaml'},
    {'name':'BiliBili','slug':'bilibili','surge':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/BiliBili/BiliBili.list','clash':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/BiliBili/BiliBili.yaml'},
    {'name':'Spotify','slug':'spotify','surge':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Spotify/Spotify.list','clash':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Spotify/Spotify.yaml'},
    {'name':'Steam','slug':'steam','surge':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Steam/Steam.list','clash':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Steam/Steam.yaml'},
    {'name':'Telegram','slug':'telegram','surge':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Telegram/Telegram.list','clash':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Telegram/Telegram.yaml'},
    {'name':'Google','slug':'google','surge':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Google/Google.list','clash':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Google/Google.yaml'},
    {'name':'Microsoft','slug':'microsoft','surge':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Microsoft/Microsoft.list','clash':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Microsoft/Microsoft.yaml'},
    {'name':'GitHub','slug':'github','surge':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/GitHub/GitHub.list','clash':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GitHub/GitHub.yaml'},
    {'name':'OpenAI','slug':'openai','surge':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/OpenAI/OpenAI.list','clash':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/OpenAI/OpenAI.yaml'},
    {'name':'Claude','slug':'claude','surge':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Claude/Claude.list','clash':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Claude/Claude.yaml','patch':LIST_DIR/'claude.patch.list'},
    {'name':'PayPal','slug':'paypal','surge':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/PayPal/PayPal.list','clash':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/PayPal/PayPal.yaml'},
    {'name':'Speedtest','slug':'speedtest','surge':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Speedtest/Speedtest.list','clash':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Speedtest/Speedtest.yaml'},
    {'name':'Global','slug':'global','surge':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Global/Global.list','clash':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Global/Global.yaml'},
    {'name':'Pixiv','slug':'pixiv','surge':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Pixiv/Pixiv.list','clash':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Pixiv/Pixiv.yaml'},
    {'name':'China','slug':'china','surge':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/China/China.list','clash':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/China/China.yaml'},
    {'name':'Lan','slug':'lan','surge':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Lan/Lan.list','clash':'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Lan/Lan.yaml'},
    {'name':'Link','slug':'link','local_surge':LIST_DIR/'link.list','clash_only':True},
]


def fetch_text(url: str) -> str:
    req = urllib.request.Request(url, headers={'User-Agent': 'Minis/RuleMirrorBuilder'})
    with urllib.request.urlopen(req, timeout=90) as resp:
        return resp.read().decode('utf-8')


def parse_surge_rules(text: str) -> list[str]:
    out = []
    for raw in text.splitlines():
        line = raw.strip()
        if not line or line.startswith('#'):
            continue
        out.append(line)
    return out


def parse_clash_rules(text: str) -> list[str]:
    out = []
    in_payload = False
    for raw in text.splitlines():
        line = raw.strip()
        if line == 'payload:':
            in_payload = True
            continue
        if not in_payload or not line or line.startswith('#'):
            continue
        if line.startswith('- '):
            out.append(line[2:].strip())
    return out


def load_patch_rules(path: Path | None) -> list[str]:
    if not path or not path.exists():
        return []
    return parse_surge_rules(path.read_text(encoding='utf-8'))


def uniq_keep_first(items: list[str]) -> list[str]:
    seen = set()
    out = []
    for item in items:
        if item in seen:
            continue
        seen.add(item)
        out.append(item)
    return out


def write_surge(name: str, slug: str, rules: list[str], source_note: str) -> None:
    updated = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    lines = [
        f'# NAME: {name}',
        '# AUTHOR: Minis',
        '# REPO: https://github.com/Aioneas/Surge',
        f'# UPDATED: {updated}',
        f'# SOURCE: {source_note}',
        '# NOTES: self-hosted rule mirror for Surge / OpenClash shared maintenance',
        '#',
        *rules,
        ''
    ]
    (LIST_DIR / f'{slug}.list').write_text('\n'.join(lines), encoding='utf-8')


def write_clash(name: str, slug: str, rules: list[str], source_note: str) -> None:
    updated = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    lines = [
        f'# NAME: {name}',
        '# AUTHOR: Minis',
        '# REPO: https://github.com/Aioneas/Surge',
        f'# UPDATED: {updated}',
        f'# SOURCE: {source_note}',
        '# NOTES: self-hosted rule mirror for OpenClash provider',
        'payload:',
        *[f'  - {rule}' for rule in rules],
        ''
    ]
    (LIST_DIR / f'{slug}.clash.yaml').write_text('\n'.join(lines), encoding='utf-8')


def main() -> None:
    for item in RULES:
        patch_rules = load_patch_rules(item.get('patch'))
        if item.get('local_surge'):
            surge_rules = parse_surge_rules(Path(item['local_surge']).read_text(encoding='utf-8'))
            clash_rules = surge_rules
            source_note = f'local {Path(item["local_surge"]).name}'
        else:
            surge_rules = parse_surge_rules(fetch_text(item['surge']))
            clash_rules = parse_clash_rules(fetch_text(item['clash']))
            source_note = f'upstream mirror + local patches ({item["slug"]})' if patch_rules else 'upstream mirror'
        merged_surge = uniq_keep_first(patch_rules + surge_rules)
        merged_clash = uniq_keep_first(patch_rules + clash_rules)
        if not item.get('clash_only'):
            write_surge(item['name'], item['slug'], merged_surge, source_note)
        write_clash(item['name'], item['slug'], merged_clash, source_note)
        print(f"{item['slug']}: surge={len(merged_surge)} clash={len(merged_clash)}")


if __name__ == '__main__':
    main()
