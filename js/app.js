// ─── DATA ───────────────────────────────────────────────────────────────────

const STAGE_CFG = {
  "South Stage":   {color:"#b8a9f0", bg:"rgba(184,169,240,0.18)", dark:"#7e6fd4"},
  "North Stage":   {color:"#7ec8e3", bg:"rgba(126,200,227,0.18)", dark:"#4aa8cb"},
  "Marquee":       {color:"#7ed9a0", bg:"rgba(126,217,160,0.18)", dark:"#4bb878"},
  "Jupiler Stage": {color:"#f0a07a", bg:"rgba(240,160,122,0.18)", dark:"#d47848"},
  "Metal Dome":    {color:"#f0d07a", bg:"rgba(240,208,122,0.18)", dark:"#c8a830"},
};
const STAGES = Object.keys(STAGE_CFG);
const DAYS = ["Thursday 18th June","Friday 19th June","Saturday 20th June","Sunday 21st June"];
const DAY_SHORT = ["Thu 18","Fri 19","Sat 20","Sun 21"];

const AVATAR_COLORS = ["#b8a9f0","#7ec8e3","#7ed9a0","#f0a07a","#f0d07a","#e8c547","#f07ba0","#a0d4f0"];

function toMins(t){const[h,m]=t.split(":").map(Number);return h*60+m;}

// Proper display of times past midnight
function fmtT(mins){
  let h = Math.floor(mins/60);
  const m = mins % 60;
  // Display 24:00+ as 00:xx, 01:xx etc for the ruler
  if(h >= 24) h -= 24;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
}

// For ruler display, show "00:30" but annotate "+1" for next-day times
function fmtRuler(mins){
  const h = Math.floor(mins/60);
  const m = mins % 60;
  const dh = h >= 24 ? h - 24 : h;
  const suffix = h >= 24 ? "⁺¹" : "";
  return `${String(dh).padStart(2,"0")}:${String(m).padStart(2,"0")}${suffix}`;
}

