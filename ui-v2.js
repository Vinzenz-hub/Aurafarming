/* Aura Farming 2.0 — UI v2 controller */
(function(){
  "use strict";
  const $=id=>document.getElementById(id);
  const app=document.querySelector(".app");
  if(!app) return;

  // Build fixed top status HUD.
  const top=document.createElement("div");
  top.className="ui-topbar";
  top.innerHTML=`
    <div class="ui-brand">✨ <span>Aura Farming 2.0</span></div>
    <button class="ui-top-btn" id="uiStatusOpen">◈ STATUS</button>
  `;
  document.body.appendChild(top);

  const combatHud=document.createElement("section");
  combatHud.className="ui-combat-hud";
  combatHud.innerHTML=`
    <div class="ui-combat-row">
      <div class="ui-combat-name">
        <span class="ui-combat-kicker">AKTIVER BOSS</span>
        <b class="ui-combat-boss" id="uiCombatBoss">Aura-Schatten 🌑</b>
        <span class="ui-combat-meta" id="uiCombatMeta">Boss 1 · Phase 1</span>
      </div>
      <div class="ui-combat-stat ui-combat-timer"><small>ZEIT</small><b id="uiCombatTimer">30.0 s</b></div>
      <div class="ui-combat-stat ui-combat-damage"><small>SCHADEN</small><b id="uiCombatDamage">1 / Klick</b></div>
    </div>
    <div class="ui-combat-health"><i id="uiCombatHealth"></i></div>
  `;
  document.body.appendChild(combatHud);

  const status=document.createElement("section");
  status.className="ui-status-sheet";
  status.innerHTML=`
    <div class="ui-sheet-head">
      <div class="ui-sheet-title"><small>PLAYER STATUS</small>Dein Build</div>
      <button class="ui-close" id="uiStatusClose">Schließen ✕</button>
    </div>
    <div class="ui-sheet-body">
      <div class="ui-stat-grid">
        <div class="ui-stat accent"><small>✨ AURA</small><b id="uiAura">0</b></div>
        <div class="ui-stat"><small>LEVEL</small><b id="uiLevel">1</b></div>
        <div class="ui-stat"><small>⚡ PRO KLICK</small><b id="uiPower">1</b></div>
        <div class="ui-stat"><small>◈ AURA MULTI</small><b id="uiMultiplier">x1.00</b></div>
        <div class="ui-stat accent"><small>🔥 COMBO</small><b id="uiCombo">x1.00</b></div>
        <div class="ui-stat"><small>🌌 PRESTIGE</small><b id="uiPrestige">0</b></div>
      </div>
      <div class="ui-currency-grid">
        <div class="ui-currency"><small>💎 KRISTALLE</small><b id="uiCrystals">0</b></div>
        <div class="ui-currency"><small>⭐ STERNE</small><b id="uiStars">0</b></div>
        <div class="ui-currency"><small>🌳 SKILLPUNKTE</small><b id="uiSkillPoints">0</b></div>
        <div class="ui-currency"><small>⚡ IDLE-DPS</small><b id="uiIdle">0</b></div>
      </div>
      <div class="ui-boss-card">
        <div class="ui-boss-row"><div><div class="ui-boss-name" id="uiBossName">Aura-Schatten</div><div class="ui-boss-sub" id="uiBossMeta">Boss 1 · Phase 1</div></div><div class="ui-boss-emoji" id="uiBossEmoji">🌑</div></div>
        <div class="ui-boss-bar"><i id="uiBossHpBar" style="width:100%"></i></div>
        <div class="ui-boss-sub" id="uiBossHp">120 / 120 · 30.0 s</div>
      </div>
      <div class="ui-resource-note">Alle wichtigen Werte bleiben hier gebündelt. Das Kampffeld selbst bleibt dadurch frei von dauerhaft eingeblendeten Statuskarten.</div>
    </div>
  `;
  document.body.appendChild(status);

  // Move all secondary game areas into a single bottom sheet.
  const sheet=document.createElement("section");
  sheet.className="ui-bottom-sheet";
  sheet.innerHTML=`
    <div class="ui-bottom-head">
      <div><small id="uiBottomKicker">SYSTEM</small><strong id="uiBottomTitle">Upgrades</strong></div>
      <button class="ui-close" id="uiBottomClose">Schließen ✕</button>
    </div>
    <div class="ui-bottom-body" id="uiBottomBody"></div>
  `;
  document.body.appendChild(sheet);
  const body=sheet.querySelector("#uiBottomBody");
  const sections=["upgrades","progress","quests","skills","clickers","pets"].map(id=>$(id)).filter(Boolean);
  sections.forEach(s=>body.appendChild(s));

  // Replace the old fixed nav visually; the new nav is the only navigation surface.
  const oldNav=document.querySelector(".bottom-nav");
  const navItems=[
    ["combat","⚔️","Kampf"],
    ["upgrades","⚡","Shop"],
    ["progress","📈","Fortschritt"],
    ["quests","📜","Quests"],
    ["skills","🌳","Skills"],
    ["more","☰","Mehr"]
  ];
  if(oldNav) oldNav.innerHTML=navItems.map(([id,icon,label])=>`<button class="nav-tab ${id==="combat"?"active":""}" data-ui-section="${id}"><span>${icon}</span><span>${label}</span></button>`).join("");

  const titles={
    upgrades:["SHOP","Stärker werden"],
    progress:["FORTSCHRITT","Prestige & Events"],
    quests:["QUESTS","Mission Control"],
    skills:["SKILL-UPGRADES","Dein Build"],
    clickers:["KLICKER","Dein Aura-Stil"],
    pets:["PETS","Deine Begleiter"],
    more:["MEHR","Weitere Systeme"]
  };

  let openSection=null;

  function setSheet(section){
    const more=section==="more";
    const target=more?"clickers":section;
    sections.forEach(s=>s.classList.toggle("ui-view-active",s.id===target));
    if(more){
      $("clickers")?.classList.add("ui-view-active");
      $("pets")?.classList.add("ui-view-active");
      document.getElementById("uiBottomKicker").textContent=titles.more[0];
      document.getElementById("uiBottomTitle").textContent="Clicker & Pets";
    }else{
      document.getElementById("uiBottomKicker").textContent=titles[section]?.[0]||"SYSTEM";
      document.getElementById("uiBottomTitle").textContent=titles[section]?.[1]||"System";
    }
    status.classList.remove("open");
    sheet.classList.add("open");
    openSection=section;
    document.body.classList.add("ui-sheet-open");
  }

  function closeSheets(){
    status.classList.remove("open");
    sheet.classList.remove("open");
    openSection=null;
    document.body.classList.remove("ui-sheet-open");
  }

  oldNav?.querySelectorAll(".nav-tab").forEach(btn=>{
    btn.onclick=()=>{
      const section=btn.dataset.uiSection;
      oldNav.querySelectorAll(".nav-tab").forEach(x=>x.classList.toggle("active",x===btn));
      if(section==="combat"){
        closeSheets();
        window.scrollTo({top:0,behavior:"smooth"});
        return;
      }
      if(sheet.classList.contains("open") && openSection===section){
        closeSheets();
      }else{
        setSheet(section);
      }
    };
  });

  $("uiStatusOpen").onclick=()=>{
    if(status.classList.contains("open")){
      closeSheets();
    }else{
      sheet.classList.remove("open");
      openSection=null;
      status.classList.add("open");
      document.body.classList.add("ui-sheet-open");
    }
  };
  $("uiStatusClose").onclick=()=>closeSheets();
  $("uiBottomClose").onclick=()=>closeSheets();

  // Close sheets by tapping the empty backdrop.
  [status,sheet].forEach(el=>el.addEventListener("pointerdown",e=>{
    if(e.target===el) closeSheets();
  }));

  // Smooth, continuous fake movement. It uses the same combat-field coordinate system as Crit.
  const fake=$("fakeZone");
  let fakeFrame=0;
  function animateCombatObjects(){
    const arena=$("critArena");
    if(arena){
      const t=performance.now()/1000;
      if(fake && fake.style.display!=="none"){
        const target=$("bossTarget");
        if(target){
          const ar=arena.getBoundingClientRect(),tr=target.getBoundingClientRect();
          const cx=tr.left+tr.width/2-ar.left,cy=tr.top+tr.height/2-ar.top;
          const bossR=Math.min(tr.width,tr.height)/2;
          const fakeR=Math.min(fake.getBoundingClientRect().width,fake.getBoundingClientRect().height)/2||30;
          const safe=Math.max(12,bossR-fakeR*1.15);
          const radius=safe*(.55+.2*Math.sin(t*.72));
          const angle=t*.92+1.8;
          const x=cx+Math.cos(angle)*radius-fakeR;
          const y=cy+Math.sin(angle*1.13)*radius-fakeR;
          fake.style.left=x+"px";
          fake.style.top=y+"px";
          fake.style.transform="none";
        }
      }
      const shield=$("bossShield");
      if(shield && typeof shieldOpeningAngle==="function"){
        const deg=shieldOpeningAngle()*180/Math.PI;
        shield.style.setProperty("--opening-angle",deg+"deg");
      }
    }
    fakeFrame=requestAnimationFrame(animateCombatObjects);
  }
  fakeFrame=requestAnimationFrame(animateCombatObjects);

  // Keep the top status HUD in sync with the game's existing state/render cycle.
  function syncStatus(){
    const map={
      uiAura:"aura",uiLevel:"level",uiPower:"power",uiMultiplier:"multiplier",
      uiCombo:"combo",uiPrestige:"prestige",uiCrystals:"crystals",uiStars:"stars",
      uiSkillPoints:"skillPoints",uiIdle:"idleDamage"
    };
    Object.entries(map).forEach(([to,from])=>{const a=$(to),b=$(from);if(a&&b)a.textContent=b.textContent});
    const name=$("bossName"),emoji=$("bossEmoji"),hp=$("bossHp"),bar=$("bossHealth"),timer=$("bossTimer"),num=$("bossNumber"),phase=$("bossPhase");
    if(name)$("uiBossName").textContent=name.textContent;
    if(emoji)$("uiBossEmoji").textContent=emoji.textContent;
    if(hp)$("uiBossHp").textContent=hp.textContent+" · "+(timer?timer.textContent:"0")+" s";
    if(bar)$("uiBossHpBar").style.width=bar.style.width||"100%";
    if(num&&phase)$("uiBossMeta").textContent="Boss "+num.textContent+" · "+phase.textContent;

    const combatBoss=$("uiCombatBoss"), combatMeta=$("uiCombatMeta"), combatTimer=$("uiCombatTimer"), combatDamage=$("uiCombatDamage"), combatHealth=$("uiCombatHealth");
    if(combatBoss) combatBoss.textContent=(name?name.textContent:"Boss")+" "+(emoji?emoji.textContent:"");
    if(combatMeta) combatMeta.textContent=(num?"Boss "+num.textContent:"Boss")+" · "+(phase?phase.textContent:"");
    if(combatTimer) combatTimer.textContent=(timer?timer.textContent:"0.0")+" s";
    const powerNow=$("power");
    if(combatDamage) combatDamage.textContent=(powerNow?powerNow.textContent:"0")+" / Klick";
    if(combatHealth) combatHealth.style.width=bar?.style.width||"100%";
  }
  setInterval(syncStatus,250);
  syncStatus();

  // Hide the legacy more popup if older script opens it.
  const legacyMore=$("moreMenu");
  if(legacyMore) legacyMore.style.display="none";
})();
