using System;
using UnityEngine;

namespace AuraFarming
{
    public sealed class CombatSystem : MonoBehaviour
    {
        [SerializeField] private Camera combatCamera;
        [SerializeField] private Transform critMarker;
        [SerializeField] private float critRadiusPixels = 76f;
        [SerializeField] private LayerMask enemyLayer = ~0;

        public GameState State { get; private set; }
        public EnemyActor CurrentEnemy { get; private set; }
        public bool LastHitWasCritical { get; private set; }
        public double LastDamage { get; private set; }
        public event Action StateChanged;
        public event Action<EnemyActor> EnemyDefeated;

        private float comboDecayTimer;

        public void Initialize(GameState state, Camera camera, Transform marker)
        {
            State = state ?? GameState.NewGame();
            State.Normalize();
            combatCamera = camera;
            critMarker = marker;
            SpawnCurrentEnemy();
        }

        private void Update()
        {
            if (CurrentEnemy == null) return;
            MoveCritMarker();
            ReadPointer();
            if (State.combo > 1)
            {
                comboDecayTimer += Time.deltaTime;
                if (comboDecayTimer >= 2.5f)
                {
                    State.combo = Math.Max(1, State.combo - Time.deltaTime * 0.12d);
                    StateChanged?.Invoke();
                }
            }
        }

        private void ReadPointer()
        {
            if (Input.GetMouseButtonDown(0))
            {
                ProcessScreenTap(Input.mousePosition);
                return;
            }
            if (Input.touchCount > 0)
            {
                Touch touch = Input.GetTouch(0);
                if (touch.phase == TouchPhase.Began) ProcessScreenTap(touch.position);
            }
        }

        public void ProcessScreenTap(Vector2 screenPosition)
        {
            if (combatCamera == null || CurrentEnemy == null) return;
            Ray ray = combatCamera.ScreenPointToRay(screenPosition);
            if (!Physics.Raycast(ray, out RaycastHit hit, 500f, enemyLayer)) return;
            EnemyActor actor = hit.collider.GetComponentInParent<EnemyActor>();
            if (actor != CurrentEnemy) return;

            Vector2 critScreen = combatCamera.WorldToScreenPoint(critMarker.position);
            bool critical = Vector2.Distance(screenPosition, critScreen) <= critRadiusPixels;
            ApplyHit(critical);
        }

        public void ApplyHit(bool critical)
        {
            if (CurrentEnemy == null || CurrentEnemy.Health <= 0) return;
            double multiplier = critical ? 2d : 1d;
            double damage = Math.Max(1d, Math.Floor(State.power * State.multiplier * multiplier));
            double auraGain = Math.Max(1d, Math.Floor(State.power * State.combo * State.multiplier * multiplier));
            LastDamage = CurrentEnemy.ApplyDamage(damage);
            LastHitWasCritical = critical;
            State.aura += auraGain;
            State.combo = Math.Min(12d, State.combo + State.comboBoost);
            CurrentEnemy.PlayHit();
            if (CurrentEnemy.Health <= 0) DefeatCurrentEnemy();
            SaveService.Save(State);
            StateChanged?.Invoke();
        }

        private void DefeatCurrentEnemy()
        {
            EnemyActor defeated = CurrentEnemy;
            bool boss = defeated.IsBoss;
            double reward = ProgressionSystem.RewardFor(State.level, boss, defeated.MaxHealth);
            State.aura += reward;
            if (boss)
            {
                State.crystals += Math.Max(2, Math.Round(2 + (State.bossIndex % 10) * 0.8));
                State.bossStreak++;
                State.bossIndex++;
            }
            State.level++;
            State.power += boss ? 5 : 1;
            State.combo = 1;
            CurrentEnemy = null;
            EnemyDefeated?.Invoke(defeated);
            Destroy(defeated.gameObject);
            SpawnCurrentEnemy();
        }

        public void SpawnCurrentEnemy()
        {
            bool isBoss = ProgressionSystem.IsBossLevel(State.level);
            string name = isBoss ? ProgressionSystem.BossNameForIndex(State.bossIndex) : ProgressionSystem.EnemyNameForLevel(State.level);
            double hp = isBoss ? ProgressionSystem.GetBossHp(State.level - 1) : ProgressionSystem.GetEnemyHp(State.level);
            RuntimeBootstrap bootstrap = FindObjectOfType<RuntimeBootstrap>();
            if (bootstrap != null) CurrentEnemy = bootstrap.CreateEnemy(name, isBoss, hp);
            StateChanged?.Invoke();
        }

        private void MoveCritMarker()
        {
            if (critMarker == null) return;
            float t = Time.time * 0.62f;
            float x = Mathf.Cos(t) * 2.25f + Mathf.Cos(t * 2.1f) * 0.32f;
            float z = Mathf.Sin(t * 1.18f) * 1.25f + Mathf.Sin(t * 1.7f) * 0.2f;
            Vector3 center = CurrentEnemy.transform.position;
            critMarker.position = center + new Vector3(x, 0.15f + Mathf.Sin(t * 0.9f) * 0.42f, -0.82f + z * 0.08f);
        }

        public void BuyPowerUpgrade()
        {
            int level = State.powerUpgradeLevel;
            double cost = Math.Ceiling(25d * Math.Pow(1.55d, level));
            if (State.aura < cost) return;
            State.aura -= cost;
            State.power += 1;
            State.powerUpgradeLevel++;
            SaveService.Save(State);
            StateChanged?.Invoke();
        }
    }
}