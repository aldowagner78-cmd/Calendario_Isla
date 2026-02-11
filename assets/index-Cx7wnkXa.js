(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const c of n.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function a(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(o){if(o.ep)return;o.ep=!0;const n=a(o);fetch(o.href,n)}})();const F=["01-01","24-03","02-04","01-05","25-05","20-06","09-07","08-12","25-12"],H={"22-10":"Aldo","25-06":"Gaston","28-01":"Machi","25-07":"Fabi","01-12":"Romi"};function x(t){const e=t%19,a=Math.floor(t/100),i=t%100,o=Math.floor(a/4),n=a%4,c=Math.floor((a+8)/25),s=Math.floor((a-c+1)/3),l=(19*e+a-o-s+15)%30,v=Math.floor(i/4),D=i%4,r=(32+2*n+2*v-l-D)%7,u=Math.floor((e+11*l+22*r)/451),p=Math.floor((l+r-7*u+114)/31),w=(l+r-7*u+114)%31+1;return new Date(t,p-1,w)}const S={};function I(t){if(S[t])return S[t];const e=new Set;F.forEach(c=>{const[s,l]=c.split("-");e.add(`${t}-${l}-${s}`)});const a=x(t),i=new Date(a.getTime());i.setDate(a.getDate()-2),e.add(i.toISOString().split("T")[0]);const o=new Date(a.getTime());o.setDate(a.getDate()-48),e.add(o.toISOString().split("T")[0]);const n=new Date(a.getTime());return n.setDate(a.getDate()-47),e.add(n.toISOString().split("T")[0]),["17-08","12-10","20-11"].forEach(c=>{const[s,l]=c.split("-");e.add(`${t}-${l}-${s}`)}),S[t]=e,e}function M(t){const e=t.getFullYear(),a=I(e),i=t.toISOString().split("T")[0];return a.has(i)}function E(t){const e=t.getDate().toString().padStart(2,"0"),a=(t.getMonth()+1).toString().padStart(2,"0"),i=`${e}-${a}`;return H[i]||null}const g=[{id:1,name:"Machi",color:"#26C6DA",initial:"M"},{id:2,name:"Fabi",color:"#7E57C2",initial:"F"},{id:3,name:"Gaston",color:"#FFA000",initial:"G"},{id:4,name:"Romi",color:"#EF5350",initial:"R"},{id:5,name:"Aldo",color:"#66BB6A",initial:"A"}],A=new Date("2026-02-09T00:00:00"),N=["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],L=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];let d=new Date,y=JSON.parse(localStorage.getItem("isla_bonita_overrides"))||{};function W(t,e){y[t]=e,localStorage.setItem("isla_bonita_overrides",JSON.stringify(y)),m()}function T(t){const e=t.getDay();return e===0||e===6?!1:!M(t)}function C(t){const e=new Date(A);e.setHours(0,0,0,0);const a=new Date(t);a.setHours(0,0,0,0);const i=a.getDay(),o=new Date(a);o.setDate(a.getDate()-(i===0?6:i-1));const n=o.getTime()-e.getTime();return Math.round(n/(10080*60*1e3))}function h(t){const e=t.toISOString().split("T")[0];if(y[e])return g.find(n=>n.id===y[e]);if(!T(t))return null;const a=C(t),o=((t.getDay()-1-a)%5+5)%5;return g[o]}function _(t){const e=new Date(t);e.setHours(0,0,0,0);const a=e.getDay(),i=e.getDate()-a+(a===0?-6:1);e.setDate(i);const o=[];for(let n=0;n<5;n++){const c=new Date(e);c.setDate(e.getDate()+n),o.push({date:c,dateStr:c.toISOString().split("T")[0],dayNum:c.getDate(),person:h(c),isHoliday:M(c),birthday:E(c),isToday:c.toDateString()===new Date().toDateString()})}return o}function q(){d.setDate(d.getDate()-7),m()}function B(){d.setDate(d.getDate()+7),m()}function Y(){d=new Date,m()}function z(){d.setMonth(d.getMonth()-1),m()}function J(){d.setMonth(d.getMonth()+1),m()}function P(t){const e=t.getFullYear(),a=t.getMonth(),i=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],o=new Date(e,a,1),n=new Date(e,a+1,0).getDate();let c=o.getDay();c=c===0?6:c-1;const s=new Date;s.setHours(0,0,0,0);const l=[],v={};g.forEach(r=>v[r.id]=0);for(let r=0;r<c;r++)l.push('<div class="mcal-cell empty"></div>');for(let r=1;r<=n;r++){const u=new Date(e,a,r);u.setHours(0,0,0,0);const p=h(u),w=u.getTime()===s.getTime(),k=u.getDay()===0||u.getDay()===6,O=M(u);p&&v[p.id]++;let b="mcal-cell";w&&(b+=" mcal-today"),(k||O)&&(b+=" mcal-off");let $=`<span class="mcal-num">${r}</span>`;p&&($+=`<span class="mcal-dot" style="background:${p.color}"></span>`),l.push(`<div class="${b}">${$}</div>`)}const D=g.map(r=>`<div class="mcal-summary-item">
      <span class="mcal-summary-dot" style="background:${r.color}"></span>
      <span class="mcal-summary-name">${r.name}</span>
      <span class="mcal-summary-count">${v[r.id]}</span>
    </div>`).join("");return`
    <div class="mcal-card">
      <div class="mcal-header">
        <button class="nav-btn" onclick="prevMonth()">❮</button>
        <span class="mcal-title">${i[a]} ${e}</span>
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
  `}const V=document.querySelector("#app");let f=null;function m(){const t=new Date,e=_(d),a=h(t),i=new Date(t);do i.setDate(i.getDate()+1);while(!T(i)&&i.getFullYear()===t.getFullYear());const o=h(i),n=L[e[0].date.getMonth()],c=e[0].date.getFullYear();V.innerHTML=`
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
            <span class="calendar-title">${n} ${c}</span>
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
        <button class="btn-today" onclick="goToToday()" style="${R(d)?"display:none":""}">Volver a Hoy</button>
      </div>

      <div class="info-section">
        <div class="card big-card">
          <div class="icon-box bg-palm">🏠</div>
          <div class="card-content">
            <h3 class="label-small">Hoy le toca:</h3>
            <p class="name-big">${a?a.name:"Nadie (Feriado/Finde)"}</p>
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
          ${g.map(s=>`
            <div class="team-item" onclick="confirmSwap(${s.id})">
              <div class="user-avatar" style="color: ${s.color}">${s.initial}</div>
              <span>${s.name}</span>
            </div>
          `).join("")}
        </div>
        <button id="close-modal" style="margin-top: 20px; width: 100%; padding: 10px; border: none; background: #eee; border-radius: 12px; font-weight: 600;">Cancelar</button>
      </div>
    </div>
  `,j()}function R(t){const e=new Date,a=new Date(e);a.setHours(0,0,0,0);const i=a.getDay(),o=a.getDate()-i+(i===0?-6:1);a.setDate(o);const n=new Date(t);n.setHours(0,0,0,0);const c=n.getDay(),s=n.getDate()-c+(c===0?-6:1);return n.setDate(s),a.getTime()===n.getTime()}window.openSwapDialog=t=>{f=t,document.querySelector("#swap-modal").style.display="flex"};window.confirmSwap=t=>{f&&(W(f,t),f=null,document.querySelector("#swap-modal").style.display="none")};window.prevWeek=q;window.nextWeek=B;window.goToToday=Y;window.prevMonth=z;window.nextMonth=J;function j(){let t;window.addEventListener("beforeinstallprompt",o=>{o.preventDefault(),t=o;const n=document.querySelector("#install-banner");n&&(n.style.display="flex")});const e=document.querySelector("#btn-install");e&&e.addEventListener("click",async()=>{if(t){t.prompt();const{outcome:o}=await t.userChoice;o==="accepted"&&(document.querySelector("#install-banner").style.display="none"),t=null}});const a=document.querySelector("#swap-modal"),i=document.querySelector("#close-modal");i&&i.addEventListener("click",()=>{a.style.display="none"})}"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("sw.js").then(t=>{console.log("SW registrado",t),t.update()}).catch(t=>console.log("SW error",t))});try{m()}catch(t){console.error("Error al renderizar:",t),document.querySelector("#app").innerHTML='<p style="padding:20px;text-align:center;">Error al cargar. Recargá la página.</p>'}
