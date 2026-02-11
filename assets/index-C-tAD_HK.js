import{initializeApp as A}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";import{getDatabase as L,get as N,ref as $,onValue as W,set as B}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function o(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(a){if(a.ep)return;a.ep=!0;const n=o(a);fetch(a.href,n)}})();const C=["01-01","24-03","02-04","01-05","25-05","20-06","09-07","08-12","25-12"],z={"22-10":"Aldo","25-06":"Gaston","28-01":"Machi","25-07":"Fabi","01-12":"Romi"};function Y(e){const t=e%19,o=Math.floor(e/100),r=e%100,a=Math.floor(o/4),n=o%4,i=Math.floor((o+8)/25),s=Math.floor((o-i+1)/3),d=(19*t+o-a-s+15)%30,f=Math.floor(r/4),l=r%4,c=(32+2*n+2*f-d-l)%7,u=Math.floor((t+11*d+22*c)/451),v=Math.floor((d+c-7*u+114)/31),y=(d+c-7*u+114)%31+1;return new Date(e,v-1,y)}const M={};function q(e){if(M[e])return M[e];const t=new Set;C.forEach(i=>{const[s,d]=i.split("-");t.add(`${e}-${d}-${s}`)});const o=Y(e),r=new Date(o.getTime());r.setDate(o.getDate()-2),t.add(r.toISOString().split("T")[0]);const a=new Date(o.getTime());a.setDate(o.getDate()-48),t.add(a.toISOString().split("T")[0]);const n=new Date(o.getTime());return n.setDate(o.getDate()-47),t.add(n.toISOString().split("T")[0]),["17-08","12-10","20-11"].forEach(i=>{const[s,d]=i.split("-");t.add(`${e}-${d}-${s}`)}),M[e]=t,t}function T(e){const t=e.getFullYear(),o=q(t),r=e.toISOString().split("T")[0];return o.has(r)}function V(e){const t=e.getDate().toString().padStart(2,"0"),o=(e.getMonth()+1).toString().padStart(2,"0"),r=`${t}-${o}`;return z[r]||null}const R={apiKey:"AIzaSyDpSmmNGdB4HG08eyzJvNIwo4lVQM5_8mc",authDomain:"calendario-isla.firebaseapp.com",databaseURL:"https://calendario-isla-default-rtdb.firebaseio.com",projectId:"calendario-isla",storageBucket:"calendario-isla.firebasestorage.app",messagingSenderId:"972723637133",appId:"1:972723637133:web:de1144c95bdf747775cbc4",measurementId:"G-6MBBDHMLYV"},P=A(R),O=L(P);async function _(e,t){await B($(O,"overrides/"+e),t)}async function H(){const e=await N($(O,"overrides"));return e.exists()?e.val():{}}function J(e){W($(O,"overrides"),()=>{e()})}const p=[{id:1,name:"Machi",color:"#26C6DA",initial:"M"},{id:2,name:"Fabi",color:"#7E57C2",initial:"F"},{id:3,name:"Gaston",color:"#FFA000",initial:"G"},{id:4,name:"Romi",color:"#EF5350",initial:"R"},{id:5,name:"Aldo",color:"#66BB6A",initial:"A"}],j=new Date("2026-02-09T00:00:00"),G=["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],K=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];let m=new Date,D={},x=!0;(async()=>{try{D=await H()}catch(e){console.error("Error cargando overrides:",e)}x=!1,g(),J(async()=>{try{D=await H(),h=null,g()}catch(e){console.error("Error sincronizando:",e)}})})();async function U(e,t){D[e]=t,h=null,g();try{await _(e,t)}catch(o){console.error("Error guardando override:",o)}}function k(e){const t=e.getDay();return t===0||t===6?!1:!T(e)}function Q(e){const t=new Date(e);t.setHours(0,0,0,0);const o=t.getDay();return t.setDate(t.getDate()-(o===0?6:o-1)),t}let h=null;function X(){const e={},t={};p.forEach(n=>t[n.id]=0);const o=new Date(j);o.setHours(0,0,0,0);const r=new Date;r.setFullYear(r.getFullYear()+2);let a=Q(o);for(;a<=r;){const n=[];for(let i=0;i<5;i++){const s=new Date(a);s.setDate(a.getDate()+i),s.setHours(0,0,0,0),s>=o&&k(s)&&n.push(s)}if(n.length>0){const i=Math.round((a.getTime()-o.getTime())/6048e5),s=[...p].sort((l,c)=>{const u=t[l.id]-t[c.id];if(u!==0)return u;const v=(p.indexOf(l)+i)%5,y=(p.indexOf(c)+i)%5;return v-y}),d=new Set(s.slice(0,n.length).map(l=>l.id)),f=p.map(l=>({person:l,rot:(p.indexOf(l)+i)%5})).filter(l=>d.has(l.person.id)).sort((l,c)=>l.rot-c.rot).map(l=>l.person);for(let l=0;l<n.length;l++){const c=n[l].toISOString().split("T")[0];e[c]=f[l],t[f[l].id]++}}a=new Date(a),a.setDate(a.getDate()+7)}return e}function Z(){return h||(h=X()),h}function b(e){const t=e.toISOString().split("T")[0];return D[t]?p.find(r=>r.id===D[t]):k(e)&&Z()[t]||null}function ee(e){const t=new Date(e);t.setHours(0,0,0,0);const o=t.getDay(),r=t.getDate()-o+(o===0?-6:1);t.setDate(r);const a=[];for(let n=0;n<5;n++){const i=new Date(t);i.setDate(t.getDate()+n),a.push({date:i,dateStr:i.toISOString().split("T")[0],dayNum:i.getDate(),person:b(i),isHoliday:T(i),birthday:V(i),isToday:i.toDateString()===new Date().toDateString()})}return a}function te(){m.setDate(m.getDate()-7),g()}function oe(){m.setDate(m.getDate()+7),g()}function ae(){m=new Date,g()}function ne(){m.setMonth(m.getMonth()-1),g()}function se(){m.setMonth(m.getMonth()+1),g()}function ie(e){const t=e.getFullYear(),o=e.getMonth(),r=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],a=new Date(t,o,1),n=new Date(t,o+1,0).getDate();let i=a.getDay();i=i===0?6:i-1;const s=new Date;s.setHours(0,0,0,0);const d=[],f={};p.forEach(c=>f[c.id]=0);for(let c=0;c<i;c++)d.push('<div class="mcal-cell empty"></div>');for(let c=1;c<=n;c++){const u=new Date(t,o,c);u.setHours(0,0,0,0);const v=b(u),y=u.getTime()===s.getTime(),I=u.getDay()===0||u.getDay()===6,E=T(u);v&&f[v.id]++;let S="mcal-cell";y&&(S+=" mcal-today"),(I||E)&&(S+=" mcal-off");let F=`<span class="mcal-num">${c}</span>`;v&&(F+=`<span class="mcal-dot" style="background:${v.color}"></span>`),d.push(`<div class="${S}">${F}</div>`)}const l=p.map(c=>`<div class="mcal-summary-item">
      <span class="mcal-summary-dot" style="background:${c.color}"></span>
      <span class="mcal-summary-name">${c.name}</span>
      <span class="mcal-summary-count">${f[c.id]}</span>
    </div>`).join("");return`
    <div class="mcal-card">
      <div class="mcal-header">
        <button class="nav-btn" onclick="prevMonth()">❮</button>
        <span class="mcal-title">${r[o]} ${t}</span>
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
  `}const re=document.querySelector("#app");let w=null;function g(){const e=new Date,t=ee(m),o=b(e),r=new Date(e);do r.setDate(r.getDate()+1);while(!k(r)&&r.getFullYear()===e.getFullYear());const a=b(r),n=K[t[0].date.getMonth()],i=t[0].date.getFullYear();re.innerHTML=`
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
            <span class="calendar-title">${n} ${i}</span>
            <div style="font-size: 0.7rem; opacity: 0.6;">Semana del ${t[0].dayNum} al ${t[4].dayNum}</div>
          </div>
          <button class="nav-btn" onclick="nextWeek()">❯</button>
        </div>
        
        <div class="week-grid">
          ${t.map(s=>`
            <div class="day-cell ${s.isToday?"active":""} ${s.isHoliday?"holiday":""}" 
                 onclick="${s.isHoliday?"":`openSwapDialog('${s.dateStr}')`}">
              <div style="font-size: 0.7rem; font-weight: 700; margin-bottom: 2px;">
                ${G[s.date.getDay()].substring(0,3)} ${s.dayNum}
              </div>
              
              ${s.isHoliday?'<div style="font-size: 1.5rem;">🇦🇷</div>':s.birthday?'<div class="user-avatar" style="background: #FFF0F5; color: #D81B60; border: 1px solid #FF69B4; font-size: 1.2rem;">🎂</div>':`<div class="user-avatar" style="${s.isToday?"":"color: "+s.person?.color}">
                      ${s.person?.initial||"?"}
                     </div>`}
              ${s.birthday?`<div style="font-size: 0.5rem; color: #D81B60; margin-top: -5px; font-weight: 700;">Cumple ${s.birthday}</div>`:""}
              ${!s.isHoliday&&!s.birthday&&s.person?`<div style="font-size: 0.6rem; opacity: 0.8;">${s.person.name}</div>`:""}
            </div>
          `).join("")}
        </div>
        <button class="btn-today" onclick="goToToday()" style="${ce(m)?"display:none":""}">Volver a Hoy</button>
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
            <p class="name-big">${a?a.name:"Nadie"}</p>
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

      ${ie(m)}

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
  `,le()}function ce(e){const t=new Date,o=new Date(t);o.setHours(0,0,0,0);const r=o.getDay(),a=o.getDate()-r+(r===0?-6:1);o.setDate(a);const n=new Date(e);n.setHours(0,0,0,0);const i=n.getDay(),s=n.getDate()-i+(i===0?-6:1);return n.setDate(s),o.getTime()===n.getTime()}window.openSwapDialog=e=>{w=e,document.querySelector("#swap-modal").style.display="flex"};window.confirmSwap=async e=>{w&&(await U(w,e),w=null,document.querySelector("#swap-modal").style.display="none")};window.prevWeek=te;window.nextWeek=oe;window.goToToday=ae;window.prevMonth=ne;window.nextMonth=se;function le(){let e;window.addEventListener("beforeinstallprompt",a=>{a.preventDefault(),e=a;const n=document.querySelector("#install-banner");n&&(n.style.display="flex")});const t=document.querySelector("#btn-install");t&&t.addEventListener("click",async()=>{if(e){e.prompt();const{outcome:a}=await e.userChoice;a==="accepted"&&(document.querySelector("#install-banner").style.display="none"),e=null}});const o=document.querySelector("#swap-modal"),r=document.querySelector("#close-modal");r&&r.addEventListener("click",()=>{o.style.display="none"})}"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("sw.js").then(e=>{console.log("SW registrado",e),e.update()}).catch(e=>console.log("SW error",e))});if(x)try{document.querySelector("#app").innerHTML='<div style="padding:40px;text-align:center;"><div style="font-size:2rem;margin-bottom:10px;">🌴</div><p>Cargando...</p></div>'}catch(e){console.error("Error inicial:",e)}
