const SAVE_KEY="aura-farming-save-v1";
const defaults={aura:0,level:1,power:1,combo:1,comboBoost:.08,powerCost:25,comboCost:75,autoCost:150,autoAura:0};
let state={...defaults,...JSON.parse(localStorage.getItem(SAVE_KEY)||"{}")};

const $=id=>document.getElementById(id);
const format=n=>Math.floor(n).toLocaleString("de-DE");

function save(){localStorage.setItem(SAVE_KEY,JSON.stringify(state));}
function render(){
  $("aura").textContent=format(state.aura);
  $("level").textContent=state.level;
  $("power").textContent=state.power;
  $("combo").textContent="x"+state.combo.toFixed(2);
  $("comboBadge").textContent="COMBO x"+state.combo.toFixed(2);
  $("powerCost").textContent=format(state.powerCost);
  $("comboCost").textContent=format(state.comboCost);
  $("autoCost").textContent=format(state.autoCost);
  $("autoInfo").textContent="Auto-Aura: "+state.autoAura+"/s";
  document.querySelectorAll(".upgrade").forEach(button=>{
    const type=button.dataset.type;
    const cost=type==="power"?state.powerCost:type==="combo"?state.comboCost:state.autoCost;
    button.disabled=state.aura<cost;
  });
}
function checkLevel(){
  const needed=state.level*100;
  if(state.aura>=needed){
    state.level++;
    state.power++;
    $("message").textContent="🎉 Level Up! +1 Aura Power";
  }
}
function farm(){
  const gain=Math.max(1,Math.floor(state.power*state.combo));
  state.aura+=gain;
  state.combo=Math.min(10,state.combo+state.comboBoost);
  $("message").textContent="+"+gain+" Aura ✨";
  checkLevel();
  save();
  render();
}
function buy(type){
  let cost;
  if(type==="power"){
    cost=state.powerCost;if(state.aura<cost)return;
    state.aura-=cost;state.power++;state.powerCost=Math.ceil(cost*1.65);
  }else if(type==="combo"){
    cost=state.comboCost;if(state.aura<cost)return;
    state.aura-=cost;state.comboBoost+=.025;state.comboCost=Math.ceil(cost*1.8);
  }else{
    cost=state.autoCost;if(state.aura<cost)return;
    state.aura-=cost;state.autoAura++;state.autoCost=Math.ceil(cost*2);
  }
  $("message").textContent="Upgrade gekauft! 🔥";
  save();render();
}
$("auraCore").addEventListener("click",farm);
document.querySelectorAll(".upgrade").forEach(button=>button.addEventListener("click",()=>buy(button.dataset.type)));
$("resetBtn").addEventListener("click",()=>{
  if(confirm("Spielstand wirklich löschen?")){state={...defaults};save();render();$("message").textContent="Spielstand zurückgesetzt.";}
});
setInterval(()=>{
  if(state.autoAura>0){state.aura+=state.autoAura;checkLevel();save();render();}
},1000);
setInterval(()=>{
  if(state.combo>1){state.combo=1;render();}
},1800);
render();