const RAW = {
  "South Stage":{
    "Thursday 18th June":[["12:50","13:35","Ego Kill Talent"],["14:30","15:15","Danko Jones"],["16:20","17:10","Accept"],["18:20","19:20","A Day To Remember"],["20:40","21:55","Within Temptation"],["23:30","25:00","The Offspring"]],
    "Friday 19th June":[["12:00","12:45","Quicksand"],["13:50","14:40","Bush"],["15:50","16:40","Cavalera 'Chaos A.D.'"],["17:50","18:40","Sex Pistols ft. Frank Carter"],["20:00","21:00","Alter Bridge"],["22:35","24:05","Volbeat"]],
    "Saturday 20th June":[["12:50","13:35","Fleddy Melculy"],["14:35","15:25","Malevolence"],["16:35","17:25","Hollywood Undead"],["18:35","19:35","Ice Nine Kills"],["20:55","22:10","Architects"],["24:00","25:30","Bring Me The Horizon"]],
    "Sunday 21st June":[["12:00","12:50","Battle Beast"],["14:00","14:50","Life Of Agony"],["16:00","16:50","Extreme"],["18:00","19:00","Black Label Society"],["20:25","21:40","Electric Callboy"],["23:30","25:00","Sabaton"]],
  },
  "North Stage":{
    "Thursday 18th June":[["13:40","14:25","Static-X"],["15:20","16:10","Wind Rose"],["17:20","18:10","Tom Morello"],["19:30","20:30","Megadeth"],["22:05","23:20","Limp Bizkit"]],
    "Friday 19th June":[["14:50","15:40","Drowning Pool"],["16:50","17:40","Mammoth"],["18:50","19:50","Trivium"],["21:10","22:25","Breaking Benjamin"],["24:15","25:35","Knocked Loose"]],
    "Saturday 20th June":[["12:00","12:45","The Pretty Wild"],["13:40","14:25","P.O.D."],["15:35","16:25","Sepultura"],["17:30","18:25","Three Days Grace"],["19:45","20:45","Babymetal"],["22:20","23:50","Bad Omens"]],
    "Sunday 21st June":[["15:00","15:50","Europe"],["17:00","17:50","Foreigner"],["19:10","20:15","Alice Cooper"],["21:50","23:20","Def Leppard"]],
  },
  "Marquee":{
    "Thursday 18th June":[["12:00","12:40","Distant"],["13:15","14:00","Dying Wish"],["14:40","15:30","Snot"],["16:10","17:00","Gatecreeper"],["17:40","18:30","Wolves In The Throne Room"],["19:10","20:00","Septicflesh"],["20:40","21:30","Cult Of Luna"],["22:30","23:45","Anthrax"]],
    "Friday 19th June":[["12:15","12:55","Hulder"],["13:30","14:15","Bark"],["14:50","15:35","Asomvel"],["16:15","17:05","Forbidden"],["17:55","18:45","Old Man's Child"],["19:25","20:15","Possessed"],["20:55","21:45","Death To All"],["22:35","23:35","Cradle of Filth"]],
    "Saturday 20th June":[["12:15","12:55","Embryonic Autopsy"],["13:40","14:25","Sinsaenum"],["15:05","15:50","Uada"],["16:25","17:15","Terrorizer"],["17:55","18:45","Lacuna Coil"],["19:20","20:10","Corrosion Of Conformity"],["20:55","21:45","Moonspell"],["22:35","23:35","Six Feet Under"]],
    "Sunday 21st June":[["12:00","12:40","Killus"],["13:15","14:00","Gaerea"],["14:40","15:30","Decapitated"],["16:10","17:00","Vltimas"],["17:40","18:30","Kanonenfieber"],["19:10","20:00","The Gathering"],["20:40","21:30","Venom"],["22:30","23:45","Mastodon"]],
  },
  "Jupiler Stage":{
    "Thursday 18th June":[["12:40","13:20","Blackgold"],["14:00","14:45","Slay Squad"],["15:40","16:25","Thrown"],["17:25","18:10","Grade 2"],["19:10","20:00","John Coffey"],["21:00","21:50","Pennywise"],["23:00","24:00","The Dillinger Escape Plan"]],
    "Friday 19th June":[["12:40","13:20","Thornhill"],["14:00","14:45","Letlive."],["15:40","16:25","Guilt Trip"],["17:20","18:10","Drain"],["19:10","20:00","We Came As Romans"],["21:00","21:50","Kublai Khan Tx"],["23:00","24:00","Lion Heart"]],
    "Saturday 20th June":[["12:40","13:20","Vicious Rumors"],["14:00","14:45","Feuerschwanz"],["15:40","16:25","Primal Fear"],["17:20","18:10","Orden Ogan"],["19:10","20:00","Sonata Arctica"],["21:00","21:50","Queensryche"],["23:00","24:00","Avatar"]],
    "Sunday 21st June":[["12:40","13:20","Scowl"],["14:00","14:45","Harms Way"],["15:40","16:25","Wargasm"],["17:25","18:10","Set It Off"],["19:10","20:00","Lagwagon"],["21:00","21:50","Bury Tomorrow"],["23:00","24:00","The Plot In You"]],
  },
  "Metal Dome":{
    "Thursday 18th June":[["12:00","12:40","Magnolia Park"],["13:20","14:00","Ankor"],["14:50","15:35","The Funeral Portrait"],["16:30","17:20","Sleep Theory"],["18:15","19:05","Lakeview"],["20:05","20:55","Bloodywood"],["21:55","22:55","President"]],
    "Friday 19th June":[["13:20","14:00","Oranssi Pazuzu"],["16:30","17:15","Harakiri For The Sky"],["18:15","19:05","Elder"],["20:05","20:55","Kadavar"],["21:55","22:55","Leprous"]],
    "Saturday 20th June":[["12:00","12:40","Mouth Culture"],["13:20","14:00","Faetooth"],["14:50","15:35","Rivers Of Nihil"],["16:30","17:15","Loathe"],["18:15","19:05","Catch Your Breath"],["20:05","20:55","Uncle Acid & The Deadbeats"],["21:55","22:55","Tesseract"]],
    "Sunday 21st June":[["12:00","12:40","Return To Dust"],["13:20","14:00","Rain City Drive"],["14:50","15:35","TX2"],["16:30","17:20","Future Palace"],["18:15","19:05","Periphery"],["20:05","20:55","Solstafir"],["21:55","22:55","Carpenter Brut"]],
  },
};

