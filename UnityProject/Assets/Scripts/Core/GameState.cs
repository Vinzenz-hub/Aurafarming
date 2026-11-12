using System;
using UnityEngine;

namespace AuraFarming
{
    [Serializable]
    public sealed class GameState
    {
        public int schemaVersion = 1;
        public double aura;
        public int level = 1;
        public double power = 1;
        public double multiplier = 1;
        public double combo = 1;
        public double comboBoost = 0.08;
        public int bossIndex;
        public int bossStreak;
        public double crystals;
        public double stars;
        public int prestige;
        public int skillPoints;
        public int powerUpgradeLevel;
        public long lastSavedUnixMs;

        public static GameState NewGame()
        {
            return new GameState { aura = 0, level = 1, power = 1, multiplier = 1, combo = 1 };
        }

        public void Normalize()
        {
            level = Mathf.Max(1, level);
            bossIndex = Mathf.Max(0, bossIndex);
            prestige = Mathf.Max(0, prestige);
            power = Math.Max(1, power);
            multiplier = Math.Max(1, multiplier);
            combo = Math.Max(1, combo);
            aura = Math.Max(0, aura);
        }
    }

    [Serializable]
    public sealed class LegacySaveData
    {
        public double aura;
        public int level = 1;
        public double power = 1;
        public double multiplier = 1;
        public double combo = 1;
        public int bossIndex;
        public int bossStreak;
        public double crystals;
        public double stars;
        public int prestige;
        public int skillPoints;
        public int autoAura;
        public LegacyUpgradeLevels upgradeLevels;
    }

    [Serializable]
    public sealed class LegacyUpgradeLevels
    {
        public int power;
        public int multiplier;
        public int combo;
        public int auto;
    }
}