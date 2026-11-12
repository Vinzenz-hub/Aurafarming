using System;
using UnityEngine;

namespace AuraFarming
{
    public static class ProgressionSystem
    {
        public const int BossEveryLevels = 10;
        public const double BaseEnemyHp = 120d;
        public const double HpGrowth = 1.45d;

        public static bool IsBossLevel(int level) => Math.Max(1, level) % BossEveryLevels == 0;

        public static double GetBossHp(int defeatedIndex)
        {
            double exponent = Math.Max(0, defeatedIndex) * Math.Log(HpGrowth);
            return Math.Max(BaseEnemyHp, Math.Round(Math.Exp(Math.Min(Math.Log(1e300), Math.Log(BaseEnemyHp) + exponent))));
        }

        public static double GetEnemyHp(int level)
        {
            double hp = GetBossHp(Math.Max(0, level - 1)) * 0.55d;
            if (TraitForLevel(level) == "resilient") hp *= 1.3d;
            return Math.Max(1, Math.Round(hp));
        }

        public static string TraitForLevel(int level)
        {
            string[] traits = { "balanced", "evasive", "volatile", "armored", "drainer", "swift", "resilient", "unstable", "bounty" };
            return traits[(Math.Max(1, level) - 1) % traits.Length];
        }

        public static string EnemyNameForLevel(int level)
        {
            string[] names = { "Aura-Schatten", "Kristallling", "Flammenling", "Frostling", "Voidling", "Sturmgeist", "Wildwuchs", "Abyss-Kriecher", "Sternenwächter" };
            return names[(Math.Max(1, level) - 1) % names.Length];
        }

        public static string BossNameForIndex(int index)
        {
            string[] names = { "Aura-Schatten", "Flammenbestie", "Frost-Wächter", "Wildwuchs", "Sturmgeist", "Kristallkoloss", "Abyss-Wächter", "Sonnenbestie", "Void-Jäger", "Voidlord" };
            return names[Math.Max(0, index) % names.Length];
        }

        public static double RewardFor(int level, bool isBoss, double maxHp)
        {
            return Math.Round(maxHp * (isBoss ? 1.5d : 1.1d));
        }

        public static int GetBossTime(int bossIndex)
        {
            int i = Math.Max(0, bossIndex);
            int baseTime = i < 2 ? 30 + i * 2 : i < 10 ? 34 + (i - 2) * 2 : 48;
            return baseTime + Math.Min(30, (i / 10) * 2);
        }
    }
}