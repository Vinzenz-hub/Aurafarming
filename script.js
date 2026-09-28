const SAVE_KEY="aura-farming-save-v2";
const bosses=[
 {name:"Aura-Schatten",emoji:"🌑",desc:"Ein dunkler Kern, der deine erste Aura-Prüfung bewacht.",hp:120,reward:180},
 {name:"Flammenbestie",emoji:"🔥",desc:"Eine glühende Aura, die nur starke Klicker bezwingen.",hp:650,reward:900},
 {name:"Frost-Drache",emoji:"🐉",desc:"Seine kalte Aura verändert den Rhythmus deiner Angriffe.",hp:2800,reward:4200},
 {name:"Kosmischer Titan",emoji:"🪐",desc:"Ein gigantischer Aura-Boss aus einer anderen Dimension.",hp:12000,reward:20000},
 {name:"Void-König",emoji:"👑",desc:"Der Endgegner der aktuellen Aura-Welt.",hp:60000,reward:100000}
];
const clickers=[
 {id:"basic",name:"Pulse Core",icon:"✦",desc:"Der klassische Aura-Kern.",cost:0},
 {id:"void",name:"Void Clicker",icon:"◈",desc:"Dunkle Energie für harte Treffer.",cost:600},
 {id:"solar",name:"Solar Clicker",icon:"☀",desc:"Ein brennender Kern mit Solar-Effekt.",cost:3500},
 {id:"celestial",name:"Celestial Clicker",icon:"✧",desc:"Kosmische Energie für Endgame-Farben.",cost:15000}
];
const defaults={aura:0,level:1,power:1,multiplier:1,combo:1,comboBoost:.08,powerCost:25,multiplierCost:300,comboCost:75,autoCost:150,autoAura:0,bossIndex:0,bossHp:bosses[0].hp,critX:.4,critDir:1,clicker:"basic",ownedClickers:["basic"]};
let old={};try{old=JSON.parse(localStorage.getItem("aura-farming-save-v1")||"{}")}catch(e){}
let state={...defaults,...old,...loadNew()};
function loadNew(){try{return JSON.parse(localStorage.getItem(SAVE_KEY)||"{}")}catch(e){return {}}}
state.ownedClickers=Array.from(new Set(state.ownedClickers||["basic"]));
const $=id=>document.getElementById(id), format=n=>Math.floor(n).toLocaleString("de-DE");

