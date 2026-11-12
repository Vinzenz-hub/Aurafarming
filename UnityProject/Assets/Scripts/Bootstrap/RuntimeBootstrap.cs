using System.Collections.Generic;
using UnityEngine;

namespace AuraFarming
{
    public sealed class RuntimeBootstrap : MonoBehaviour
    {
        private CombatSystem combat;
        private GUIStyle titleStyle, bodyStyle, buttonStyle;
        private readonly List<Renderer> arenaLights = new List<Renderer>();
        private Material arenaMaterial;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void EnsureBootstrap()
        {
            if (FindObjectOfType<RuntimeBootstrap>() != null) return;
            new GameObject("AuraFarming_Runtime").AddComponent<RuntimeBootstrap>();
        }

        private void Start()
        {
            Application.targetFrameRate = 60;
            BuildWorld();
            GameState state = SaveService.Load();
            combat = gameObject.AddComponent<CombatSystem>();
            combat.Initialize(state, Camera.main, CreateCritMarker());
            combat.StateChanged += () => { };
        }

        private void BuildWorld()
        {
            RenderSettings.ambientLight = new Color(0.18f, 0.2f, 0.32f);
            Camera camera = new GameObject("Main Camera").AddComponent<Camera>();
            camera.tag = "MainCamera";
            camera.transform.position = new Vector3(0, 5.6f, -10.5f);
            camera.transform.rotation = Quaternion.Euler(25f, 0, 0);
            camera.fieldOfView = 48f;
            camera.clearFlags = CameraClearFlags.SolidColor;
            camera.backgroundColor = new Color(0.015f, 0.025f, 0.075f);

            GameObject lightObject = new GameObject("Key Light");
            Light light = lightObject.AddComponent<Light>();
            light.type = LightType.Directional;
            light.intensity = 1.45f;
            light.color = new Color(0.52f, 0.72f, 1f);
            lightObject.transform.rotation = Quaternion.Euler(42f, -28f, 0);

            CreatePrimitive(PrimitiveType.Plane, "Arena Floor", new Vector3(0, -0.08f, 0), new Vector3(1.6f, 1, 1.6f), new Color(0.025f, 0.055f, 0.12f), true);
            CreatePrimitive(PrimitiveType.Cube, "Rear Energy Wall", new Vector3(0, 2.2f, 4.8f), new Vector3(14, 4.5f, 0.18f), new Color(0.035f, 0.08f, 0.2f), false);
            for (int i = 0; i < 12; i++)
            {
                float x = -7f + i * 1.27f;
                GameObject pylon = CreatePrimitive(PrimitiveType.Cube, "Neon Pylon", new Vector3(x, 1.15f, 3.6f), new Vector3(0.08f, 2.3f + Mathf.Sin(i) * 0.8f, 0.08f), i % 2 == 0 ? new Color(0.1f, 0.8f, 1f) : new Color(0.55f, 0.15f, 1f), false);
                pylon.transform.rotation = Quaternion.Euler(0, 0, (i % 2 == 0 ? 1 : -1) * 9f);
            }
            CreatePrimitive(PrimitiveType.Sphere, "Distant Moon", new Vector3(5.2f, 5.8f, 4.2f), Vector3.one * 1.35f, new Color(0.22f, 0.3f, 0.72f), false);
        }

        public EnemyActor CreateEnemy(string enemyName, bool isBoss, double hp)
        {
            GameObject root = new GameObject(enemyName);
            root.transform.position = new Vector3(0, isBoss ? 2.15f : 1.05f, 1.25f);
            root.transform.localScale = Vector3.one * (isBoss ? 2.2f : 0.9f);
            Color body = isBoss ? new Color(0.12f, 0.055f, 0.22f) : Color.Lerp(new Color(0.12f, 0.28f, 0.18f), new Color(0.25f, 0.8f, 0.35f), (Time.frameCount % 5) / 5f);
            Color energy = isBoss ? new Color(0.7f, 0.15f, 1f) : new Color(0.25f, 1f, 0.7f);
            GameObject torso = CreateChildPrimitive(root.transform, PrimitiveType.Sphere, "Core Body", Vector3.zero, isBoss ? new Vector3(1.4f, 1.65f, 0.8f) : new Vector3(1f, 1.2f, 0.85f), body);
            CreateChildPrimitive(root.transform, PrimitiveType.Sphere, "Energy Core", new Vector3(0, 0.08f, -0.43f), Vector3.one * (isBoss ? 0.42f : 0.24f), energy);
            CreateChildPrimitive(root.transform, PrimitiveType.Sphere, "Left Eye", new Vector3(-0.27f, 0.3f, -0.7f), Vector3.one * 0.13f, Color.cyan);
            CreateChildPrimitive(root.transform, PrimitiveType.Sphere, "Right Eye", new Vector3(0.27f, 0.3f, -0.7f), Vector3.one * 0.13f, Color.cyan);
            if (isBoss)
            {
                CreateChildPrimitive(root.transform, PrimitiveType.Capsule, "Left Claw", new Vector3(-1.05f, -0.3f, 0), new Vector3(0.42f, 1.1f, 0.42f), body).transform.localRotation = Quaternion.Euler(0, 0, -35);
                CreateChildPrimitive(root.transform, PrimitiveType.Capsule, "Right Claw", new Vector3(1.05f, -0.3f, 0), new Vector3(0.42f, 1.1f, 0.42f), body).transform.localRotation = Quaternion.Euler(0, 0, 35);
                for (int i = 0; i < 5; i++) CreateChildPrimitive(root.transform, PrimitiveType.Cone, "Crown Spike", new Vector3((i - 2) * 0.35f, 1.12f + Mathf.Abs(i - 2) * 0.08f, 0), new Vector3(0.22f, 0.55f, 0.22f), energy);
            }
            SphereCollider collider = root.AddComponent<SphereCollider>();
            collider.radius = isBoss ? 1.05f : 0.85f;
            collider.center = Vector3.zero;
            EnemyActor actor = root.AddComponent<EnemyActor>();
            actor.Initialize(enemyName, isBoss, hp, body, energy);
            return actor;
        }

