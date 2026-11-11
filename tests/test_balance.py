import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from balance import boss_hp, boss_reward, prestige_requirement, validate_balance


class BalanceTests(unittest.TestCase):
    def test_boss_hp_keeps_scaling_after_301(self):
        self.assertGreater(boss_hp(301), boss_hp(300))
        self.assertGreater(boss_hp(1000), boss_hp(500))

    def test_boss_reward_tracks_hp(self):
        self.assertEqual(boss_reward(12), round(boss_hp(12) * 1.5))

    def test_prestige_requirements(self):
        self.assertEqual([prestige_requirement(i) for i in range(4)],
                         [1_000_000, 1_500_000, 2_000_000, 2_500_000])

    def test_all_balance_invariants(self):
        validate_balance()


if __name__ == "__main__":
    unittest.main()
