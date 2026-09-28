const SAVE_KEY="aura-farming-save-v3";
const BOSS_BASE_HP=120;
const bossNames=[
 ["Aura-Schatten","🌑","Ein dunkler Kern, der deine erste Aura-Prüfung bewacht."],
 ["Flammenbestie","🔥","Eine glühende Aura, die aggressive Treffer verlangt."],
 ["Frost-Wächter","❄️","Seine Kälte verändert die Geschwindigkeit der Trefferzone."],
 ["Wildwuchs","🌿","Eine lebendige Aura, die den Auraball verzerrt."],
 ["Sturmgeist","⚡","Ein elektrischer Gegner mit extrem schnellen Phasen."],
 ["Kristallkoloss","💎","Ein Schild-Boss mit harter Kristallrüstung."],
 ["Abyss-Wächter","🌊","Ein Tiefenwesen, das falsche Trefferzonen erzeugt."],
 ["Sonnenbestie","☀️","Ihre Hitze verschiebt die Crit-Zone."],
 ["Void-Jäger","🌑","Ein Jäger aus dem leeren Raum."],
 ["Void-Drache","🐉","Ein Drache, der mehrere Bossmechaniken verbindet."],
 ["Dimension Watcher","👁️","Er beobachtet jede deiner Bewegungen."],
 ["Nebula Beast","🌌","Ein Nebelwesen mit wechselnder Auraball-Form."],
 ["Planet Crusher","🪐","Sein Schild macht normale Treffer weniger effektiv."],
 ["Star Eater","☄️","Ein kosmischer Räuber mit schneller Crit-Phase."],
 ["Galaxy Serpent","🌠","Eine Schlange aus lebender Sternenergie."],
 ["Void Titan","👾","Ein Titan mit mehreren Mechaniken gleichzeitig."],
 ["Cosmic King","👑","Der Herrscher der ersten kosmischen Stufe."],
 ["Death of Aura","💀","Ein Boss, der deine Ausdauer prüft."],
 ["Reality Breaker","🌀","Die Realität selbst wird zur Arena."],
 ["Aura Overlord","🌌","Der erste große Endgame-Wächter."]
];
const bosses=bossNames.map((b,i)=>{const hp=Math.round(120*Math.pow(1.55,i));return {name:b[0],emoji:b[1],desc:b[2],hp,reward:Math.round(hp*1.5),crystals:Math.max(2,Math.round(2+i*.8)),time:i<2?30+i*2:i<10?34+(i-2)*2:48,mechanics:getMechanics(i)}});

