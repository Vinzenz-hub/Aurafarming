# Aurafarming balance tooling

The browser game remains JavaScript/HTML/CSS for GitHub Pages. Python is used as
developer tooling to model progression, print balance tables, and run regression
checks before publishing game changes.

## Run locally

```bash
python tools/balance.py
python tools/balance.py --check
python -m unittest discover -s tests -v
```

Keep `BOSS_BASE_HP`, `BOSS_HP_GROWTH`, reward scaling, prestige requirements,
and upgrade curves synchronized with `script.js` when tuning progression.

The current boss HP curve grows by 1.45 per boss and uses logarithmic clamping
to avoid floating-point overflow. Prestige requirements remain 1,000,000 Aura
for the first prestige and increase by 500,000 Aura each time.
