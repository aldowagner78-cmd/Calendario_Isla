(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))c(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&c(i)}).observe(document,{childList:!0,subtree:!0});function n(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function c(o){if(o.ep)return;o.ep=!0;const a=n(o);fetch(o.href,a)}})();const H=["01-01","24-03","02-04","01-05","25-05","20-06","09-07","08-12","25-12"],x={"22-10":"Aldo","25-06":"Gaston","28-01":"Machi","25-07":"Fabi","01-12":"Romi"};function I(t){const e=t%19,n=Math.floor(t/100),c=t%100,o=Math.floor(n/4),a=n%4,i=Math.floor((n+8)/25),s=Math.floor((n-i+1)/3),d=(19*e+n-o-s+15)%30,f=Math.floor(c/4),l=c%4,r=(32+2*a+2*f-d-l)%7,u=Math.floor((e+11*d+22*r)/451),g=Math.floor((d+r-7*u+114)/31),h=(d+r-7*u+114)%31+1;return new Date(t,g-1,h)}const M={};function E(t){if(M[t])return M[t];const e=new Set;H.forEach(i=>{const[s,d]=i.split("-");e.add(`${t}-${d}-${s}`)});const n=I(t),c=new Date(n.getTime());c.setDate(n.getDate()-2),e.add(c.toISOString().split("T")[0]);const o=new Date(n.getTime());o.setDate(n.getDate()-48),e.add(o.toISOString().split("T")[0]);const a=new Date(n.getTime());return a.setDate(n.getDate()-47),e.add(a.toISOString().split("T")[0]),["17-08","12-10","20-11"].forEach(i=>{const[s,d]=i.split("-");e.add(`${t}-${d}-${s}`)}),M[t]=e,e}function $(t){const e=t.getFullYear(),n=E(e),c=t.toISOString().split("T")[0];return n.has(c)}function A(t){const e=t.getDate().toString().padStart(2,"0"),n=(t.getMonth()+1).toString().padStart(2,"0"),c=`${e}-${n}`;return x[c]||null}const p=[{id:1,name:"Machi",color:"#26C6DA",initial:"M"},{id:2,name:"Fabi",color:"#7E57C2",initial:"F"},{id:3,name:"Gaston",color:"#FFA000",initial:"G"},{id:4,name:"Romi",color:"#EF5350",initial:"R"},{id:5,name:"Aldo",color:"#66BB6A",initial:"A"}],L=new Date("2026-02-09T00:00:00"),N=["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],W=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];let m=new Date,w=JSON.parse(localStorage.getItem("isla_bonita_overrides"))||{};function C(t,e){w[t]=e,localStorage.setItem("isla_bonita_overrides",JSON.stringify(w)),y=null,v()}function T(t){const e=t.getDay();return e===0||e===6?!1:!$(t)}function Y(t){const e=new Date(t);e.setHours(0,0,0,0);const n=e.getDay();return e.setDate(e.getDate()-(n===0?6:n-1)),e}let y=null;function B(){const t={},e={};p.forEach(a=>e[a.id]=0);const n=new Date(L);n.setHours(0,0,0,0);const c=new Date;c.setFullYear(c.getFullYear()+2);let o=Y(n);for(;o<=c;){const a=[];for(let i=0;i<5;i++){const s=new Date(o);s.setDate(o.getDate()+i),s.setHours(0,0,0,0),s>=n&&T(s)&&a.push(s)}if(a.length>0){const i=Math.round((o.getTime()-n.getTime())/6048e5),s=[...p].sort((l,r)=>{const u=e[l.id]-e[r.id];if(u!==0)return u;const g=(p.indexOf(l)+i)%5,h=(p.indexOf(r)+i)%5;return g-h}),d=new Set(s.slice(0,a.length).map(l=>l.id)),f=p.map(l=>({person:l,rot:(p.indexOf(l)+i)%5})).filter(l=>d.has(l.person.id)).sort((l,r)=>l.rot-r.rot).map(l=>l.person);for(let l=0;l<a.length;l++){const r=a[l].toISOString().split("T")[0];t[r]=f[l],e[f[l].id]++}}o=new Date(o),o.setDate(o.getDate()+7)}return t}function _(){return y||(y=B()),y}function b(t){const e=t.toISOString().split("T")[0];return w[e]?p.find(c=>c.id===w[e]):T(t)&&_()[e]||null}function q(t){const e=new Date(t);e.setHours(0,0,0,0);const n=e.getDay(),c=e.getDate()-n+(n===0?-6:1);e.setDate(c);const o=[];for(let a=0;a<5;a++){const i=new Date(e);i.setDate(e.getDate()+a),o.push({date:i,dateStr:i.toISOString().split("T")[0],dayNum:i.getDate(),person:b(i),isHoliday:$(i),birthday:A(i),isToday:i.toDateString()===new Date().toDateString()})}return o}function z(){m.setDate(m.getDate()-7),v()}function J(){m.setDate(m.getDate()+7),v()}function P(){m=new Date,v()}function R(){m.setMonth(m.getMonth()-1),v()}function V(){m.setMonth(m.getMonth()+1),v()}function j(t){const e=t.getFullYear(),n=t.getMonth(),c=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],o=new Date(e,n,1),a=new Date(e,n+1,0).getDate();let i=o.getDay();i=i===0?6:i-1;const s=new Date;s.setHours(0,0,0,0);const d=[],f={};p.forEach(r=>f[r.id]=0);for(let r=0;r<i;r++)d.push('<div class="mcal-cell empty"></div>');for(let r=1;r<=a;r++){const u=new Date(e,n,r);u.setHours(0,0,0,0);const g=b(u),h=u.getTime()===s.getTime(),O=u.getDay()===0||u.getDay()===6,F=$(u);g&&f[g.id]++;let S="mcal-cell";h&&(S+=" mcal-today"),(O||F)&&(S+=" mcal-off");let k=`<span class="mcal-num">${r}</span>`;g&&(k+=`<span class="mcal-dot" style="background:${g.color}"></span>`),d.push(`<div class="${S}">${k}</div>`)}const l=p.map(r=>`<div class="mcal-summary-item">
      <span class="mcal-summary-dot" style="background:${r.color}"></span>
      <span class="mcal-summary-name">${r.name}</span>
      <span class="mcal-summary-count">${f[r.id]}</span>
    </div>`).join("");return`
    <div class="mcal-card">
      <div class="mcal-header">
        <button class="nav-btn" onclick="prevMonth()">❮</button>
        <span class="mcal-title">${c[n]} ${e}</span>
        <button class="nav-btn" onclick="nextMonth()">❯</button>
      </div>
      <div class="mcal-grid">
        <div class="mcal-head">Lu</div>
        <div class="mcal-head">Ma</div>
        <div class="mcal-head">Mi</div>
        <div class="mcal-head">Ju</div>
        <div class="mcal-head">Vi</div>
        <div class="mcal-head mcal-off-head">Sa</div>
        <div class="mcal-head mcal-off-head">Do</div>
        ${d.join("")}
      </div>
      <div class="mcal-summary">
        <h4 class="mcal-summary-title">Home Office del mes</h4>
        ${l}
      </div>
    </div>
  `}const G=document.querySelector("#app");let D=null;function v(){const t=new Date,e=q(m),n=b(t),c=new Date(t);do c.setDate(c.getDate()+1);while(!T(c)&&c.getFullYear()===t.getFullYear());const o=b(c),a=W[e[0].date.getMonth()],i=e[0].date.getFullYear();G.innerHTML=`
    <header>
      <div class="logo-container">
        <img src="logo.svg" alt="Isla Bonita">
      </div>
      <div>
        <h1>Isla Bonita</h1>
        <p style="font-size: 0.7rem; opacity: 0.6; margin-top: -2px;">Home Office Tracker</p>
      </div>
    </header>

    <main>
      <div class="calendar-card">
        <div class="calendar-header">
          <button class="nav-btn" onclick="prevWeek()">❮</button>
          <div style="text-align: center;">
            <span class="calendar-title">${a} ${i}</span>
            <div style="font-size: 0.7rem; opacity: 0.6;">Semana del ${e[0].dayNum} al ${e[4].dayNum}</div>
          </div>
          <button class="nav-btn" onclick="nextWeek()">❯</button>
        </div>
        
        <div class="week-grid">
          ${e.map(s=>`
            <div class="day-cell ${s.isToday?"active":""} ${s.isHoliday?"holiday":""}" 
                 onclick="${s.isHoliday?"":`openSwapDialog('${s.dateStr}')`}">
              <div style="font-size: 0.7rem; font-weight: 700; margin-bottom: 2px;">
                ${N[s.date.getDay()].substring(0,3)} ${s.dayNum}
              </div>
              
              ${s.isHoliday?'<div style="font-size: 1.5rem;">🇦🇷</div>':s.birthday?'<div class="user-avatar" style="background: #FFF0F5; color: #D81B60; border: 1px solid #FF69B4; font-size: 1.2rem;">🎂</div>':`<div class="user-avatar" style="${s.isToday?"":"color: "+s.person?.color}">
                      ${s.person?.initial||"?"}
                     </div>`}
              ${s.birthday?`<div style="font-size: 0.5rem; color: #D81B60; margin-top: -5px; font-weight: 700;">Cumple ${s.birthday}</div>`:""}
              ${!s.isHoliday&&!s.birthday&&s.person?`<div style="font-size: 0.6rem; opacity: 0.8;">${s.person.name}</div>`:""}
            </div>
          `).join("")}
        </div>
        <button class="btn-today" onclick="goToToday()" style="${K(m)?"display:none":""}">Volver a Hoy</button>
      </div>

      <div class="info-section">
        <div class="card big-card">
          <div class="icon-box bg-palm">🏠</div>
          <div class="card-content">
            <h3 class="label-small">Hoy le toca:</h3>
            <p class="name-big">${n?n.name:"Nadie (Feriado/Finde)"}</p>
          </div>
        </div>

        <div class="card big-card">
          <div class="icon-box bg-sea">🌅</div>
          <div class="card-content">
            <h3 class="label-small">Mañana le toca:</h3>
            <p class="name-big">${o?o.name:"Nadie"}</p>
          </div>
        </div>

        <div class="card" id="btn-swap-info" style="opacity: 0.7;">
          <div class="icon-box bg-sun">💡</div>
          <div class="card-content">
            <h3>Tip:</h3>
            <p>Toca un día en el calendario para cambiar.</p>
          </div>
        </div>
      </div>

      ${j(m)}

      <div id="install-banner" class="install-banner">
        <p>¿Instalar Isla Bonita?</p>
        <button id="btn-install" class="btn-install">Instalar</button>
      </div>
    </main>

    <div id="swap-modal" class="swap-modal">
      <div class="modal-content">
        <h2 class="modal-title">Asignar día a:</h2>
        <div class="team-list">
          ${p.map(s=>`
            <div class="team-item" onclick="confirmSwap(${s.id})">
              <div class="user-avatar" style="color: ${s.color}">${s.initial}</div>
              <span>${s.name}</span>
            </div>
          `).join("")}
        </div>
        <button id="close-modal" style="margin-top: 20px; width: 100%; padding: 10px; border: none; background: #eee; border-radius: 12px; font-weight: 600;">Cancelar</button>
      </div>
    </div>
  `,U()}function K(t){const e=new Date,n=new Date(e);n.setHours(0,0,0,0);const c=n.getDay(),o=n.getDate()-c+(c===0?-6:1);n.setDate(o);const a=new Date(t);a.setHours(0,0,0,0);const i=a.getDay(),s=a.getDate()-i+(i===0?-6:1);return a.setDate(s),n.getTime()===a.getTime()}window.openSwapDialog=t=>{D=t,document.querySelector("#swap-modal").style.display="flex"};window.confirmSwap=t=>{D&&(C(D,t),D=null,document.querySelector("#swap-modal").style.display="none")};window.prevWeek=z;window.nextWeek=J;window.goToToday=P;window.prevMonth=R;window.nextMonth=V;function U(){let t;window.addEventListener("beforeinstallprompt",o=>{o.preventDefault(),t=o;const a=document.querySelector("#install-banner");a&&(a.style.display="flex")});const e=document.querySelector("#btn-install");e&&e.addEventListener("click",async()=>{if(t){t.prompt();const{outcome:o}=await t.userChoice;o==="accepted"&&(document.querySelector("#install-banner").style.display="none"),t=null}});const n=document.querySelector("#swap-modal"),c=document.querySelector("#close-modal");c&&c.addEventListener("click",()=>{n.style.display="none"})}"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("sw.js").then(t=>{console.log("SW registrado",t),t.update()}).catch(t=>console.log("SW error",t))});try{v()}catch(t){console.error("Error al renderizar:",t),document.querySelector("#app").innerHTML='<p style="padding:20px;text-align:center;">Error al cargar. Recargá la página.</p>'}