function getMechanics(i){const m=[];if(i>=1)m.push("⚡ Schnellere Zone");if(i>=2)m.push("👻 Fake-Zonen");if(i>=5)m.push("🛡️ Schild");if(i>=7)m.push("🌀 Aura Shift");return m.slice(0,Math.min(4,1+Math.floor(i/3)));}
const clickers=[
 {id:"basic",name:"Pulse Core",icon:"✦",desc:"+10 % Klickschaden",cost:0,bonuses:{click:1.1}},
 {id:"void",name:"Void Clicker",icon:"◈",desc:"+25 % Crit-Schaden",cost:600,bonuses:{crit:1.25}},
 {id:"solar",name:"Solar Clicker",icon:"☀",desc:"+20 % Aura",cost:3500,bonuses:{aura:1.2}},
 {id:"frost",name:"Frost Clicker",icon:"❄️",desc:"Crit-Zone 15 % langsamer",cost:8000,bonuses:{zoneSpeed:.85}},
 {id:"inferno",name:"Inferno Clicker",icon:"🔥",desc:"+20 % Boss-Schaden",cost:18000,bonuses:{boss:1.2}},
 {id:"storm",name:"Storm Clicker",icon:"⚡",desc:"Combo baut 25 % schneller auf",cost:40000,bonuses:{combo:1.25}},
 {id:"nature",name:"Nature Clicker",icon:"🌿",desc:"+25 % Idle-Schaden",cost:85000,bonuses:{idle:1.25}},
 {id:"blood",name:"Blood Clicker",icon:"🩸",desc:"+35 % Schaden unter 25 % Boss-HP",cost:180000,bonuses:{execute:1.35}},
 {id:"cosmic",name:"Cosmic Clicker",icon:"🌌",desc:"+10 % Chance auf höhere Crit-Stufe",cost:450000,bonuses:{critChance:.1}},
 {id:"celestial",name:"Celestial Clicker",icon:"👑",desc:"+15 % auf Clicker-Boni",cost:1000000,bonuses:{all:1.15}}
];
const pets=[
 {id:"fox",name:"Aura Fox",emoji:"🦊",source:"⭐ 1 Stern",cost:1,bonus:"Aura +10 %",type:"aura",value:.10,shop:true},
 {id:"wolf",name:"Void Wolf",emoji:"🐺",source:"⭐ 3 Sterne",cost:3,bonus:"Boss-DMG +10 %",type:"boss",value:.10,shop:true},
 {id:"solarDragon",name:"Solar Dragon",emoji:"🐉",source:"⭐ 7 Sterne",cost:7,bonus:"Crit +15 %",type:"crit",value:.15,shop:true},
 {id:"hawk",name:"Cosmic Hawk",emoji:"🦅",source:"⭐ 15 Sterne",cost:15,bonus:"Kristalle +20 %",type:"crystal",value:.20,shop:true},
 {id:"celestialDragon",name:"Celestial Dragon",emoji:"🐲",source:"⭐ 30 Sterne",cost:30,bonus:"Gesamtbelohnungen +30 %",type:"reward",value:.30,shop:true},
 {id:"infernoPet",name:"Inferno Dragon",emoji:"🔥",source:"2 % Flammenbestie-Drop",cost:0,bonus:"Boss-DMG +12 %",type:"boss",value:.12,shop:false},
 {id:"frostPet",name:"Frost Wolf",emoji:"❄️",source:"2 % Frost-Wächter-Drop",cost:0,bonus:"Crit-Zone +10 % größer",type:"zone",value:.10,shop:false},
 {id:"voidling",name:"Voidling",emoji:"🌑",source:"1,5 % Void-Drache-Drop",cost:0,bonus:"Aura +15 %",type:"aura",value:.15,shop:false},
 {id:"starSerpent",name:"Star Serpent",emoji:"🌠",source:"1 % Star Eater-Drop",cost:0,bonus:"Kristalle +35 %",type:"crystal",value:.35,shop:false},
 {id:"cosmicEmperor",name:"Cosmic Emperor",emoji:"👑",source:"0,5 % Aura Overlord-Drop",cost:0,bonus:"Alle Belohnungen +40 %",type:"reward",value:.40,shop:false}
];
const skills=[
 ["power","⚔️","Aura-Kraft","+10 % Boss-Schaden",50,"boss",.10],["power2","⚔️","Boss Breaker","+20 % Boss-Schaden",100,"boss",.20],
 ["crit","🎯","Crit Training","+10 % Crit-Multiplikator",50,"crit",.10],["crit2","🎯","Perfect Aim","+10 % Crit-Chance",100,"crit",.10],
 ["aura","✨","Aura Flow","+10 % Aura",50,"aura",.10],["aura2","✨","Aura Mastery","+20 % Aura",125,"aura",.20],
 ["idle","⚡","Idle Core","+10 % Idle-Schaden",50,"idle",.10],["idle2","⚡","Idle Overdrive","+20 % Idle-Schaden",150,"idle",.20],
 ["crystal","💎","Crystal Sense","+10 % Kristallchance",75,"crystal",.10],["crystal2","💎","Crystal Mastery","+25 % Kristalle",200,"crystal",.25],
 ["pet","🐾","Pet Bond","+10 % Pet-Effekt",100,"pet",.10],["pet2","🐾","Pet Mastery","+20 % Pet-Effekt",250,"pet",.20],
 ["slots2","🐾","Zweiter Pet-Slot","+1 aktiver Slot",300,"slot",1],["slots3","🐾","Dritter Pet-Slot","+1 aktiver Slot",700,"slot",1],
 ["time","⏱️","Time Mastery","+10 % Zeitbonus",150,"time",.10]
];
const questsTemplate=[
 {id:"crit",name:"🎯 Treffermeister",goal:50,reward:100,type:"crit"},
 {id:"boss",name:"👹 Bossjäger",goal:5,reward:150,type:"boss"},
 {id:"aura",name:"✨ Aura-Sammler",goal:100000,reward:200,type:"aura"}
];
const defaults={
 aura:0,level:1,power:1,multiplier:1,combo:1,comboBoost:.08,
 powerCost:25,multiplierCost:300,comboCost:75,autoCost:150,autoAura:0,
 bossIndex:0,bossHp:BOSS_BASE_HP,bossTimer:30,bossStreak:0,
 crystals:0,stars:0,prestige:0,skillPoints:0,skills:[],ownedPets:[],equippedPets:[],
 ownedClickers:["basic"],clicker:"basic",quests:questsTemplate.map(q=>({...q,progress:0})),
 event:null,eventUntil:0,lastSeen:Date.now(),lastQuestReset:Date.now()
};
function readSave(){try{return JSON.parse(localStorage.getItem(SAVE_KEY)||"{}")}catch(e){return {}}}
let state={...defaults,...readSave()};
if(!Array.isArray(state.ownedClickers)||!state.ownedClickers.length)state.ownedClickers=["basic"];
if(!Array.isArray(state.quests)||!state.quests.length)state.quests=defaults.quests;
if(!Array.isArray(state.skills))state.skills=[];
if(!Array.isArray(state.ownedPets))state.ownedPets=[];
if(!Array.isArray(state.equippedPets))state.equippedPets=[];
function $(id){return document.getElementById(id)}
function format(n){return Math.floor(n).toLocaleString("de-DE")}
function save(){state.lastSeen=Date.now();localStorage.setItem(SAVE_KEY,JSON.stringify(state))}
function boss(){return bosses[Math.min(state.bossIndex,bosses.length-1)]}
function prestigeMultiplier(){return 1+state.prestige*.10}
function skillHas(id){return state.skills.includes(id)}
function petBonus(type){return state.equippedPets.map(id=>pets.find(p=>p.id===id)).filter(Boolean).filter(p=>p.type===type).reduce((s,p)=>s+p.value,0)*(1+(skillHas("pet")?.10:0)+(skillHas("pet2")?.20:0))}
function rewardMultiplier(){return prestigeMultiplier()*(1+petBonus("reward"))}
function idleDps(){const b=clickers.find(c=>c.id===state.clicker)||clickers[0];const comboScale=Math.sqrt(Math.max(1,state.combo));const multiScale=Math.sqrt(state.multiplier);return Math.max(0,state.power*.5*comboScale*multiScale*(b.bonuses.idle||1)*(1+(skillHas("idle")?.10:0)+(skillHas("idle2")?.20:0)))}
function zoneSize(){return Math.min(.32,.18*(1+(skillHas("crit2")?.10:0)+petBonus("zone")))}
function bossPhase(){const ratio=state.bossHp/Math.max(1,boss().hp);return ratio<=.25?4:ratio<=.5?3:ratio<=.75?2:1}
function bossPhaseInfo(){return [{label:"PHASE 1",icon:"🟢",desc:"Stabil"},{label:"PHASE 2",icon:"🟡",desc:"Schnellere Angriffe"},{label:"PHASE 3",icon:"🟠",desc:"Schild verstärkt"},{label:"PHASE 4",icon:"🔴",desc:"Enrage"}][bossPhase()-1]}
function zoneSpeed(){const c=clickers.find(x=>x.id===state.clicker)||clickers[0];const phase=bossPhase();return .012*(c.bonuses.zoneSpeed||1)*(boss().mechanics.includes("⚡ Schnellere Zone")?1.5:1)*(phase>=2?1.18:1)*(phase>=4?1.22:1)}
function critMultiplier(){const c=clickers.find(x=>x.id===state.clicker)||clickers[0];let m=2;if(skillHas("crit"))m*=1.10;if(c.bonuses.crit)m*=c.bonuses.crit;if(state.event==="Perfect Storm")m*=1.5;return m}
function render(){
 const b=boss();
 const phase=bossPhase(),phaseInfo=bossPhaseInfo();
 const arena=document.querySelector(".crit-arena");
 const fake=document.getElementById("fakeZone"), shield=document.getElementById("shieldZone"), core=document.getElementById("auraCore");
 if(fake){const show=b.mechanics.includes("👻 Fake-Zonen");fake.style.display=show?"flex":"none";fake.style.left=(18+((state.bossIndex*17)%55))+"%";fake.style.top=(18+((state.bossIndex*29)%55))+"%";}
 if(shield)shield.style.display=b.mechanics.includes("🛡️ Schild")?"flex":"none";
 if(core)core.classList.toggle("shifted",b.mechanics.includes("🌀 Aura Shift") && Math.floor(Date.now()/1200)%2===0);
const max=b.hp;state.bossHp=Math.max(0,Math.min(state.bossHp,max));
 $("aura").textContent=format(state.aura);$("level").textContent=state.level;$("power").textContent=format(state.power);$("multiplier").textContent="x"+state.multiplier.toFixed(2);$("combo").textContent="x"+state.combo.toFixed(2);$("prestige").textContent=state.prestige;
 $("crystals").textContent=format(state.crystals);$("stars").textContent=state.stars;$("skillPoints").textContent=state.skillPoints;$("idleDamage").textContent=format(idleDps());$("bossStreak").textContent=state.bossStreak;
 $("bossNumber").textContent=state.bossIndex+1;$("bossName").textContent=b.name;$("bossDesc").textContent=b.desc;$("bossEmoji").textContent=b.emoji;$("bossHp").textContent=format(state.bossHp)+" / "+format(max);$("bossHealth").style.width=(state.bossHp/max*100)+"%";$("bossReward").textContent="Belohnung: +"+format(b.reward*rewardMultiplier())+" Aura";
 $("bossMechanics").innerHTML=b.mechanics.map(x=>"<span class='mechanic'>"+x+"</span>").join("")+"<span class='mechanic phase phase-"+phase+"'>"+phaseInfo.icon+" "+phaseInfo.label+": "+phaseInfo.desc+"</span>";
 $("bossTimer").textContent=Math.max(0,state.bossTimer).toFixed(1);$("bossPhase").textContent=phaseInfo.icon+" "+phaseInfo.label+" · "+phaseInfo.desc;$("comboBadge").textContent="COMBO x"+state.combo.toFixed(2);$("critBadge").textContent="🎯 CRIT bis ×"+critMultiplier().toFixed(1);
 $("powerCost").textContent=format(state.powerCost);$("multiplierCost").textContent=format(state.multiplierCost);$("comboCost").textContent=format(state.comboCost);$("autoCost").textContent=format(state.autoCost);$("autoInfo").textContent="Auto-Aura: "+state.autoAura+"/s";
 document.querySelectorAll(".upgrade").forEach(btn=>{const t=btn.dataset.type;const c=t==="power"?state.powerCost:t==="multiplier"?state.multiplierCost:t==="combo"?state.comboCost:state.autoCost;btn.disabled=state.aura<c});
 $("idleDetail").textContent=format(idleDps())+" Schaden/s";$("prestigeBonus").textContent="Belohnungen ×"+prestigeMultiplier().toFixed(2);
 const next=(state.prestige+1)*500000+500000;$("prestigeText").textContent="Nächstes Prestige: "+format(next)+" Aura → ⭐ 1";
 $("prestigeBtn").disabled=state.aura<next;
 renderClickers();renderSkills();renderPets();renderQuests();renderEvent();
}
function renderClickers(){const grid=$("clickerGrid");grid.innerHTML="";clickers.forEach(c=>{const owned=state.ownedClickers.includes(c.id),active=state.clicker===c.id;const card=document.createElement("div");card.className="clicker-card"+(active?" active":"")+(owned?"":" locked");card.innerHTML="<button data-c='"+c.id+"' "+(owned?"":"disabled")+"><div class='clicker-preview preview-"+c.id+"'></div><h3>"+c.icon+" "+c.name+"</h3><p>"+c.desc+"</p><span class='price'>"+(owned?(active?"✓ Ausgerüstet":"Ausrüsten"):"✨ "+format(c.cost))+"</span></button>";grid.appendChild(card)});grid.querySelectorAll("[data-c]").forEach(x=>x.onclick=()=>equipClicker(x.dataset.c))}
function renderSkills(){const grid=$("skillGrid");grid.innerHTML="";skills.forEach(s=>{const [id,icon,name,desc,cost]=s;const owned=skillHas(id);const card=document.createElement("div");card.className="skill-card"+(owned?"":"");card.innerHTML="<div class='pet-emoji'>"+icon+"</div><h3>"+name+"</h3><p>"+desc+"</p><span class='skill-cost'>"+(owned?"✓ Aktiv":"💎 "+cost)+"</span><button "+(owned||state.crystals<cost?"disabled":"")+">"+(owned?"Freigeschaltet":"Skill kaufen")+"</button>";card.querySelector("button").onclick=()=>buySkill(id);grid.appendChild(card)})}
function renderPets(){const grid=$("petGrid");grid.innerHTML="";$("petSlots").textContent=Math.min(5,1+(skillHas("slots2")?1:0)+(skillHas("slots3")?1:0));pets.forEach(p=>{const owned=state.ownedPets.includes(p.id),equipped=state.equippedPets.includes(p.id);const card=document.createElement("div");card.className="pet-card"+(equipped?" active":"")+(owned?"":" locked");card.innerHTML="<div class='pet-emoji'>"+p.emoji+"</div><h3>"+p.name+"</h3><p>"+p.bonus+"</p><span class='pet-cost'>"+(owned?(equipped?"✓ Ausgerüstet":"Verfügbar"):(p.shop?"⭐ "+p.cost:p.source))+"</span>"+(owned?"<button>"+(equipped?"Ablegen":"Ausrüsten")+"</button>":"<button "+(!p.shop||state.stars<p.cost?"disabled":"")+">Kaufen</button>");const btn=card.querySelector("button");btn.onclick=()=>owned?togglePet(p.id):buyPet(p.id);grid.appendChild(card)})}
function renderQuests(){const grid=$("questList");grid.innerHTML="";state.quests.forEach(q=>{const el=document.createElement("div");el.className="quest";const pct=Math.min(100,q.progress/q.goal*100);el.innerHTML="<b>"+q.name+"</b> "+format(Math.min(q.progress,q.goal))+"/"+format(q.goal)+"<progress value='"+pct+"' max='100'></progress><br>💎 "+q.reward;grid.appendChild(el)})}
function renderEvent(){const active=state.event&&state.eventUntil>Date.now();$("eventBox").textContent=active?state.event+" aktiv! Bonus läuft.":"Kein Event aktiv."}
function addQuest(type,amount){state.quests.filter(q=>q.type===type).forEach(q=>{q.progress+=amount;if(q.progress>=q.goal){state.crystals+=Math.round(q.reward*rewardMultiplier());q.progress=0;$("message").textContent="📜 Quest abgeschlossen! 💎 Kristalle erhalten."}})}
function farm(event){
 const c=clickers.find(x=>x.id===state.clicker)||clickers[0];const z=zoneSize();const arena=document.querySelector(".crit-arena");const rect=arena.getBoundingClientRect();const px=event.clientX-rect.left;const py=event.clientY-rect.top;const cx=rect.width*.5;const cy=rect.height*.5;const zoneEl=document.querySelector(".crit-zone");const zr=zoneEl.getBoundingClientRect();const zx=zr.left+zr.width/2-rect.left;const zy=zr.top+zr.height/2-rect.top;const zoneRadius=Math.max(zr.width,zr.height)*.5;const distance=Math.hypot(px-zx,py-zy);const inZone=distance<=zoneRadius;const fakeEl=document.getElementById("fakeZone");const fakeRect=fakeEl&&getComputedStyle(fakeEl).display!=="none"?fakeEl.getBoundingClientRect():null;const hitFake=fakeRect&&px>=fakeRect.left-rect.left&&px<=fakeRect.right-rect.left&&py>=fakeRect.top-rect.top&&py<=fakeRect.bottom-rect.top;
 const phase=bossPhase();let cm=inZone?critMultiplier():1;if(hitFake){cm=1;$("message").textContent="👻 Fake-Zone! Kein Crit.";state.combo=Math.max(1,state.combo-.25)}if(inZone&&c.bonuses.critChance&&Math.random()<c.bonuses.critChance)cm*=1.5;
 let gain=Math.max(1,Math.floor(state.power*state.combo*state.multiplier*cm*(c.bonuses.click||1)*(1+petBonus("aura"))*rewardMultiplier()));
 if(state.bossHp/boss().hp<.25)gain=Math.floor(gain*(c.bonuses.execute||1));
 let bossDamage=Math.max(1,Math.floor(state.power*state.multiplier*cm*(c.bonuses.boss||1)*(1+petBonus("boss"))));
 if(boss().mechanics.includes("🛡️ Schild")&&!inZone)bossDamage=Math.floor(bossDamage*(phase>=3?.5:.7));if(boss().mechanics.includes("🌀 Aura Shift")&&!inZone)bossDamage=Math.floor(bossDamage*(phase>=3?.75:.85));if(phase>=4)bossDamage=Math.floor(bossDamage*1.25);
 state.aura+=gain;state.bossHp-=bossDamage;state.combo=Math.min(12,state.combo+state.comboBoost*(c.bonuses.combo||1));addQuest("crit",inZone?1:0);addQuest("aura",gain);
 $("message").textContent=(inZone?"💥 "+cm.toFixed(1)+"× CRIT! ":"✨ ")+format(gain)+" Aura"+(phase>=4?" — 🔴 ENRAGE!":"");
 if(state.bossHp<=0)defeatBoss();checkLevel();save();render();
}
function defeatBoss(){
 const b=boss();const timeRatio=state.bossTimer/b.time;let bonus=1;if(timeRatio>.5)bonus=1.1;if(timeRatio>.75)bonus=1.2;if(timeRatio>.9)bonus=1.5;
 const reward=Math.round(b.reward*bonus*rewardMultiplier());state.aura+=reward;state.crystals+=Math.round(b.crystals*(1+petBonus("crystal")));state.bossStreak++;addQuest("boss",1);
 if(Math.random()<getDropChance(state.bossIndex))dropBossPet(state.bossIndex);
 if(state.bossIndex<19){state.bossIndex++;}else{state.bossIndex++;}state.bossHp=getBossHp(state.bossIndex);state.bossTimer=getBossTime(state.bossIndex);state.level++;state.power+=5;
 $("message").textContent="🏆 "+b.name+" besiegt! +"+format(reward)+" Aura";
}
function getBossHp(i){return Math.max(BOSS_BASE_HP,Math.round(BOSS_BASE_HP*Math.pow(1.55,i)))}
function getBossTime(i){return i<2?30+i*2:i<10?34+(i-2)*2:48}
function getDropChance(i){if(i===1)return .02;if(i===2)return .02;if(i===9)return .015;if(i===13)return .01;if(i===19)return .005;return 0}
function dropBossPet(i){const ids={1:"infernoPet",2:"frostPet",9:"voidling",13:"starSerpent",19:"cosmicEmperor"};const id=ids[i];if(id&&!state.ownedPets.includes(id)){state.ownedPets.push(id);$("message").textContent="🎉 Seltener Pet-Drop: "+pets.find(p=>p.id===id).name}}
function checkLevel(){const need=state.level*1000;if(state.aura>=need){state.level++;state.power+=1;state.aura-=need;$("message").textContent="🎉 Level Up! +1 Power"}}
function updateCrit(){const speed=zoneSpeed();state.critX+=speed;const z=zoneSize();if(state.critX>1-z){state.critX=1-z;state.critDir=-1}if(state.critX<0){state.critX=0;state.critDir=1}state.critX+=state.critDir===-1?-speed*2:0;const angle=Date.now()/800;const x=50+Math.cos(angle)*34;const y=50+Math.sin(angle)*34;$("critZone").style.left=(x+0)+"%";$("critZone").style.top=(y+0)+"%";$("critZone").style.width=(80+z*80)+"px";$("critZone").style.height=(80+z*80)+"px"}
function buy(type){let cost;if(type==="power"){cost=state.powerCost;if(state.aura<cost)return;state.aura-=cost;state.power++;state.powerCost=Math.ceil(cost*1.55)}if(type==="multiplier"){cost=state.multiplierCost;if(state.aura<cost)return;state.aura-=cost;state.multiplier+=.25;state.multiplierCost=Math.ceil(cost*2.1)}if(type==="combo"){cost=state.comboCost;if(state.aura<cost)return;state.aura-=cost;state.comboBoost+=.025;state.comboCost=Math.ceil(cost*1.8)}if(type==="auto"){cost=state.autoCost;if(state.aura<cost)return;state.aura-=cost;state.autoAura++;state.autoCost=Math.ceil(cost*2)}save();render()}
function equipClicker(id){const c=clickers.find(x=>x.id===id);if(!c)return;if(!state.ownedClickers.includes(id)){if(state.aura<c.cost)return;state.aura-=c.cost;state.ownedClickers.push(id)}state.clicker=id;save();$("auraCore").className="aura-core clicker-"+id;render()}
function buySkill(id){const s=skills.find(x=>x[0]===id);if(!s||skillHas(id)||state.crystals<s[4])return;state.crystals-=s[4];state.skills.push(id);state.skillPoints++;save();render()}
function buyPet(id){const p=pets.find(x=>x.id===id);if(!p||!p.shop||state.stars<p.cost||state.ownedPets.includes(id))return;state.stars-=p.cost;state.ownedPets.push(id);save();render()}
function togglePet(id){const slots=Math.min(5,1+(skillHas("slots2")?1:0)+(skillHas("slots3")?1:0));if(state.equippedPets.includes(id))state.equippedPets=state.equippedPets.filter(x=>x!==id);else if(state.equippedPets.length<slots)state.equippedPets.push(id);else{$("message").textContent="🐾 Alle Pet-Slots sind belegt.";return}save();render()}
function prestige(){const next=(state.prestige+1)*500000+500000;if(state.aura<next)return;state.prestige++;state.stars++;state.aura=0;state.level=1;state.power=1;state.multiplier=1;state.combo=1;state.comboBoost=.08;state.powerCost=25;state.multiplierCost=300;state.comboCost=75;state.autoCost=150;state.autoAura=0;state.bossIndex=0;state.bossHp=BOSS_BASE_HP;state.bossTimer=30;state.bossStreak=0;$("message").textContent="🌌 Ascension! +⭐ 1 Stern";save();render()}
function triggerEvent(){const events=[["⚡ Aura Overload","Aura"],["💎 Crystal Rush","Crystal"],["🎯 Perfect Storm","Perfect Storm"],["👾 Void Invasion","Void"]];const e=events[Math.floor(Math.random()*events.length)];state.event=e[1];state.eventUntil=Date.now()+15000;render();setTimeout(()=>{if(state.eventUntil<=Date.now()){state.event=null;render()}},15100)}
document.querySelectorAll(".upgrade").forEach(b=>b.onclick=()=>buy(b.dataset.type));document.querySelectorAll("[data-skill='idle']").forEach(b=>b.onclick=()=>{const s=skills.find(x=>x[0]==="idle");buySkill(s[0])});document.querySelector(".crit-arena").addEventListener("pointerdown",(e)=>{if(e.pointerType==="touch")e.preventDefault();farm(e)});$("prestigeBtn").onclick=prestige;$("eventBtn").onclick=triggerEvent;
$("resetBtn").onclick=()=>{if(confirm("Spielstand wirklich löschen?")){localStorage.removeItem(SAVE_KEY);location.reload()}};
setInterval(()=>{const now=Date.now();const delta=Math.min(.25,(now-(state.lastTick||now))/1000);state.lastTick=now;if(delta>0){state.bossTimer-=delta;if(state.bossTimer<=0){state.bossHp=boss().hp;state.bossTimer=boss().time;state.bossStreak=0;$("message").textContent="⏱️ Zeit abgelaufen! Der Boss startet neu."}const idle=idleDps()*delta;state.aura+=state.autoAura*delta;state.bossHp-=idle*(bossPhase()>=3?.85:1);addQuest("aura",idle);if(state.bossHp<=0)defeatBoss();if(state.event==="Aura"&&state.eventUntil>Date.now())state.aura+=idle*4;checkLevel();save();render()}},250);
setInterval(()=>{if(state.combo>1){state.combo=1;render()}},1800);
setInterval(updateCrit,80);
setInterval(()=>{if(document.visibilityState==="visible" && boss().mechanics.includes("🌀 Aura Shift"))render()},500);
if(state.lastSeen&&Date.now()-state.lastSeen>60000){const offlineSeconds=Math.min(8*3600,(Date.now()-state.lastSeen)/1000);const offline=Math.floor(idleDps()*offlineSeconds);state.aura+=offline;state.lastSeen=Date.now();$("message").textContent="🌙 Offline-Farming: +"+format(offline)+" Aura"}
$("auraCore").className="aura-core clicker-"+state.clicker;render();