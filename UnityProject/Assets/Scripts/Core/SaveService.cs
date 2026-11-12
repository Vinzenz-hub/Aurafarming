using System;
using UnityEngine;

namespace AuraFarming
{
    public static class SaveService
    {
        private const string SaveKey = "aurafarming.unity.save.v1";

        public static GameState Load()
        {
            try
            {
                string json = PlayerPrefs.GetString(SaveKey, string.Empty);
                if (string.IsNullOrWhiteSpace(json)) return GameState.NewGame();
                GameState state = JsonUtility.FromJson<GameState>(json);
                if (state == null) return GameState.NewGame();
                state.Normalize();
                return state;
            }
            catch (Exception exception)
            {
                Debug.LogError("Save could not be loaded: " + exception.Message);
                return GameState.NewGame();
            }
        }

        public static void Save(GameState state)
        {
            if (state == null) return;
            state.lastSavedUnixMs = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            PlayerPrefs.SetString(SaveKey, JsonUtility.ToJson(state));
            PlayerPrefs.Save();
        }

        // Import a JSON export of localStorage["aura-farming-save-v3"].
        // Import is explicit; the old browser save is never overwritten automatically.
        public static bool TryImportLegacy(string json, out GameState imported, out string error)
        {
            imported = null;
            error = null;
            if (string.IsNullOrWhiteSpace(json))
            {
                error = "The import text is empty.";
                return false;
            }

            try
            {
                LegacySaveData legacy = JsonUtility.FromJson<LegacySaveData>(json);
                if (legacy == null) throw new FormatException("No save data found.");
                imported = new GameState
                {
                    aura = legacy.aura,
                    level = Math.Max(1, legacy.level),
                    power = Math.Max(1, legacy.power),
                    multiplier = Math.Max(1, legacy.multiplier),
                    combo = Math.Max(1, legacy.combo),
                    bossIndex = Math.Max(0, legacy.bossIndex),
                    bossStreak = Math.Max(0, legacy.bossStreak),
                    crystals = Math.Max(0, legacy.crystals),
                    stars = Math.Max(0, legacy.stars),
                    prestige = Math.Max(0, legacy.prestige),
                    skillPoints = Math.Max(0, legacy.skillPoints),
                    powerUpgradeLevel = legacy.upgradeLevels != null ? Math.Max(0, legacy.upgradeLevels.power) : 0
                };
                imported.Normalize();
                return true;
            }
            catch (Exception exception)
            {
                error = exception.Message;
                imported = null;
                return false;
            }
        }
    }
}