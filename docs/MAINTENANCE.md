# Maintenance Guide

This repository is the primary source for Aioneas network-routing rules and Surge modules.

## Repository role

- `Conf/` keeps public Surge profiles with subscription placeholders only.
- `Module/` keeps Surge modules and the public install targets used by README links.
- `List/` is the canonical rule-list source used by Surge and downstream adapters such as `Aioneas/OpenClash`.
- `Script/` keeps self-hosted JavaScript used by modules.
- `loon/` and `quantumultx/` are compatibility outputs/adaptations, not the canonical source.
- `tools/` contains generators and maintenance scripts.

## Change workflow

1. Update the canonical source first.
   - Rule content changes usually start in `List/`.
   - Surge module behavior changes usually start in `Module/` and `Script/`.
   - External ad-filter refreshes should be generated through `tools/build_surge_adlists.py`.
2. Regenerate derived outputs when applicable.
3. Check README install links if a module path or filename changes.
4. If a rule group is consumed by `Aioneas/OpenClash`, update that repository after the Surge-side source is stable.
5. Commit generated files together with the source change so public raw links stay consistent.

## Adding a new policy group

When adding a new service group, update all relevant places together:

- `Conf/surge.conf`
- `Conf/surge-mac.conf` when applicable
- `List/<service>.list`
- `List/<service>.clash.yaml` if OpenClash consumes it
- README policy-group table
- downstream adapters such as `Aioneas/OpenClash` when the group should exist there too

## External ad-filter generation

Run:

```bash
python3 tools/build_surge_adlists.py
```

The generator extracts only network-layer domain rules that can be represented safely in Surge. It intentionally skips browser-extension-only capabilities such as element hiding, scriptlets, parameter removal, and complex regular-expression filters.

Generated files include:

- `List/*.block.domainset`
- `List/*.allow.domainset`
- `Module/*.sgmodule`
- `List/manifest.json`
- the external ad-filter table in `README.md`

## Compatibility notes

Treat Surge as the source of truth. Loon, Quantumult X, and OpenClash adaptations should be updated from the Surge-side rule intent rather than maintained as independent divergent rule sets.
