(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function o(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(n){if(n.ep)return;n.ep=!0;const i=o(n);fetch(n.href,i)}})();const $=["01-01","24-03","02-04","01-05","25-05","20-06","09-07","08-12","25-12"],M={"22-10":"Aldo","25-06":"Gaston","28-01":"Machi","25-07":"Fabi","01-12":"Romi"};function k(e){const t=e%19,o=Math.floor(e/100),a=e%100,n=Math.floor(o/4),i=o%4,r=Math.floor((o+8)/25),s=Math.floor((o-r+1)/3),l=(19*t+o-n-s+15)%30,h=Math.floor(a/4),b=a%4,g=(32+2*i+2*h-l-b)%7,D=Math.floor((t+11*l+22*g)/451),S=Math.floor((l+g-7*D+114)/31),T=(l+g-7*D+114)%31+1;return new Date(e,S-1,T)}const f={};function F(e){if(f[e])return f[e];const t=new Set;$.forEach(r=>{const[s,l]=r.split("-");t.add(`${e}-${l}-${s}`)});const o=k(e),a=new Date(o.getTime());a.setDate(o.getDate()-2),t.add(a.toISOString().split("T")[0]);const n=new Date(o.getTime());n.setDate(o.getDate()-48),t.add(n.toISOString().split("T")[0]);const i=new Date(o.getTime());return i.setDate(o.getDate()-47),t.add(i.toISOString().split("T")[0]),["17-08","12-10","20-11"].forEach(r=>{const[s,l]=r.split("-");t.add(`${e}-${l}-${s}`)}),f[e]=t,t}function w(e){const t=e.getFullYear(),o=F(t),a=e.toISOString().split("T")[0];return o.has(a)}function O(e){const t=e.getDate().toString().padStart(2,"0"),o=(e.getMonth()+1).toString().padStart(2,"0"),a=`${t}-${o}`;return M[a]||null}const v=[{id:1,name:"Machi",color:"#26C6DA",initial:"M"},{id:2,name:"Fabi",color:"#7E57C2",initial:"F"},{id:3,name:"Gaston",color:"#FFA000",initial:"G"},{id:4,name:"Romi",color:"#EF5350",initial:"R"},{id:5,name:"Aldo",color:"#66BB6A",initial:"A"}],x=new Date("2026-02-09T00:00:00"),I=["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],H=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];let c=new Date,p=JSON.parse(localStorage.getItem("isla_bonita_overrides"))||{};function E(e,t){p[e]=t,localStorage.setItem("isla_bonita_overrides",JSON.stringify(p)),d()}function y(e){const t=e.getDay();return t===0||t===6?!1:!w(e)}function A(e){let t=0,o=new Date(x);o.setHours(0,0,0,0);const a=new Date(e);if(a.setHours(0,0,0,0),a<o)return-1;for(;o<a;)y(o)&&t++,o.setDate(o.getDate()+1);return t}function m(e){const t=e.toISOString().split("T")[0];if(p[t])return v.find(n=>n.id===p[t]);if(!y(e))return null;const a=A(e)%5;return v[a]}function W(e){const t=new Date(e);t.setHours(0,0,0,0);const o=t.getDay(),a=t.getDate()-o+(o===0?-6:1);t.setDate(a);const n=[];for(let i=0;i<5;i++){const r=new Date(t);r.setDate(t.getDate()+i),n.push({date:r,dateStr:r.toISOString().split("T")[0],dayNum:r.getDate(),person:m(r),isHoliday:w(r),birthday:O(r),isToday:r.toDateString()===new Date().toDateString()})}return n}function L(){c.setDate(c.getDate()-7),d()}function N(){c.setDate(c.getDate()+7),d()}function q(){c=new Date,d()}const B=document.querySelector("#app");let u=null;function d(){const e=new Date,t=W(c),o=m(e),a=new Date(e);do a.setDate(a.getDate()+1);while(!y(a)&&a.getFullYear()===e.getFullYear());const n=m(a),i=H[t[0].date.getMonth()],r=t[0].date.getFullYear();B.innerHTML=`
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
            <span class="calendar-title">${i} ${r}</span>
            <div style="font-size: 0.7rem; opacity: 0.6;">Semana del ${t[0].dayNum} al ${t[4].dayNum}</div>
          </div>
          <button class="nav-btn" onclick="nextWeek()">❯</button>
        </div>
        
        <div class="week-grid">
          ${t.map(s=>`
            <div class="day-cell ${s.isToday?"active":""} ${s.isHoliday?"holiday":""}" 
                 onclick="${s.isHoliday?"":`openSwapDialog('${s.dateStr}')`}">
              <div style="font-size: 0.7rem; font-weight: 700; margin-bottom: 2px;">
                ${I[s.date.getDay()].substring(0,3)} ${s.dayNum}
              </div>
              
              ${s.isHoliday?'<div style="font-size: 1.5rem;">🇦🇷</div>':s.birthday?'<div class="user-avatar" style="background: #FFF0F5; color: #D81B60; border: 1px solid #FF69B4; font-size: 1.2rem;">🎂</div>':`<div class="user-avatar" style="${s.isToday?"":"color: "+s.person?.color}">
                      ${s.person?.initial||"?"}
                     </div>`}
              ${s.birthday?`<div style="font-size: 0.5rem; color: #D81B60; margin-top: -5px; font-weight: 700;">Cumple ${s.birthday}</div>`:""}
              ${!s.isHoliday&&!s.birthday&&s.person?`<div style="font-size: 0.6rem; opacity: 0.8;">${s.person.name}</div>`:""}
            </div>
          `).join("")}
        </div>
        <button class="btn-today" onclick="goToToday()" style="${_(c)?"display:none":""}">Volver a Hoy</button>
      </div>

      <div class="info-section">
        <div class="card big-card">
          <div class="icon-box bg-palm">🏠</div>
          <div class="card-content">
            <h3 class="label-small">Hoy le toca:</h3>
            <p class="name-big">${o?o.name:"Nadie (Feriado/Finde)"}</p>
          </div>
        </div>

        <div class="card big-card">
          <div class="icon-box bg-sea">🌅</div>
          <div class="card-content">
            <h3 class="label-small">Mañana le toca:</h3>
            <p class="name-big">${n?n.name:"Nadie"}</p>
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

      <div id="install-banner" class="install-banner">
        <p>¿Instalar Isla Bonita?</p>
        <button id="btn-install" class="btn-install">Instalar</button>
      </div>
    </main>

    <div id="swap-modal" class="swap-modal">
      <div class="modal-content">
        <h2 class="modal-title">Asignar día a:</h2>
        <div class="team-list">
          ${v.map(s=>`
            <div class="team-item" onclick="confirmSwap(${s.id})">
              <div class="user-avatar" style="color: ${s.color}">${s.initial}</div>
              <span>${s.name}</span>
            </div>
          `).join("")}
        </div>
        <button id="close-modal" style="margin-top: 20px; width: 100%; padding: 10px; border: none; background: #eee; border-radius: 12px; font-weight: 600;">Cancelar</button>
      </div>
    </div>
  `,Y()}function _(e){const t=new Date,o=new Date(t);o.setHours(0,0,0,0);const a=o.getDay(),n=o.getDate()-a+(a===0?-6:1);o.setDate(n);const i=new Date(e);i.setHours(0,0,0,0);const r=i.getDay(),s=i.getDate()-r+(r===0?-6:1);return i.setDate(s),o.getTime()===i.getTime()}window.openSwapDialog=e=>{u=e,document.querySelector("#swap-modal").style.display="flex"};window.confirmSwap=e=>{u&&(E(u,e),u=null,document.querySelector("#swap-modal").style.display="none")};window.prevWeek=L;window.nextWeek=N;window.goToToday=q;function Y(){let e;window.addEventListener("beforeinstallprompt",n=>{n.preventDefault(),e=n;const i=document.querySelector("#install-banner");i&&(i.style.display="flex")});const t=document.querySelector("#btn-install");t&&t.addEventListener("click",async()=>{if(e){e.prompt();const{outcome:n}=await e.userChoice;n==="accepted"&&(document.querySelector("#install-banner").style.display="none"),e=null}});const o=document.querySelector("#swap-modal"),a=document.querySelector("#close-modal");a&&a.addEventListener("click",()=>{o.style.display="none"})}"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("sw.js").then(e=>{console.log("SW registrado",e),e.update()}).catch(e=>console.log("SW error",e))});try{d()}catch(e){console.error("Error al renderizar:",e),document.querySelector("#app").innerHTML='<p style="padding:20px;text-align:center;">Error al cargar. Recargá la página.</p>'}
