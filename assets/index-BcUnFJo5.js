(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function o(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(n){if(n.ep)return;n.ep=!0;const a=o(n);fetch(n.href,a)}})();const O=["01-01","24-03","02-04","01-05","25-05","20-06","09-07","08-12","25-12"],H={"22-10":"Aldo","25-06":"Gaston","28-01":"Machi","25-07":"Fabi","01-12":"Romi"};function I(t){const e=t%19,o=Math.floor(t/100),s=t%100,n=Math.floor(o/4),a=o%4,c=Math.floor((o+8)/25),i=Math.floor((o-c+1)/3),l=(19*e+o-n-i+15)%30,v=Math.floor(s/4),D=s%4,r=(32+2*a+2*v-l-D)%7,u=Math.floor((e+11*l+22*r)/451),p=Math.floor((l+r-7*u+114)/31),w=(l+r-7*u+114)%31+1;return new Date(t,p-1,w)}const S={};function x(t){if(S[t])return S[t];const e=new Set;O.forEach(c=>{const[i,l]=c.split("-");e.add(`${t}-${l}-${i}`)});const o=I(t),s=new Date(o.getTime());s.setDate(o.getDate()-2),e.add(s.toISOString().split("T")[0]);const n=new Date(o.getTime());n.setDate(o.getDate()-48),e.add(n.toISOString().split("T")[0]);const a=new Date(o.getTime());return a.setDate(o.getDate()-47),e.add(a.toISOString().split("T")[0]),["17-08","12-10","20-11"].forEach(c=>{const[i,l]=c.split("-");e.add(`${t}-${l}-${i}`)}),S[t]=e,e}function M(t){const e=t.getFullYear(),o=x(e),s=t.toISOString().split("T")[0];return o.has(s)}function E(t){const e=t.getDate().toString().padStart(2,"0"),o=(t.getMonth()+1).toString().padStart(2,"0"),s=`${e}-${o}`;return H[s]||null}const f=[{id:1,name:"Machi",color:"#26C6DA",initial:"M"},{id:2,name:"Fabi",color:"#7E57C2",initial:"F"},{id:3,name:"Gaston",color:"#FFA000",initial:"G"},{id:4,name:"Romi",color:"#EF5350",initial:"R"},{id:5,name:"Aldo",color:"#66BB6A",initial:"A"}],A=new Date("2026-02-09T00:00:00"),L=["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],W=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];let d=new Date,y=JSON.parse(localStorage.getItem("isla_bonita_overrides"))||{};function N(t,e){y[t]=e,localStorage.setItem("isla_bonita_overrides",JSON.stringify(y)),m()}function $(t){const e=t.getDay();return e===0||e===6?!1:!M(t)}function C(t){let e=0,o=new Date(A);o.setHours(0,0,0,0);const s=new Date(t);if(s.setHours(0,0,0,0),s<o)return-1;for(;o<s;)$(o)&&e++,o.setDate(o.getDate()+1);return e}function h(t){const e=t.toISOString().split("T")[0];if(y[e])return f.find(c=>c.id===y[e]);if(!$(t))return null;const o=C(t),s=Math.floor(o/5),a=(o%5+s)%5;return f[a]}function _(t){const e=new Date(t);e.setHours(0,0,0,0);const o=e.getDay(),s=e.getDate()-o+(o===0?-6:1);e.setDate(s);const n=[];for(let a=0;a<5;a++){const c=new Date(e);c.setDate(e.getDate()+a),n.push({date:c,dateStr:c.toISOString().split("T")[0],dayNum:c.getDate(),person:h(c),isHoliday:M(c),birthday:E(c),isToday:c.toDateString()===new Date().toDateString()})}return n}function q(){d.setDate(d.getDate()-7),m()}function B(){d.setDate(d.getDate()+7),m()}function Y(){d=new Date,m()}function z(){d.setMonth(d.getMonth()-1),m()}function J(){d.setMonth(d.getMonth()+1),m()}function P(t){const e=t.getFullYear(),o=t.getMonth(),s=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],n=new Date(e,o,1),a=new Date(e,o+1,0).getDate();let c=n.getDay();c=c===0?6:c-1;const i=new Date;i.setHours(0,0,0,0);const l=[],v={};f.forEach(r=>v[r.id]=0);for(let r=0;r<c;r++)l.push('<div class="mcal-cell empty"></div>');for(let r=1;r<=a;r++){const u=new Date(e,o,r);u.setHours(0,0,0,0);const p=h(u),w=u.getTime()===i.getTime(),k=u.getDay()===0||u.getDay()===6,F=M(u);p&&v[p.id]++;let b="mcal-cell";w&&(b+=" mcal-today"),(k||F)&&(b+=" mcal-off");let T=`<span class="mcal-num">${r}</span>`;p&&(T+=`<span class="mcal-dot" style="background:${p.color}"></span>`),l.push(`<div class="${b}">${T}</div>`)}const D=f.map(r=>`<div class="mcal-summary-item">
      <span class="mcal-summary-dot" style="background:${r.color}"></span>
      <span class="mcal-summary-name">${r.name}</span>
      <span class="mcal-summary-count">${v[r.id]}</span>
    </div>`).join("");return`
    <div class="mcal-card">
      <div class="mcal-header">
        <button class="nav-btn" onclick="prevMonth()">❮</button>
        <span class="mcal-title">${s[o]} ${e}</span>
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
        ${l.join("")}
      </div>
      <div class="mcal-summary">
        <h4 class="mcal-summary-title">Home Office del mes</h4>
        ${D}
      </div>
    </div>
  `}const V=document.querySelector("#app");let g=null;function m(){const t=new Date,e=_(d),o=h(t),s=new Date(t);do s.setDate(s.getDate()+1);while(!$(s)&&s.getFullYear()===t.getFullYear());const n=h(s),a=W[e[0].date.getMonth()],c=e[0].date.getFullYear();V.innerHTML=`
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
            <span class="calendar-title">${a} ${c}</span>
            <div style="font-size: 0.7rem; opacity: 0.6;">Semana del ${e[0].dayNum} al ${e[4].dayNum}</div>
          </div>
          <button class="nav-btn" onclick="nextWeek()">❯</button>
        </div>
        
        <div class="week-grid">
          ${e.map(i=>`
            <div class="day-cell ${i.isToday?"active":""} ${i.isHoliday?"holiday":""}" 
                 onclick="${i.isHoliday?"":`openSwapDialog('${i.dateStr}')`}">
              <div style="font-size: 0.7rem; font-weight: 700; margin-bottom: 2px;">
                ${L[i.date.getDay()].substring(0,3)} ${i.dayNum}
              </div>
              
              ${i.isHoliday?'<div style="font-size: 1.5rem;">🇦🇷</div>':i.birthday?'<div class="user-avatar" style="background: #FFF0F5; color: #D81B60; border: 1px solid #FF69B4; font-size: 1.2rem;">🎂</div>':`<div class="user-avatar" style="${i.isToday?"":"color: "+i.person?.color}">
                      ${i.person?.initial||"?"}
                     </div>`}
              ${i.birthday?`<div style="font-size: 0.5rem; color: #D81B60; margin-top: -5px; font-weight: 700;">Cumple ${i.birthday}</div>`:""}
              ${!i.isHoliday&&!i.birthday&&i.person?`<div style="font-size: 0.6rem; opacity: 0.8;">${i.person.name}</div>`:""}
            </div>
          `).join("")}
        </div>
        <button class="btn-today" onclick="goToToday()" style="${R(d)?"display:none":""}">Volver a Hoy</button>
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

      ${P(d)}

      <div id="install-banner" class="install-banner">
        <p>¿Instalar Isla Bonita?</p>
        <button id="btn-install" class="btn-install">Instalar</button>
      </div>
    </main>

    <div id="swap-modal" class="swap-modal">
      <div class="modal-content">
        <h2 class="modal-title">Asignar día a:</h2>
        <div class="team-list">
          ${f.map(i=>`
            <div class="team-item" onclick="confirmSwap(${i.id})">
              <div class="user-avatar" style="color: ${i.color}">${i.initial}</div>
              <span>${i.name}</span>
            </div>
          `).join("")}
        </div>
        <button id="close-modal" style="margin-top: 20px; width: 100%; padding: 10px; border: none; background: #eee; border-radius: 12px; font-weight: 600;">Cancelar</button>
      </div>
    </div>
  `,j()}function R(t){const e=new Date,o=new Date(e);o.setHours(0,0,0,0);const s=o.getDay(),n=o.getDate()-s+(s===0?-6:1);o.setDate(n);const a=new Date(t);a.setHours(0,0,0,0);const c=a.getDay(),i=a.getDate()-c+(c===0?-6:1);return a.setDate(i),o.getTime()===a.getTime()}window.openSwapDialog=t=>{g=t,document.querySelector("#swap-modal").style.display="flex"};window.confirmSwap=t=>{g&&(N(g,t),g=null,document.querySelector("#swap-modal").style.display="none")};window.prevWeek=q;window.nextWeek=B;window.goToToday=Y;window.prevMonth=z;window.nextMonth=J;function j(){let t;window.addEventListener("beforeinstallprompt",n=>{n.preventDefault(),t=n;const a=document.querySelector("#install-banner");a&&(a.style.display="flex")});const e=document.querySelector("#btn-install");e&&e.addEventListener("click",async()=>{if(t){t.prompt();const{outcome:n}=await t.userChoice;n==="accepted"&&(document.querySelector("#install-banner").style.display="none"),t=null}});const o=document.querySelector("#swap-modal"),s=document.querySelector("#close-modal");s&&s.addEventListener("click",()=>{o.style.display="none"})}"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("sw.js").then(t=>{console.log("SW registrado",t),t.update()}).catch(t=>console.log("SW error",t))});try{m()}catch(t){console.error("Error al renderizar:",t),document.querySelector("#app").innerHTML='<p style="padding:20px;text-align:center;">Error al cargar. Recargá la página.</p>'}