function save(){localStorage.setItem(SAVE_KEY,JSON.stringify(state))}
function currentBoss(){return bosses[Math.min(state.bossIndex,bosses.length-1)]}
function render(){
 $("aura").textContent=format(state.aura);$("level").textContent=state.level;$("power").textContent=format(state.power);
 $("multiplier").textContent="x"+state.multiplier.toFixed(2);$("combo").textContent="x"+state.combo.toFixed(2);
 $("comboBadge").textContent="COMBO x"+state.combo.toFixed(2);$("critStat").textContent="x2.00";
 $("powerCost").textContent=format(state.powerCost);$("multiplierCost").textContent=format(state.multiplierCost);$("comboCost").textContent=format(state.comboCost);$("autoCost").textContent=format(state.autoCost);
 $("autoInfo").textContent="Auto-Aura: "+state.autoAura+"/s";
 const boss=currentBoss();$("bossName").textContent=boss.name;$("bossDesc").textContent=boss.desc;$("bossEmoji").textContent=boss.emoji;
 const max=boss.hp;state.bossHp=Math.max(0,Math.min(state.bossHp,max));$("bossHp").textContent=format(state.bossHp)+" / "+format(max);
 $("bossHealth").style.width=(state.bossHp/max*100)+"%";$("bossReward").textContent="Belohnung: +"+format(boss.reward)+" Aura";
 document.querySelectorAll(".upgrade").forEach(b=>{const t=b.dataset.type;const c=t==="power"?state.powerCost:t==="multiplier"?state.multiplierCost:t==="combo"?state.comboCost:state.autoCost;b.disabled=state.aura<c});
 renderClickers();
}
function renderClickers(){
 const grid=$("clickerGrid");grid.innerHTML="";
 clickers.forEach(c=>{
  const owned=state.ownedClickers.includes(c.id),active=state.clicker===c.id;
  const card=document.createElement("div");card.className="clicker-card"+(active?" active":"")+(owned?"":" locked");
  card.innerHTML=`<button data-clicker="${c.id}" ${owned?"":"disabled"}><div class="clicker-preview preview-${c.id}"></div><h3>${c.icon} ${c.name}</h3><p>${c.desc}</p><span class="price">${owned?(active?"✓ Ausgerüstet":"Ausrüsten"):"✨ "+format(c.cost)}</span></button>${owned?"":"<span class='locked-badge'>GESPERRT</span>"}`;
  grid.appendChild(card);
 });
 grid.querySelectorAll("[data-clicker]").forEach(b=>b.addEventListener("click",()=>equipClicker(b.dataset.clicker)));
}
function checkLevel(){
 const needed=state.level*1000;
 while(state.aura>=needed){state.level++;state.power+=1;state.aura-=needed;$("message").textContent="🎉 Level Up! +1 Aura Power";break}
}
function updateCrit(){
 state.critX+=state.critDir*.012;
 if(state.critX>.82){state.critX=.82;state.critDir=-1}
 if(state.critX<.02){state.critX=.02;state.critDir=1}
 $("critZone").style.left=(state.critX*100)+"%";
}
function farm(){
 const marker=Math.random();
 const zoneStart=state.critX,zoneEnd=zoneStart+.18;
 const crit=marker>=zoneStart&&marker<=zoneEnd;
 const critMulti=crit?2:1;
 const gain=Math.max(1,Math.floor(state.power*state.combo*state.multiplier*critMulti));
 state.aura+=gain;state.combo=Math.min(12,state.combo+state.comboBoost);
 state.bossHp-=Math.max(1,Math.floor(state.power*state.multiplier*critMulti));
 if(state.bossHp<=0)defeatBoss();
 else $("message").textContent=(crit?"💥 KRITISCH! ":"+")+gain+" Aura"+(crit?" ×2!":" ✨");
 checkLevel();save();render();
 $("auraCore").animate([{transform:"scale(1)"},{transform:"scale(.94)"},{transform:"scale(1)"}],{duration:100});
}
function defeatBoss(){
 const boss=currentBoss();state.aura+=boss.reward;
 if(state.bossIndex<bosses.length-1){state.bossIndex++;state.bossHp=bosses[state.bossIndex].hp;state.level++;state.power+=5;$("message").textContent="🏆 "+boss.name+" besiegt! Neuer Gegner!";
 }else{state.bossHp=boss.hp;$("message").textContent="👑 Du hast alle aktuellen Bosse besiegt!";state.power+=10}
}
function buy(type){
 let cost;
 if(type==="power"){cost=state.powerCost;if(state.aura<cost)return;state.aura-=cost;state.power++;state.powerCost=Math.ceil(cost*1.55)}
 if(type==="multiplier"){cost=state.multiplierCost;if(state.aura<cost)return;state.aura-=cost;state.multiplier+=.25;state.multiplierCost=Math.ceil(cost*2.1)}
 if(type==="combo"){cost=state.comboCost;if(state.aura<cost)return;state.aura-=cost;state.comboBoost+=.025;state.comboCost=Math.ceil(cost*1.8)}
 if(type==="auto"){cost=state.autoCost;if(state.aura<cost)return;state.aura-=cost;state.autoAura++;state.autoCost=Math.ceil(cost*2)}
 $("message").textContent="Upgrade gekauft! 🔥";save();render();
}
function equipClicker(id){
 const c=clickers.find(x=>x.id===id);if(!c)return;
 if(!state.ownedClickers.includes(id)){if(state.aura<c.cost)return;state.aura-=c.cost;state.ownedClickers.push(id)}
 state.clicker=id;$("auraCore").className="aura-core clicker-"+id;save();render();$("message").textContent=c.name+" ausgerüstet!";
}
document.querySelectorAll(".upgrade").forEach(b=>b.addEventListener("click",()=>buy(b.dataset.type)));
$("auraCore").addEventListener("click",farm);
$("resetBtn").addEventListener("click",()=>{if(confirm("Spielstand wirklich löschen?")){state={...defaults,ownedClickers:["basic"]};save();render();$("auraCore").className="aura-core clicker-basic";$("message").textContent="Spielstand zurückgesetzt."}});
setInterval(updateCrit,80);
setInterval(()=>{if(state.autoAura>0){state.aura+=state.autoAura;save();render()}},1000);
setInterval(()=>{if(state.combo>1){state.combo=1;render()}},1800);
$("auraCore").className="aura-core clicker-"+state.clicker;render();