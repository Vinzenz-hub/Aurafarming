using UnityEngine;

namespace AuraFarming
{
    public sealed class EnemyActor : MonoBehaviour
    {
        public string DisplayName { get; private set; }
        public bool IsBoss { get; private set; }
        public double MaxHealth { get; private set; }
        public double Health { get; private set; }
        public float IdlePhase { get; private set; }

        private Vector3 basePosition;
        private Vector3 baseScale;
        private Renderer[] renderers;
        private MaterialPropertyBlock propertyBlock;

        public void Initialize(string displayName, bool isBoss, double maxHealth, Color bodyColor, Color energyColor)
        {
            DisplayName = displayName;
            IsBoss = isBoss;
            MaxHealth = System.Math.Max(1, maxHealth);
            Health = MaxHealth;
            basePosition = transform.position;
            baseScale = transform.localScale;
            renderers = GetComponentsInChildren<Renderer>();
            propertyBlock = new MaterialPropertyBlock();
            IdlePhase = Random.value * 6.28f;
        }

        public double ApplyDamage(double amount)
        {
            double dealt = System.Math.Min(Health, System.Math.Max(0, amount));
            Health = System.Math.Max(0, Health - dealt);
            return dealt;
        }

        private void Update()
        {
            float bob = Mathf.Sin(Time.time * (IsBoss ? 1.15f : 2.1f) + IdlePhase) * (IsBoss ? 0.12f : 0.045f);
            transform.position = basePosition + Vector3.up * bob;
            float pulse = 1f + Mathf.Sin(Time.time * 2.2f + IdlePhase) * (IsBoss ? 0.018f : 0.035f);
            transform.localScale = baseScale * pulse;
        }

        public void PlayHit()
        {
            StopAllCoroutines();
            StartCoroutine(HitFlash());
        }

        private System.Collections.IEnumerator HitFlash()
        {
            foreach (Renderer renderer in renderers)
            {
                renderer.GetPropertyBlock(propertyBlock);
                propertyBlock.SetColor("_EmissionColor", Color.white * 2.5f);
                renderer.SetPropertyBlock(propertyBlock);
            }
            yield return new WaitForSeconds(0.09f);
            foreach (Renderer renderer in renderers)
            {
                renderer.GetPropertyBlock(propertyBlock);
                propertyBlock.SetColor("_EmissionColor", Color.black);
                renderer.SetPropertyBlock(propertyBlock);
            }
        }
    }
}