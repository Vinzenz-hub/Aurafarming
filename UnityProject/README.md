# Aura Farming — Unity 3D

A clean C# rebuild of the existing Aura Farming browser game. The current browser game remains the production version until the Unity build passes gameplay, save migration, iPad and WebGL tests.

## Target

- Unity 6 LTS
- Universal Render Pipeline (URP)
- iOS / iPadOS, Android and WebGL
- Shared C# gameplay code; platform-specific input/build settings only

## Open the project

1. Install a current Unity 6 LTS editor using Unity Hub.
2. Open the `UnityProject` folder.
3. Let Unity resolve the packages in `Packages/manifest.json`.
4. Press Play. `RuntimeBootstrap` builds a temporary 3D arena at runtime, so a scene asset is not required for this first vertical slice.

## First vertical slice

- 3D arena, camera, lighting and a generated enemy/boss placeholder.
- Touch and mouse raycast combat.
- Moving 3D critical-hit marker.
- Enemy health, damage, aura, combo and enemy progression.
- Boss every ten levels, with separate HP and reward scaling.
- Power upgrade.
- Local save through PlayerPrefs (WebGL uses browser-backed PlayerPrefs storage).

## Legacy save migration

The old browser save is stored in `localStorage["aura-farming-save-v3"]`. It is not automatically accessible to a native app or a separate Unity WebGL origin. Export that JSON from the old browser build, then pass the JSON text to `SaveService.TryImportLegacy` from an import screen/tool. The importer deliberately does not overwrite an existing save by itself.

## Architecture

- `Core/GameState.cs`: serializable, versioned player state and legacy DTO.
- `Core/SaveService.cs`: local persistence and explicit legacy import.
- `Combat/CombatSystem.cs`: pointer input, hit detection, critical damage, enemy defeat.
- `Combat/EnemyActor.cs`: 3D enemy health and hit/idle animation.
- `Progression/ProgressionSystem.cs`: enemy schedule, boss cadence, HP and rewards.
- `Bootstrap/RuntimeBootstrap.cs`: temporary runtime-generated 3D arena and prototype HUD.

## Important prototype limitations

This is the first playable engineering slice, not the final art pass. The enemy models are procedural primitives; replace them with rigged meshes, materials, animation controllers, VFX Graph effects and authored arena scenes. The current HUD is intentionally temporary IMGUI. The game systems are separated so the production UI and art can replace the prototype without rewriting progression/combat rules.

## Build targets

Install **iOS Build Support**, **Android Build Support** and **WebGL Build Support** through Unity Hub. Configure iOS signing/provisioning on macOS. WebGL should be tested on Safari/iPadOS separately; memory and download size must be profiled before release.
