// ─── STATE ───────────────────────────────────────────────────────────────────

let currentFestivalId = null;
let currentUser = null;
let activeDay = 0;
let currentView = "timeline";
let searchQuery = "";
let lastStateHash = "";
let mobileSort = "time";

let F = null;
let RAW = null;
let STAGES = null;
let STAGE_CFG = null;
let DAYS = null;
let DAY_SHORT = null;

const AVATAR_COLORS = ["#b8a9f0","#7ec8e3","#7ed9a0","#f0a07a","#f0d07a","#e8c547","#f07ba0","#a0d4f0"];

function toMins(t){const[h,m]=t.split(":").map(Number);return h*60+m;}
function fmtRuler(mins){
  let h=Math.floor(mins/60);const m=mins%60;
  const suffix=h>=24?"\u207A\u00B9":"";if(h>=24)h-=24;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}${suffix}`;
}
function esc(s){const d=document.createElement("div");d.textContent=s;return d.innerHTML;}
function escAttr(s){return s.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function bandKey(name,day){return `${name}||${day}`;}
function parseBandKey(k){const i=k.indexOf("||");return{name:k.slice(0,i),day:k.slice(i+2)};}
function getUserColor(name){let hash=0;for(let i=0;i<name.length;i++)hash=name.charCodeAt(i)+((hash<<5)-hash);return AVATAR_COLORS[Math.abs(hash)%AVATAR_COLORS.length];}
function getInitials(name){return name.slice(0,2).toUpperCase();}

// ─── STORAGE (namespaced per festival) ───────────────────────────────────────

function storageKey(){return `picks_${currentFestivalId}`;}
function loadShared(){try{return JSON.parse(localStorage.getItem(storageKey())||"{}");}catch(e){return{};}}
function saveShared(data){localStorage.setItem(storageKey(),JSON.stringify(data));try{ch.postMessage("update");}catch(e){}}

let ch;
try{ch=new BroadcastChannel("festival_planner");ch.onmessage=()=>{if(currentFestivalId)render();};}catch(e){ch={postMessage:()=>{}};}
setInterval(()=>{if(!currentFestivalId)return;const hash=localStorage.getItem(storageKey())||"";if(hash!==lastStateHash){lastStateHash=hash;render();}},3000);

function getMyPicks(){const data=loadShared();return new Set(data[currentUser]?.picks||[]);}

function togglePick(bKey){
  if(!currentUser)return;
  const data=loadShared();
  if(!data[currentUser])data[currentUser]={name:currentUser,color:getUserColor(currentUser),picks:[]};
  const picks=new Set(data[currentUser].picks);
  const wasAdded=!picks.has(bKey);
  picks.has(bKey)?picks.delete(bKey):picks.add(bKey);
  data[currentUser].picks=[...picks];
  saveShared(data);lastStateHash=JSON.stringify(data);
  const{name}=parseBandKey(bKey);
  showToast(wasAdded?`★ Added ${name}`:`Removed ${name}`);
  render();
}

// ─── TOAST ───────────────────────────────────────────────────────────────────
let toastTimer=null;
function showToast(msg){const el=document.getElementById("toast");el.textContent=msg;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),1800);}

// ─── CLASH DETECTION ─────────────────────────────────────────────────────────
let clashCache=null;let clashCacheKey="";
function getBandData(name,day){for(const stage of STAGES){for(const[s,e,n]of(RAW[stage][day]||[])){if(n===name)return{name,day,stage,start:toMins(s),end:toMins(e),startStr:s,endStr:e};}}return null;}
function getClashKeys(picks){
  const key=[...picks].sort().join("|");if(key===clashCacheKey&&clashCache)return clashCache;
  const bands=[...picks].map(k=>{const{name,day}=parseBandKey(k);return getBandData(name,day);}).filter(Boolean);
  const clashKeys=new Set();const clashPairs=[];
  for(let i=0;i<bands.length;i++){for(let j=i+1;j<bands.length;j++){const a=bands[i],b=bands[j];if(a.day===b.day&&a.start<b.end&&b.start<a.end){clashKeys.add(bandKey(a.name,a.day));clashKeys.add(bandKey(b.name,b.day));clashPairs.push([a,b]);}}}
  clashCache={clashKeys,clashPairs};clashCacheKey=key;return clashCache;
}

// ─── USER MANAGEMENT ─────────────────────────────────────────────────────────
function setUser(){
  const val=document.getElementById("nameInput").value.trim();if(!val)return;
  currentUser=val;document.getElementById("userBadge").textContent=val;
  localStorage.setItem("lastUser",currentUser);
  closeModal();
  const data=loadShared();if(!data[currentUser]){data[currentUser]={name:currentUser,color:getUserColor(currentUser),picks:[]};saveShared(data);}
  render();
}
function openModal(){document.getElementById("nameModal").removeAttribute("aria-hidden");const inp=document.getElementById("nameInput");inp.value=currentUser||"";setTimeout(()=>inp.focus(),50);document.addEventListener("keydown",modalKeyHandler);}
function closeModal(){document.getElementById("nameModal").setAttribute("aria-hidden","true");document.removeEventListener("keydown",modalKeyHandler);}
function modalKeyHandler(e){
  if(e.key==="Escape"){if(currentUser)closeModal();}
  if(e.key==="Tab"){const modal=document.querySelector(".modal");const focusable=modal.querySelectorAll("input, button");const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
}

// ─── FESTIVAL PICKER ─────────────────────────────────────────────────────────
function buildFestivalPicker(){
  document.getElementById("festivalGrid").innerHTML=Object.values(FESTIVALS).map(f=>`
    <button class="fest-card" data-fest="${f.id}" aria-label="${f.name}">
      <div class="fest-card-name">${esc(f.short)}</div>
      <div class="fest-card-meta">${esc(f.location)}</div>
      <div class="fest-card-meta">${esc(f.dates)}</div>
      <div class="fest-card-stages">${Object.keys(f.stages).length} stages · ${f.days.length} days</div>
      ${f.updated?.lineup?`<div class="fest-card-updated">Lineup updated: ${esc(f.updated.lineup)}</div>`:""}
    </button>`).join("");
}
function selectFestival(id){
  currentFestivalId=id;F=FESTIVALS[id];RAW=F.schedule;STAGE_CFG=F.stages;STAGES=Object.keys(STAGE_CFG);DAYS=F.days;DAY_SHORT=F.dayShort;
  activeDay=0;searchQuery="";document.getElementById("searchInput").value="";clashCache=null;clashCacheKey="";
  document.querySelector(".logo").innerHTML=`${esc(F.short)} <span>FESTIVAL PLANNER</span>`;
  document.title=`${F.short} — Festival Planner`;
  document.getElementById("festivalPicker").style.display="none";
  document.getElementById("appMain").style.display="block";
  document.querySelector("header").style.display="flex";
  document.getElementById("tab-prices").style.display=F.priceList?"":"none";
  buildLegend();switchView("timeline");
}
function showPicker(){
  document.getElementById("festivalPicker").style.display="flex";
  document.getElementById("appMain").style.display="none";
}

// ─── EVENT DELEGATION ────────────────────────────────────────────────────────
document.getElementById("festivalGrid").addEventListener("click",e=>{const card=e.target.closest(".fest-card");if(card)selectFestival(card.dataset.fest);});
document.getElementById("backBtn").addEventListener("click",showPicker);
document.querySelector(".main-tabs").addEventListener("click",e=>{const tab=e.target.closest(".main-tab");if(tab)switchView(tab.dataset.view);});
document.getElementById("userBadge").addEventListener("click",openModal);
document.getElementById("enterBtn").addEventListener("click",setUser);
document.getElementById("nameInput").addEventListener("keydown",e=>{if(e.key==="Enter")setUser();});
document.getElementById("searchInput").addEventListener("input",e=>{searchQuery=e.target.value.toLowerCase().trim();renderBrowse();});

document.getElementById("tlInner").addEventListener("click",e=>{const band=e.target.closest(".tl-band");if(band&&currentUser)togglePick(band.dataset.key);});
document.getElementById("tlInner").addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){const band=e.target.closest(".tl-band");if(band&&currentUser){e.preventDefault();togglePick(band.dataset.key);}}});
document.getElementById("tlMobile").addEventListener("click",e=>{const s=e.target.closest(".tl-mobile-sort-tab");if(s){mobileSort=s.dataset.sort;render();return;}const item=e.target.closest(".tl-mobile-item");if(item&&currentUser)togglePick(item.dataset.key);});
document.getElementById("tlMobile").addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){const item=e.target.closest(".tl-mobile-item");if(item&&currentUser){e.preventDefault();togglePick(item.dataset.key);}}});
document.getElementById("brGrid").addEventListener("click",e=>{const card=e.target.closest(".band-card");if(card&&currentUser)togglePick(card.dataset.key);});
document.getElementById("brGrid").addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){const card=e.target.closest(".band-card");if(card&&currentUser){e.preventDefault();togglePick(card.dataset.key);}}});
document.getElementById("picksContent").addEventListener("click",e=>{const item=e.target.closest(".pick-item[data-key]");if(item&&currentUser)togglePick(item.dataset.key);});
document.getElementById("picksContent").addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){const item=e.target.closest(".pick-item[data-key]");if(item&&currentUser){e.preventDefault();togglePick(item.dataset.key);}}});
document.addEventListener("click",e=>{const dt=e.target.closest(".day-tab");if(!dt)return;const idx=parseInt(dt.dataset.day,10);if(!isNaN(idx)){activeDay=idx;render();}});

// ─── VIEW SWITCHING ──────────────────────────────────────────────────────────
function switchView(v){
  currentView=v;
  document.querySelectorAll(".section").forEach(s=>s.classList.remove("visible"));
  document.getElementById("v-"+v).classList.add("visible");
  document.querySelectorAll(".main-tab").forEach(t=>{const isActive=t.dataset.view===v;t.classList.toggle("active",isActive);t.setAttribute("aria-selected",isActive);});
  render();
}
function render(){if(!currentFestivalId)return;if(currentView==="timeline")renderTimeline();else if(currentView==="browse")renderBrowse();else if(currentView==="picks")renderPicks();else if(currentView==="prices")renderPrices();updateSharedCount();renderOnlineUsers();}

// ─── LEGEND + DAY TABS ──────────────────────────────────────────────────────
function buildLegend(){document.getElementById("legend").innerHTML=STAGES.map(s=>`<div class="legend-pill"><div class="legend-dot" style="background:${STAGE_CFG[s].color}"></div>${s}</div>`).join("");}
function buildDayTabs(id){document.getElementById(id).innerHTML=DAYS.map((d,i)=>`<button class="day-tab${i===activeDay?" active":""}" role="tab" aria-selected="${i===activeDay}" data-day="${i}">${DAY_SHORT[i]}</button>`).join("");}

// ─── TIMELINE ────────────────────────────────────────────────────────────────
function renderTimeline(){
  buildDayTabs("tlDays");const day=DAYS[activeDay];const myPicks=getMyPicks();const{clashKeys}=getClashKeys(myPicks);
  const activeStages=STAGES.filter(s=>(RAW[s][day]||[]).length>0);
  if(!activeStages.length){document.getElementById("tlInner").innerHTML=`<div style="padding:2rem;text-align:center;color:var(--muted)">No scheduled acts this day</div>`;document.getElementById("tlMobile").innerHTML="";return;}
  let minT=720,maxT=780;for(const st of activeStages)for(const[s,e]of(RAW[st][day]||[])){minT=Math.min(minT,toMins(s));maxT=Math.max(maxT,toMins(e));}
  minT=Math.floor(minT/30)*30;maxT=Math.ceil(maxT/30)*30;const span=maxT-minT;const tickCount=span/30;
  const ticks=[];for(let t=minT;t<=maxT;t+=30)ticks.push(t);
  let html=`<div class="tl-ruler"><div class="tl-stage-label-hdr"></div><div class="tl-ruler-times">${ticks.map(t=>`<span class="tl-tick" style="left:${((t-minT)/span*100).toFixed(2)}%">${fmtRuler(t)}</span>`).join("")}</div></div>`;
  for(const stage of activeStages){const cfg=STAGE_CFG[stage];const bands=RAW[stage][day]||[];
    html+=`<div class="tl-row"><div class="tl-stage-label" style="border-left:3px solid ${cfg.color}">${stage}</div><div class="tl-slots" style="--tick-count:${tickCount}">`;
    for(const[s,e,name]of bands){const sm=toMins(s),em=toMins(e);const left=((sm-minT)/span*100).toFixed(2);const width=((em-sm)/span*100).toFixed(2);const k=bandKey(name,day);const isFav=myPicks.has(k);const isClash=clashKeys.has(k);const bdr=isFav?`border-color:${cfg.color};border-width:2px`:"";const dS=fmtRuler(sm),dE=fmtRuler(em);
      html+=`<div class="tl-band${isFav?" fav":""}${isClash?" clash":""}" style="left:${left}%;width:calc(${width}% - 2px);background:${cfg.bg};color:${cfg.color};${bdr}" data-key="${escAttr(k)}" tabindex="0" role="button" aria-label="${escAttr(name)}, ${stage}, ${dS} to ${dE}${isFav?', favorited':''}${isClash?', time clash':''}"><span style="overflow:hidden;text-overflow:ellipsis">${esc(name)}</span>${isFav?`<span class="fav-star" aria-hidden="true">★</span>`:""}<span class="tl-tooltip">${esc(name)}<br>${stage} · ${dS}–${dE}</span></div>`;}
    html+=`</div></div>`;}
  document.getElementById("tlInner").innerHTML=html;
  renderTimelineMobile(day,myPicks,clashKeys,activeStages);
}
function renderTimelineMobile(day,myPicks,clashKeys,activeStages){
  const all=[];for(const stage of activeStages)for(const[s,e,name]of(RAW[stage][day]||[]))all.push({name,stage,s,e,start:toMins(s),end:toMins(e)});
  let mHtml=`<div class="tl-mobile-sort-tabs"><button class="tl-mobile-sort-tab${mobileSort==="time"?" active":""}" data-sort="time">By time</button><button class="tl-mobile-sort-tab${mobileSort==="stage"?" active":""}" data-sort="stage">By stage</button></div>`;
  if(mobileSort==="stage"){for(const stage of activeStages){const cfg=STAGE_CFG[stage];const bands=all.filter(b=>b.stage===stage).sort((a,b)=>a.start-b.start);if(!bands.length)continue;
    mHtml+=`<div class="tl-mobile-stage-group"><div class="tl-mobile-stage-label"><span class="tl-mobile-stage-dot" style="background:${cfg.color}"></span>${stage}</div><div class="tl-mobile-list">`;for(const b of bands)mHtml+=renderMobileItem(b,day,myPicks,clashKeys);mHtml+=`</div></div>`;}}
  else{all.sort((a,b)=>a.start-b.start||a.stage.localeCompare(b.stage));mHtml+=`<div class="tl-mobile-list">`;for(const b of all)mHtml+=renderMobileItem(b,day,myPicks,clashKeys);mHtml+=`</div>`;}
  document.getElementById("tlMobile").innerHTML=mHtml;
}
function renderMobileItem(b,day,myPicks,clashKeys){const k=bandKey(b.name,day);const isFav=myPicks.has(k);const isClash=clashKeys.has(k);const cfg=STAGE_CFG[b.stage];const ds=fmtRuler(b.start),de=fmtRuler(b.end);
  return`<div class="tl-mobile-item${isFav?" fav":""}${isClash?" clash":""}" data-key="${escAttr(k)}" tabindex="0" role="button" aria-label="${escAttr(b.name)}, ${b.stage}, ${ds} to ${de}${isFav?', favorited':''}${isClash?', time clash':''}"><div class="tl-mobile-time">${ds}</div><div class="tl-mobile-bar" style="background:${cfg.color}" aria-hidden="true"></div><div class="tl-mobile-info"><div class="tl-mobile-name">${esc(b.name)}</div><div class="tl-mobile-meta">${b.stage} · ${ds}–${de}</div></div><div class="tl-mobile-right">${isClash?`<span class="clash-tag" aria-label="Time clash">⚡</span>`:""}<span class="fav-star-btn${isFav?" on":""}" aria-hidden="true">${isFav?"★":"☆"}</span></div></div>`;}

// ─── BROWSE ──────────────────────────────────────────────────────────────────
function renderBrowse(){
  buildDayTabs("brDays");const myPicks=getMyPicks();const{clashKeys}=getClashKeys(myPicks);const isSearching=searchQuery.length>0;
  const countEl=document.getElementById("searchCount");const dayTabsEl=document.getElementById("brDays");
  dayTabsEl.classList.toggle("hidden",isSearching);
  if(isSearching){const allResults=[];for(const day of DAYS){const dayResults=[];for(const stage of STAGES)for(const[s,e,name]of(RAW[stage][day]||[]))if(name.toLowerCase().includes(searchQuery)||stage.toLowerCase().includes(searchQuery))dayResults.push({name,stage,s,e,day});dayResults.sort((a,b)=>toMins(a.s)-toMins(b.s));if(dayResults.length)allResults.push({day,bands:dayResults});}
    const totalCount=allResults.reduce((n,g)=>n+g.bands.length,0);
    if(!totalCount){countEl.style.display="none";document.getElementById("brGrid").innerHTML=`<div class="no-results">No bands matching "${esc(searchQuery)}"</div>`;return;}
    countEl.textContent=`${totalCount} result${totalCount!==1?"s":""} across ${allResults.length} day${allResults.length!==1?"s":""}`;countEl.style.display="block";
    let html="";for(const{day,bands}of allResults){html+=`<div class="browse-day-header">${day}</div>`;for(const{name,stage,s,e}of bands){const k=bandKey(name,day);const fav=myPicks.has(k),clash=clashKeys.has(k);const cfg=STAGE_CFG[stage];html+=renderBandCard({name,stage,s,e,day,k,fav,clash,cfg});}}
    document.getElementById("brGrid").innerHTML=html;
  }else{countEl.style.display="none";const day=DAYS[activeDay];const list=[];for(const stage of STAGES)for(const[s,e,name]of(RAW[stage][day]||[]))list.push({name,stage,s,e,day});list.sort((a,b)=>toMins(a.s)-toMins(b.s));
    if(!list.length){document.getElementById("brGrid").innerHTML=`<div class="no-results">No scheduled acts this day</div>`;return;}
    document.getElementById("brGrid").innerHTML=list.map(({name,stage,s,e})=>{const k=bandKey(name,day);const fav=myPicks.has(k),clash=clashKeys.has(k);const cfg=STAGE_CFG[stage];return renderBandCard({name,stage,s,e,day,k,fav,clash,cfg});}).join("");}
}
function renderBandCard({name,stage,s,e,day,k,fav,clash,cfg}){const ds=fmtRuler(toMins(s)),de=fmtRuler(toMins(e));
  return`<div class="band-card${fav?" fav":""}${clash?" clash-card":""}" data-key="${escAttr(k)}" tabindex="0" role="button" aria-label="${escAttr(name)}, ${stage}, ${ds} to ${de}"><div class="stage-bar" style="background:${cfg.color}" aria-hidden="true"></div><div class="band-info"><div class="band-name">${esc(name)}</div><div class="band-meta">${stage} · ${ds}–${de}</div></div>${clash?`<span class="clash-tag" aria-label="Time clash">⚡ clash</span>`:""}<span class="fav-star-btn${fav?" on":""}" aria-hidden="true">${fav?"★":"☆"}</span></div>`;}

// ─── PICKS ───────────────────────────────────────────────────────────────────
function renderPicks(){
  const data=loadShared();const users=Object.keys(data).filter(u=>data[u].picks?.length>0);const c=document.getElementById("picksContent");
  if(!users.length){c.innerHTML=`<div class="empty-msg">No picks yet — star some bands to add them here!</div>`;return;}
  users.sort((a,b)=>(a===currentUser?-1:b===currentUser?1:a.localeCompare(b)));
  let html="";for(const uname of users){const ud=data[uname];const picks=new Set(ud.picks||[]);const{clashKeys,clashPairs}=getClashKeys(picks);const color=ud.color||getUserColor(uname);const isMe=uname===currentUser;
    html+=`<div class="picks-user-section"><div class="picks-user-header"><div class="avatar" style="background:${color};color:#000">${getInitials(uname)}</div><span class="picks-user-name" style="color:${color}">${esc(uname)}${isMe?" (you)":""}</span><span class="picks-count">${picks.size} pick${picks.size!==1?"s":""}</span></div>`;
    if(clashPairs.length){html+=`<div class="clash-summary" role="alert">`;html+=clashPairs.map(([a,b])=>`<div class="clash-line">⚡ <strong>${esc(a.name)}</strong> vs <strong>${esc(b.name)}</strong> — ${a.day.split(" ")[0]} ${fmtRuler(a.start)}–${fmtRuler(a.end)} overlaps ${fmtRuler(b.start)}–${fmtRuler(b.end)}</div>`).join("");html+=`</div>`;}
    for(const day of DAYS){const dayPicks=[...picks].filter(k=>parseBandKey(k).day===day).map(k=>getBandData(parseBandKey(k).name,day)).filter(Boolean).sort((a,b)=>a.start-b.start);if(!dayPicks.length)continue;
      html+=`<div class="picks-day"><div class="picks-day-label">${day}</div><div class="picks-list">`;
      for(const b of dayPicks){const k=bandKey(b.name,b.day);const clash=clashKeys.has(k);const cfg=STAGE_CFG[b.stage];
        html+=`<div class="pick-item${clash?" clash-pick":""}" ${isMe?`role="button" tabindex="0" data-key="${escAttr(k)}"`:""}><div class="pick-dot" style="background:${cfg.color}" aria-hidden="true"></div><span class="pick-name">${esc(b.name)}</span><span class="pick-meta">${b.stage} · ${fmtRuler(b.start)}–${fmtRuler(b.end)}</span>${clash?`<span class="clash-tag" aria-label="Time clash">⚡ clash</span>`:""}${isMe?`<span style="color:${color};font-size:14px;margin-left:4px" aria-hidden="true">★</span>`:""}</div>`;}
      html+=`</div></div>`;}
    html+=`</div>`;}
  c.innerHTML=html;
}
function updateSharedCount(){const data=loadShared();const myCount=(data[currentUser]?.picks?.length)||0;const el=document.getElementById("sharedCount");if(myCount>0){el.textContent=myCount;el.style.display="inline-block";}else el.style.display="none";}
function renderOnlineUsers(){const data=loadShared();const users=Object.keys(data).filter(u=>data[u].picks?.length>0);const uEl=document.getElementById("onlineUsers");const lEl=document.getElementById("onlineLabel");
  uEl.innerHTML=users.slice(0,6).map(u=>{const color=data[u]?.color||getUserColor(u);return`<div class="avatar" style="background:${color};color:#000" aria-label="${esc(u)}">${getInitials(u)}</div>`;}).join("");
  lEl.textContent=users.length?`${users.length} planner${users.length!==1?"s":""}`:"";}

// ─── PRICES ──────────────────────────────────────────────────────────────────
function renderPrices(){
  const pl=F.priceList;if(!pl){document.getElementById("pricesContent").innerHTML="";return;}
  const cur=pl.currency;
  let html=`<div class="prices-header">
    <div class="prices-currency-block">
      <div class="prices-currency-name">1 ${esc(cur.name)}</div>
      <div class="prices-currency-rates">
        <span class="prices-rate">€${cur.presale.toFixed(2)} <span class="prices-rate-label">presale</span></span>
        <span class="prices-rate-sep">/</span>
        <span class="prices-rate">€${cur.onsite.toFixed(2)} <span class="prices-rate-label">from ${esc(cur.onsiteFrom)}</span></span>
      </div>
    </div>
  </div>`;
  for(const section of pl.sections){
    html+=`<div class="prices-section"><div class="prices-section-title">${esc(section.name)}</div><div class="prices-list">`;
    for(const item of section.items){
      const eurPresale=(item.price*cur.presale).toFixed(2);const eurOnsite=(item.price*cur.onsite).toFixed(2);
      html+=`<div class="prices-item">
        <div class="prices-item-info">
          <span class="prices-item-name">${esc(item.name)}</span>
          ${item.detail?`<span class="prices-item-detail">${esc(item.detail)}</span>`:""}
        </div>
        <div class="prices-item-right">
          <span class="prices-item-skulls">${item.price} ${item.price===1?"SKULLY":"SKULLIES"}</span>
          <span class="prices-item-eur">€${eurPresale} / €${eurOnsite}</span>
        </div>
      </div>`;}
    html+=`</div></div>`;}
  const pricesUpdated=F.updated?.prices;
  html+=`<div class="prices-note">${pl.note}${pricesUpdated?` · Prices last updated: ${esc(pricesUpdated)}`:""}</div>`;
  document.getElementById("pricesContent").innerHTML=html;
}

// ─── INIT ────────────────────────────────────────────────────────────────────
buildFestivalPicker();
const savedUser=localStorage.getItem("lastUser");
if(savedUser){currentUser=savedUser;document.getElementById("userBadge").textContent=savedUser;}
else{openModal();}