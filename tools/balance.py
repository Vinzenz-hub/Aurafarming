#!/usr/bin/env python3
"""Aurafarming progression balance model and regression checks.

Run:
    python tools/balance.py
    python -m unittest discover -s tests -v

This tool mirrors the browser game's progression constants. Keep the constants
in sync with script.js when changing the balance.
"""
from __future__ import annotations

import argparse
import math
from dataclasses import dataclass

BOSS_BASE_HP = 120
BOSS_HP_GROWTH = 1.45
BOSS_REWARD_MULTIPLIER = 1.5
PRESTIGE_BASE = 500_000


def boss_hp(index: int) -> int:
    """Return boss HP without the old hard plateau at boss 301."""
    index = max(0, int(index))
    log_hp = math.log(BOSS_BASE_HP) + index * math.log(BOSS_HP_GROWTH)
    return max(BOSS_BASE_HP, round(math.exp(min(math.log(1e300), log_hp))))


def boss_reward(index: int) -> int:
    return round(boss_hp(index) * BOSS_REWARD_MULTIPLIER)


def prestige_requirement(current_prestige: int) -> int:
    """Aura required for the next prestige: 1.0m, 1.5m, 2.0m, ..."""
    return (max(0, int(current_prestige)) + 2) * PRESTIGE_BASE


@dataclass(frozen=True)
class UpgradeCurve:
    name: str
    base_cost: int
    growth: float

    def cost(self, level: int) -> int:
        return math.ceil(self.base_cost * self.growth ** max(0, level))


UPGRADES = (
    UpgradeCurve("Power", 25, 1.55),
    UpgradeCurve("Aura multiplier", 300, 2.1),
    UpgradeCurve("Combo", 75, 1.8),
    UpgradeCurve("Auto aura", 150, 2.0),
)


def build_report() -> str:
    lines = [
        "AURAFARMING · BALANCE REPORT",
        f"Boss HP growth: x{BOSS_HP_GROWTH:.2f} per boss",
        "Boss rewards: 1.5x boss base HP (before bonuses)",
        "",
        "Boss progression:",
        "Boss | HP | Base aura reward",
        "-----|----:|-----------------:",
    ]
    for index in (0, 1, 4, 9, 19, 49, 99, 299, 300, 301, 500, 1000, 1700):
        lines.append(f"{index + 1:>4} | {boss_hp(index):>12,} | {boss_reward(index):>17,}")
    lines.extend(("", "Prestige thresholds:"))
    for prestige in range(5):
        lines.append(f"Prestige {prestige} → {prestige_requirement(prestige):,} Aura")
    lines.extend(("", "Upgrade costs (next levels):"))
    for upgrade in UPGRADES:
        costs = ", ".join(f"L{level}: {upgrade.cost(level):,}" for level in (0, 1, 2, 5, 10))
        lines.append(f"{upgrade.name}: {costs}")
    lines.extend(("", "Checks: boss HP grows past boss 301; values stay finite; prestige thresholds rise by 500,000 Aura."))
    return "\n".join(lines)


def validate_balance() -> None:
    checkpoints = (0, 1, 19, 99, 299, 300, 301, 500, 1000, 1700)
    values = [boss_hp(index) for index in checkpoints]
    assert all(value > 0 and math.isfinite(value) for value in values)
    assert all(right > left for left, right in zip(values, values[1:]))
    assert boss_hp(301) > boss_hp(300), "Boss HP must not plateau at boss 301"
    assert prestige_requirement(0) == 1_000_000
    assert prestige_requirement(1) == 1_500_000
    assert all(
        prestige_requirement(level + 1) - prestige_requirement(level) == PRESTIGE_BASE
        for level in range(10)
    )
    for upgrade in UPGRADES:
        assert all(upgrade.cost(level + 1) > upgrade.cost(level) for level in range(20))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="run balance assertions")
    args = parser.parse_args()
    validate_balance()
    print(build_report())
    if args.check:
        print("\nPASS: all balance checks passed")