// ─── STATE ───────────────────────────────────────────────────────────────────

const STORAGE_KEY = "gmm2026_picks";
let currentUser = null;
let activeDay = 0; // synced across views
let currentView = "timeline";
let searchQuery = "";
let lastStateHash = "";

// ─── STORAGE ─────────────────────────────────────────────────────────────────

function loadShared(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}"); } catch(e){ return {}; }
}
function saveShared(data){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  try { ch.postMessage("update"); } catch(e){}
}

let ch;
try {
  ch = new BroadcastChannel("gmm2026");
  ch.onmessage = () => { render(); };
} catch(e){ ch = {postMessage:()=>{}}; }

// Reduced polling — only refresh if data actually changed
setInterval(() => {
  const hash = localStorage.getItem(STORAGE_KEY) || "";
  if(hash !== lastStateHash){ lastStateHash = hash; render(); }
}, 3000);

function getMyPicks(){
  const data = loadShared();
  return new Set(data[currentUser]?.picks || []);
}

function togglePick(bKey){
  if(!currentUser) return;
  const data = loadShared();
  if(!data[currentUser]) data[currentUser] = {name: currentUser, color: getUserColor(currentUser), picks:[]};
  const picks = new Set(data[currentUser].picks);
  const wasAdded = !picks.has(bKey);
  picks.has(bKey) ? picks.delete(bKey) : picks.add(bKey);
  data[currentUser].picks = [...picks];
  saveShared(data);
  lastStateHash = JSON.stringify(data);

  // Toast feedback
  const {name} = parseBandKey(bKey);
  showToast(wasAdded ? `★ Added ${name}` : `Removed ${name}`);
  render();
}

function bandKey(name, day){ return `${name}||${day}`; }
function parseBandKey(k){ const i=k.indexOf("||"); return {name:k.slice(0,i), day:k.slice(i+2)}; }

// ─── TOAST ───────────────────────────────────────────────────────────────────

let toastTimer = null;
function showToast(msg){
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> el.classList.remove("show"), 1800);
}

// ─── USER MANAGEMENT ────────────────────────────────────────────────────────

