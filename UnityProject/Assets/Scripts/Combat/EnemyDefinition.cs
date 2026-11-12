using UnityEngine;

namespace AuraFarming
{
    [CreateAssetMenu(menuName = "Aura Farming/Enemy Definition", fileName = "EnemyDefinition")]
    public sealed class EnemyDefinition : ScriptableObject
    {
        public string displayName = "Voidling";
        [TextArea] public string description;
        public Color primaryColor = new Color(0.35f, 0.95f, 0.5f);
        public Color energyColor = new Color(0.25f, 1f, 0.8f);
        public float scale = 1f;
        public bool isBoss;
    }
}