        private Transform CreateCritMarker()
        {
            GameObject marker = CreatePrimitive(PrimitiveType.Sphere, "Moving Crit Target", new Vector3(0, 0.12f, 0), Vector3.one * 0.34f, new Color(0.15f, 0.95f, 1f), false);
            return marker.transform;
        }

        private GameObject CreatePrimitive(PrimitiveType type, string objectName, Vector3 position, Vector3 scale, Color color, bool collider)
        {
            GameObject go = GameObject.CreatePrimitive(type);
            go.name = objectName;
            go.transform.position = position;
            go.transform.localScale = scale;
            Renderer renderer = go.GetComponent<Renderer>();
            renderer.material = CreateMaterial(color, true);
            if (!collider)
            {
                Collider c = go.GetComponent<Collider>();
                if (c != null) Destroy(c);
            }
            return go;
        }

        private GameObject CreateChildPrimitive(Transform parent, PrimitiveType type, string objectName, Vector3 localPosition, Vector3 localScale, Color color)
        {
            GameObject child = GameObject.CreatePrimitive(type);
            child.name = objectName;
            child.transform.SetParent(parent, false);
            child.transform.localPosition = localPosition;
            child.transform.localScale = localScale;
            Renderer renderer = child.GetComponent<Renderer>();
            renderer.material = CreateMaterial(color, true);
            Collider collider = child.GetComponent<Collider>();
            if (collider != null) Destroy(collider);
            return child;
        }

        private Material CreateMaterial(Color color, bool emission)
        {
            Shader shader = Shader.Find("Universal Render Pipeline/Lit");
            if (shader == null) shader = Shader.Find("Standard");
            Material material = new Material(shader);
            material.color = color;
            if (emission && material.HasProperty("_EmissionColor"))
            {
                material.EnableKeyword("_EMISSION");
                material.SetColor("_EmissionColor", color * 0.65f);
            }
            return material;
        }

        private void OnGUI()
        {
            if (combat == null || combat.CurrentEnemy == null) return;
            if (titleStyle == null)
            {
                titleStyle = new GUIStyle(GUI.skin.label) { fontSize = Mathf.Max(18, Screen.width / 42), fontStyle = FontStyle.Bold, normal = { textColor = Color.white } };
                bodyStyle = new GUIStyle(GUI.skin.label) { fontSize = Mathf.Max(13, Screen.width / 68), normal = { textColor = new Color(0.72f, 0.88f, 1f) } };
                buttonStyle = new GUIStyle(GUI.skin.button) { fontSize = Mathf.Max(14, Screen.width / 65), fixedHeight = 48 };
            }
            EnemyActor enemy = combat.CurrentEnemy;
            float pad = 18f;
            GUI.Label(new Rect(pad, pad, Screen.width * 0.65f, 36), enemy.DisplayName + (enemy.IsBoss ? "  •  BOSS" : "  •  ENEMY") + "  |  LEVEL " + combat.State.level, titleStyle);
            GUI.Label(new Rect(pad, 54, Screen.width - 2 * pad, 28), "HP  " + enemy.Health.ToString("N0") + " / " + enemy.MaxHealth.ToString("N0"), bodyStyle);
            Rect bar = new Rect(pad, 86, Screen.width - 2 * pad, 16);
            GUI.color = new Color(0.08f, 0.12f, 0.2f);
            GUI.DrawTexture(bar, Texture2D.whiteTexture);
            GUI.color = new Color(0.1f, 0.85f, 1f);
            GUI.DrawTexture(new Rect(bar.x, bar.y, bar.width * (float)(enemy.Health / enemy.MaxHealth), bar.height), Texture2D.whiteTexture);
            GUI.color = Color.white;
            GUI.Label(new Rect(pad, 112, Screen.width - 2 * pad, 26), "AURA  " + combat.State.aura.ToString("N0") + "    POWER  " + combat.State.power.ToString("N0") + "    COMBO  x" + combat.State.combo.ToString("0.0"), bodyStyle);
            if (GUI.Button(new Rect(pad, Screen.height - 72, Screen.width * 0.46f, 52), "POWER UPGRADE", buttonStyle)) combat.BuyPowerUpgrade();
            if (GUI.Button(new Rect(Screen.width * 0.52f, Screen.height - 72, Screen.width * 0.46f, 52), "SAVE GAME", buttonStyle)) SaveService.Save(combat.State);
        }
    }
}