function getUserColor(name){
  let hash = 0;
  for(let i=0;i<name.length;i++) hash = name.charCodeAt(i) + ((hash<<5)-hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name){ return name.slice(0,2).toUpperCase(); }

function setUser(){
  const val = document.getElementById("nameInput").value.trim();
  if(!val) return;
  currentUser = val;
  document.getElementById("userBadge").textContent = val;
  closeModal();
  const data = loadShared();
  if(!data[currentUser]){ data[currentUser] = {name:currentUser, color:getUserColor(currentUser), picks:[]}; saveShared(data); }
  render();
}

function openModal(){
  const overlay = document.getElementById("nameModal");
  overlay.removeAttribute("aria-hidden");
  const inp = document.getElementById("nameInput");
  inp.value = currentUser || "";
  // Focus trap
  setTimeout(() => inp.focus(), 50);
  document.addEventListener("keydown", modalKeyHandler);
}

function closeModal(){
  document.getElementById("nameModal").setAttribute("aria-hidden","true");
  document.removeEventListener("keydown", modalKeyHandler);
}

function modalKeyHandler(e){
  if(e.key === "Escape"){ if(currentUser) closeModal(); }
  if(e.key === "Tab"){
    // Trap focus within modal
    const modal = document.querySelector(".modal");
    const focusable = modal.querySelectorAll("input, button");
    const first = focusable[0], last = focusable[focusable.length-1];
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }
}

// ─── CLASH DETECTION (cached per render) ─────────────────────────────────────

let clashCache = null;
let clashCacheKey = "";

function getBandData(name, day){
  for(const stage of STAGES){
    for(const [s,e,n] of (RAW[stage][day]||[])){
      if(n===name) return {name,day,stage,start:toMins(s),end:toMins(e),startStr:s,endStr:e};
    }
  }
  return null;
}

function getClashKeys(picks){
  const key = [...picks].sort().join("|");
  if(key === clashCacheKey && clashCache) return clashCache;

  const bands = [...picks].map(k=>{ const {name,day}=parseBandKey(k); return getBandData(name,day); }).filter(Boolean);
  const clashKeys = new Set();
  const clashPairs = [];
  for(let i=0;i<bands.length;i++){
    for(let j=i+1;j<bands.length;j++){
      const a=bands[i],b=bands[j];
      if(a.day===b.day && a.start<b.end && b.start<a.end){
        clashKeys.add(bandKey(a.name,a.day));
        clashKeys.add(bandKey(b.name,b.day));
        clashPairs.push([a,b]);
      }
    }
  }
  clashCache = {clashKeys, clashPairs};
  clashCacheKey = key;
  return clashCache;
}

// ─── EVENT DELEGATION (no inline handlers) ───────────────────────────────────

// Main tabs
document.querySelector(".main-tabs").addEventListener("click", e => {
  const tab = e.target.closest(".main-tab");
  if(!tab) return;
  const view = tab.dataset.view;
  switchView(view);
});

// User badge
document.getElementById("userBadge").addEventListener("click", openModal);

// Modal enter
document.getElementById("enterBtn").addEventListener("click", setUser);
document.getElementById("nameInput").addEventListener("keydown", e => { if(e.key==="Enter") setUser(); });

// Search
document.getElementById("searchInput").addEventListener("input", e => {
  searchQuery = e.target.value.toLowerCase().trim();
  renderBrowse();
});

// Timeline clicks (delegated)
document.getElementById("tlInner").addEventListener("click", e => {
  const band = e.target.closest(".tl-band");
  if(!band || !currentUser) return;
  togglePick(band.dataset.key);
});

// Timeline keyboard
document.getElementById("tlInner").addEventListener("keydown", e => {
  if(e.key === "Enter" || e.key === " "){
    const band = e.target.closest(".tl-band");
    if(!band || !currentUser) return;
    e.preventDefault();
    togglePick(band.dataset.key);
  }
});

// Browse clicks (delegated)
document.getElementById("brGrid").addEventListener("click", e => {
  const card = e.target.closest(".band-card");
  if(!card || !currentUser) return;
  togglePick(card.dataset.key);
});

// Browse keyboard
document.getElementById("brGrid").addEventListener("keydown", e => {
  if(e.key === "Enter" || e.key === " "){
    const card = e.target.closest(".band-card");
    if(!card || !currentUser) return;
    e.preventDefault();
    togglePick(card.dataset.key);
  }
});

// Picks clicks (delegated)
document.getElementById("picksContent").addEventListener("click", e => {
  const item = e.target.closest(".pick-item[data-key]");
  if(!item || !currentUser) return;
  togglePick(item.dataset.key);
});

document.getElementById("picksContent").addEventListener("keydown", e => {
  if(e.key === "Enter" || e.key === " "){
    const item = e.target.closest(".pick-item[data-key]");
    if(!item || !currentUser) return;
    e.preventDefault();
    togglePick(item.dataset.key);
  }
});

// Day tab clicks (delegated — both day tab sets)
document.addEventListener("click", e => {
  const dt = e.target.closest(".day-tab");
  if(!dt) return;
  const idx = parseInt(dt.dataset.day, 10);
  if(isNaN(idx)) return;
  activeDay = idx;
  render();
});

// ─── VIEW SWITCHING ──────────────────────────────────────────────────────────

function switchView(v){
  currentView = v;
  document.querySelectorAll(".section").forEach(s=>s.classList.remove("visible"));
  document.getElementById("v-"+v).classList.add("visible");
  document.querySelectorAll(".main-tab").forEach(t=>{
    const isActive = t.dataset.view === v;
    t.classList.toggle("active", isActive);
    t.setAttribute("aria-selected", isActive);
  });
  render();
}

function render(){
  if(currentView==="timeline") renderTimeline();
  else if(currentView==="browse") renderBrowse();
  else if(currentView==="picks") renderPicks();
  updateSharedCount();
  renderOnlineUsers();
}

// ─── LEGEND ──────────────────────────────────────────────────────────────────
function buildLegend(){
  document.getElementById("legend").innerHTML = STAGES.map(s=>`
    <div class="legend-pill">
      <div class="legend-dot" style="background:${STAGE_CFG[s].color}"></div>
      ${s}
    </div>`).join("");
}

// ─── DAY TABS ────────────────────────────────────────────────────────────────
function buildDayTabs(containerId){
  document.getElementById(containerId).innerHTML =
    DAYS.map((d,i)=>`<button class="day-tab${i===activeDay?" active":""}" role="tab" aria-selected="${i===activeDay}" data-day="${i}">${DAY_SHORT[i]}</button>`).join("");
}

// ─── TIMELINE ────────────────────────────────────────────────────────────────
function renderTimeline(){
  buildDayTabs("tlDays");
  const day = DAYS[activeDay];
  const myPicks = getMyPicks();
  const {clashKeys} = getClashKeys(myPicks);

  let minT=720, maxT=780;
  for(const st of STAGES) for(const [s,e] of (RAW[st][day]||[])){
    minT=Math.min(minT,toMins(s)); maxT=Math.max(maxT,toMins(e));
  }
  minT=Math.floor(minT/30)*30; maxT=Math.ceil(maxT/30)*30;
  const span = maxT-minT;
  const tickCount = span/30;

  const ticks=[];
  for(let t=minT;t<=maxT;t+=30) ticks.push(t);

  let html = `<div class="tl-ruler">
    <div class="tl-stage-label-hdr"></div>
    <div class="tl-ruler-times">
      ${ticks.map(t=>`<span class="tl-tick" style="left:${((t-minT)/span*100).toFixed(2)}%">${fmtRuler(t)}</span>`).join("")}
    </div>
  </div>`;

  for(const stage of STAGES){
    const cfg = STAGE_CFG[stage];
    const bands = RAW[stage][day]||[];
    html += `<div class="tl-row">
      <div class="tl-stage-label" style="border-left:3px solid ${cfg.color}">${stage}</div>
      <div class="tl-slots" style="--tick-count:${tickCount}">`;
    for(const [s,e,name] of bands){
      const sm=toMins(s), em=toMins(e);
      const left=((sm-minT)/span*100).toFixed(2);
      const width=((em-sm)/span*100).toFixed(2);
      const k = bandKey(name,day);
      const isFav = myPicks.has(k);
      const isClash = clashKeys.has(k);
      const bdr = isFav ? `border-color:${cfg.color};border-width:2px` : "";
      const displayS = fmtRuler(toMins(s));
      const displayE = fmtRuler(toMins(e));
      html += `<div class="tl-band${isFav?" fav":""}${isClash?" clash":""}"
        style="left:${left}%;width:calc(${width}% - 2px);background:${cfg.bg};color:${cfg.color};${bdr}"
        data-key="${escAttr(k)}"
        tabindex="0"
        role="button"
        aria-label="${escAttr(name)}, ${stage}, ${displayS} to ${displayE}${isFav?', favorited':''}${isClash?', time clash':''}"
        >
        <span style="overflow:hidden;text-overflow:ellipsis">${esc(name)}</span>
        ${isFav?`<span class="fav-star" aria-hidden="true">★</span>`:""}
        <span class="tl-tooltip">${esc(name)}<br>${stage} · ${displayS}–${displayE}</span>
      </div>`;
    }
    html += `</div></div>`;
  }
  document.getElementById("tlInner").innerHTML = html;
}

// ─── BROWSE ──────────────────────────────────────────────────────────────────
function renderBrowse(){
  buildDayTabs("brDays");
  const myPicks = getMyPicks();
  const {clashKeys} = getClashKeys(myPicks);
  const isSearching = searchQuery.length > 0;
  const countEl = document.getElementById("searchCount");
  const dayTabsEl = document.getElementById("brDays");

  // Hide day tabs when searching globally
  dayTabsEl.classList.toggle("hidden", isSearching);

  if(isSearching){
    // ── Global search across all days ──
    const allResults = [];
    for(const day of DAYS){
      const dayResults = [];
      for(const stage of STAGES){
        for(const [s,e,name] of (RAW[stage][day]||[])){
          if(name.toLowerCase().includes(searchQuery) || stage.toLowerCase().includes(searchQuery)){
            dayResults.push({name,stage,s,e,day});
          }
        }
      }
      dayResults.sort((a,b)=>toMins(a.s)-toMins(b.s));
      if(dayResults.length) allResults.push({day, bands: dayResults});
    }

    const totalCount = allResults.reduce((n,g)=>n+g.bands.length, 0);

    if(totalCount === 0){
      countEl.style.display = "none";
      document.getElementById("brGrid").innerHTML = `<div class="no-results">No bands matching "${esc(searchQuery)}"</div>`;
      return;
    }

    countEl.textContent = `${totalCount} result${totalCount!==1?"s":""} across ${allResults.length} day${allResults.length!==1?"s":""}`;
    countEl.style.display = "block";

    let html = "";
    for(const {day, bands} of allResults){
      html += `<div class="browse-day-header">${day}</div>`;
      for(const {name,stage,s,e} of bands){
        const k=bandKey(name,day);
        const fav=myPicks.has(k), clash=clashKeys.has(k);
        const cfg=STAGE_CFG[stage];
        html += renderBandCard({name,stage,s,e,day,k,fav,clash,cfg});
      }
    }
    document.getElementById("brGrid").innerHTML = html;

  } else {
    // ── Single day view ──
    countEl.style.display = "none";
    const day = DAYS[activeDay];
    const list = [];
    for(const stage of STAGES) for(const [s,e,name] of (RAW[stage][day]||[])) list.push({name,stage,s,e,day});
    list.sort((a,b)=>toMins(a.s)-toMins(b.s));

    document.getElementById("brGrid").innerHTML = list.map(({name,stage,s,e})=>{
      const k=bandKey(name,day);
      const fav=myPicks.has(k), clash=clashKeys.has(k);
      const cfg=STAGE_CFG[stage];
      return renderBandCard({name,stage,s,e,day,k,fav,clash,cfg});
    }).join("");
  }
}

function renderBandCard({name,stage,s,e,day,k,fav,clash,cfg}){
  const ds = fmtRuler(toMins(s)), de = fmtRuler(toMins(e));
  return `<div class="band-card${fav?" fav":""}${clash?" clash-card":""}" data-key="${escAttr(k)}" tabindex="0" role="button" aria-label="${escAttr(name)}, ${stage}, ${ds} to ${de}">
    <div class="stage-bar" style="background:${cfg.color}" aria-hidden="true"></div>
    <div class="band-info">
      <div class="band-name">${esc(name)}</div>
      <div class="band-meta">${stage} · ${ds}–${de}</div>
    </div>
    ${clash?`<span class="clash-tag" aria-label="Time clash">⚡ clash</span>`:""}
    <span class="fav-star-btn${fav?" on":""}" aria-hidden="true">${fav?"★":"☆"}</span>
  </div>`;
}

// ─── PICKS ───────────────────────────────────────────────────────────────────
function renderPicks(){
  const data = loadShared();
  const users = Object.keys(data).filter(u=>data[u].picks?.length>0);
  const c = document.getElementById("picksContent");

  if(!users.length){ c.innerHTML=`<div class="empty-msg">No picks yet — star some bands to add them here!</div>`; return; }

  // Sort: current user first
  users.sort((a,b) => (a===currentUser?-1:b===currentUser?1:a.localeCompare(b)));

  let html = "";
  for(const uname of users){
    const ud = data[uname];
    const picks = new Set(ud.picks||[]);
    const {clashKeys, clashPairs} = getClashKeys(picks);
    const color = ud.color || getUserColor(uname);
    const isMe = uname === currentUser;

    html += `<div class="picks-user-section">
      <div class="picks-user-header">
        <div class="avatar" style="background:${color};color:#000">${getInitials(uname)}</div>
        <span class="picks-user-name" style="color:${color}">${esc(uname)}${isMe?" (you)":""}</span>
        <span class="picks-count">${picks.size} pick${picks.size!==1?"s":""}</span>
      </div>`;

    if(clashPairs.length){
      html += `<div class="clash-summary" role="alert">`;
      html += clashPairs.map(([a,b])=>`<div class="clash-line">⚡ <strong>${esc(a.name)}</strong> vs <strong>${esc(b.name)}</strong> — ${a.day.split(" ")[0]} ${fmtRuler(a.start)}–${fmtRuler(a.end)} overlaps ${fmtRuler(b.start)}–${fmtRuler(b.end)}</div>`).join("");
      html += `</div>`;
    }

    for(const day of DAYS){
      const dayPicks = [...picks].filter(k=>parseBandKey(k).day===day)
        .map(k=>getBandData(parseBandKey(k).name, day)).filter(Boolean)
        .sort((a,b)=>a.start-b.start);
      if(!dayPicks.length) continue;

      html += `<div class="picks-day">
        <div class="picks-day-label">${day}</div>
        <div class="picks-list">`;
      for(const b of dayPicks){
        const k=bandKey(b.name,b.day);
        const clash=clashKeys.has(k);
        const cfg=STAGE_CFG[b.stage];
        const interactive = isMe;
        html += `<div class="pick-item${clash?" clash-pick":""}" ${interactive?`role="button" tabindex="0" data-key="${escAttr(k)}"`:""}>
          <div class="pick-dot" style="background:${cfg.color}" aria-hidden="true"></div>
          <span class="pick-name">${esc(b.name)}</span>
          <span class="pick-meta">${b.stage} · ${fmtRuler(b.start)}–${fmtRuler(b.end)}</span>
          ${clash?`<span class="clash-tag" aria-label="Time clash">⚡ clash</span>`:""}
          ${isMe?`<span style="color:${color};font-size:14px;margin-left:4px" aria-hidden="true">★</span>`:""}
        </div>`;
      }
      html += `</div></div>`;
    }
    html += `</div>`;
  }
  c.innerHTML = html;
}

function updateSharedCount(){
  const data = loadShared();
  const myCount = (data[currentUser]?.picks?.length) || 0;
  const el = document.getElementById("sharedCount");
  if(myCount>0){ el.textContent=myCount; el.style.display="inline-block"; }
  else el.style.display="none";
}

function renderOnlineUsers(){
  const data = loadShared();
  const users = Object.keys(data).filter(u=>data[u].picks?.length>0);
  const uEl = document.getElementById("onlineUsers");
  const lEl = document.getElementById("onlineLabel");
  uEl.innerHTML = users.slice(0,6).map(u=>{
    const color = data[u]?.color || getUserColor(u);
    return `<div class="avatar" style="background:${color};color:#000" aria-label="${esc(u)}">${getInitials(u)}</div>`;
  }).join("");
  lEl.textContent = users.length ? `${users.length} planner${users.length!==1?"s":""}` : "";
}

// ─── ESCAPING (XSS prevention) ───────────────────────────────────────────────

function esc(s){
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function escAttr(s){
  return s.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

// ─── INIT ────────────────────────────────────────────────────────────────────
buildLegend();
render();
// Modal starts visible; don't close it until user enters a name
document.getElementById("nameInput").focus();