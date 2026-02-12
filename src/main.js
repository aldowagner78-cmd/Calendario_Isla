import './style.css'
import { isHoliday, getBirthday } from './holidays.js';
import { getOverridesRemote, saveOverrideRemote, subscribeOverrides } from './firebase.js';

// --- CONFIGURACIÓN ---
const TEAM = [
  { id: 1, name: 'Machi', color: '#26C6DA', initial: 'M' },   // Cyan
  { id: 2, name: 'Fabi', color: '#7E57C2', initial: 'F' },    // Deep Purple
  { id: 3, name: 'Gaston', color: '#FFA000', initial: 'G' },  // Amber/Gold
  { id: 4, name: 'Romi', color: '#EF5350', initial: 'R' },    // Red
  { id: 5, name: 'Aldo', color: '#66BB6A', initial: 'A' }     // Green
];

const START_DATE = new Date('2026-02-09T00:00:00');

const DAYS_ES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

// --- ESTADO ---
let currentViewDate = new Date();
let currentMonthViewDate = new Date();
let darkMode = localStorage.getItem('isla_bonita_dark_mode') === 'true';
let isAdmin = localStorage.getItem('isla_bonita_admin') === 'true';

if (darkMode) document.body.classList.add('dark-mode');

// --- OVERRIDES ---
let overrides = {};
let simulationCache = {};

(async () => {
  try {
    overrides = await getOverridesRemote();
    runSimulation();
    render();
  } catch (e) {
    overrides = JSON.parse(localStorage.getItem('isla_bonita_overrides')) || {};
    runSimulation();
    render();
  }
})();

subscribeOverrides(async () => {
  try {
    const newOverrides = await getOverridesRemote();
    if (JSON.stringify(newOverrides) !== JSON.stringify(overrides)) {
      overrides = newOverrides;
      runSimulation();
      showLocalNotification('🔄 Calendario actualizado remotamente');
      render();
    }
  } catch (e) { }
});

async function saveOverride(dateString, personId) {
  try {
    // En este algoritmo definitivo, el override es SAGRADO (Regla 6).
    const newPerson = TEAM.find(p => p.id === personId);

    await saveOverrideRemote(dateString, personId);
    overrides[dateString] = personId;

    runSimulation(); // RECALCULAR TODO EL FUTURO BASADO EN ESTE CAMBIO
    render();

    if (newPerson) {
      showLocalNotification(`Cambio guardado: ${newPerson.name}`);
    }
  } catch (e) {
    showLocalNotification('❌ Error al guardar');
    console.error(e);
  }
}

// --- UTILIDADES ---
function showLocalNotification(msg) {
  const toast = document.createElement('div');
  toast.innerText = msg;
  Object.assign(toast.style, {
    position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
    background: 'var(--palm)', color: 'var(--sand)', padding: '12px 24px',
    borderRadius: '50px', boxShadow: '0 4px 12px var(--shadow)', zIndex: '10000',
    fontSize: '0.9rem', fontWeight: '600', textAlign: 'center', minWidth: '300px'
  });
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle('dark-mode', darkMode);
  localStorage.setItem('isla_bonita_dark_mode', darkMode);
  render();
}

function isWorkingDay(date) {
  const day = date.getDay();
  if (day === 0 || day === 6) return false;
  return !isHoliday(date);
}

// ==========================================
// === ALGORITMO DEFINITIVO (6 REGLAS - v20) ===
// ==========================================

function runSimulation() {
  simulationCache = {};

  let state = {
    monthlyCounts: {},       // Regla 4/6 (Equidad)
    weeklyCounts: {},        // Regla 2 (Límite Semanal)
    pendingFridayUser: null, // Regla 3 (Continuidad Vie→Lun)
    weekNumber: 0,           // Contador de semanas para rotar el orden
    currentMonth: -1,
    currentYear: -1,
    currentWeekStr: ''
  };

  TEAM.forEach(p => state.monthlyCounts[p.id] = 0);

  // Simular 10 años → cobertura prácticamente indefinida
  const endDate = new Date(START_DATE);
  endDate.setFullYear(endDate.getFullYear() + 10);

  let d = new Date(START_DATE);
  d.setHours(0, 0, 0, 0);

  while (d <= endDate) {
    const dateStr = d.toISOString().split('T')[0];
    const month = d.getMonth();
    const year = d.getFullYear();

    // Identificador de Semana (Lunes)
    const weekStart = new Date(d);
    const dayOfWeek = weekStart.getDay();
    const diffToMon = weekStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    weekStart.setDate(diffToMon);
    const weekStr = weekStart.toISOString().split('T')[0];

    // Cambio de Mes → Reiniciar contadores mensuales
    if (month !== state.currentMonth || year !== state.currentYear) {
      TEAM.forEach(p => state.monthlyCounts[p.id] = 0);
      state.currentMonth = month;
      state.currentYear = year;
    }

    // Cambio de Semana → Reiniciar contadores semanales + avanzar rotación
    if (weekStr !== state.currentWeekStr) {
      state.weeklyCounts = {};
      TEAM.forEach(p => state.weeklyCounts[p.id] = 0);
      state.currentWeekStr = weekStr;
      state.weekNumber++;
    }

    // Solo días hábiles (Regla 5: feriados son días muertos)
    if (isWorkingDay(d)) {
      let assignedPerson = null;

      // ═══════════════════════════════════
      // REGLA 1: OVERRIDES SON SAGRADOS 👑
      // ═══════════════════════════════════
      if (overrides[dateStr]) {
        assignedPerson = TEAM.find(p => p.id === overrides[dateStr]);
      } else {
        // ═══════════════════════════════════════════════
        // REGLA 2: Pool de elegibles (máx 1/semana) 🔒
        // NADIE con ≥1 día esta semana puede ser asignado
        // ═══════════════════════════════════════════════
        const eligible = TEAM.filter(p => state.weeklyCounts[p.id] < 1);

        if (eligible.length > 0) {
          // Offset de rotación: combina semana + día para máxima variedad
          const weekOffset = (state.weekNumber * 3 + d.getDay()) % TEAM.length;

          // ═══════════════════════════════════════════════════════
          // ¿SEMANA COMPLETA? Si los días hábiles restantes en esta
          // semana (dentro del mismo mes) >= elegibles, TODOS van a
          // recibir 1 día → equidad automática → rotación pura.
          // ═══════════════════════════════════════════════════════
          let remainingWorkDays = 0;
          for (let wd = d.getDay(); wd <= 5; wd++) {
            const checkDate = new Date(d);
            checkDate.setDate(d.getDate() + (wd - d.getDay()));
            if (checkDate.getMonth() === month && isWorkingDay(checkDate)) {
              remainingWorkDays++;
            }
          }
          const isFullWeek = remainingWorkDays >= eligible.length;

          // ═══════════════════════════════════════════════
          // REGLA 3: CONTINUIDAD (Vie→Lun) 🔗
          // Semana completa: siempre aplica (equidad automática)
          // Semana parcial: solo si persona está en el mínimo
          // ═══════════════════════════════════════════════
          if (state.pendingFridayUser && eligible.some(p => p.id === state.pendingFridayUser.id)) {
            if (isFullWeek) {
              assignedPerson = state.pendingFridayUser;
            } else {
              const minCount = Math.min(...eligible.map(p => state.monthlyCounts[p.id]));
              if (state.monthlyCounts[state.pendingFridayUser.id] <= minCount) {
                assignedPerson = state.pendingFridayUser;
              }
            }
          }

          if (!assignedPerson) {
            // ═══════════════════════════════════════════════════════
            // ASIGNACIÓN ⚖️🔄
            // Semana completa: ROTACIÓN PURA (equidad garantizada)
            // Semana parcial: EQUIDAD ESTRICTA + rotación desempate
            // ═══════════════════════════════════════════════════════
            const sorted = [...eligible].sort((a, b) => {
              if (!isFullWeek) {
                const diff = state.monthlyCounts[a.id] - state.monthlyCounts[b.id];
                if (diff !== 0) return diff;
              }
              const aIdx = TEAM.findIndex(t => t.id === a.id);
              const bIdx = TEAM.findIndex(t => t.id === b.id);
              const aRot = (aIdx - weekOffset + TEAM.length) % TEAM.length;
              const bRot = (bIdx - weekOffset + TEAM.length) % TEAM.length;
              return aRot - bRot;
            });

            assignedPerson = sorted[0];
          }
        }
        // Si eligible vacío → no hay asignación (Regla 2 absoluta)
      }

      // ═══════════════════════════════
      // ACTUALIZAR ESTADO
      // ═══════════════════════════════
      if (assignedPerson) {
        simulationCache[dateStr] = assignedPerson.id;
        state.monthlyCounts[assignedPerson.id]++;
        state.weeklyCounts[assignedPerson.id]++;

        // Regla 3: Registrar viernes para continuidad
        if (d.getDay() === 5) {
          state.pendingFridayUser = assignedPerson;
        } else {
          state.pendingFridayUser = null;
        }
      }
    }

    // Avanzar día
    d.setDate(d.getDate() + 1);
  }
}

function getHomeOfficePerson(date) {
  const dateStr = date.toISOString().split('T')[0];
  if (date < START_DATE) return null;
  if (!isWorkingDay(date)) return null;

  if (Object.keys(simulationCache).length === 0) runSimulation();

  const personId = simulationCache[dateStr];
  return personId ? TEAM.find(p => p.id === personId) : null;
}


// --- RENDER ---
function getMonthlyStats(days) {
  const stats = {};
  TEAM.forEach(t => stats[t.id] = 0);
  days.forEach(day => {
    if (day && day.person && !day.isHoliday && day.date.getDay() !== 0 && day.date.getDay() !== 6) {
      if (day.person && day.person.id) stats[day.person.id]++;
    }
  });
  return TEAM.map(t => ({ ...t, count: stats[t.id] })).sort((a, b) => b.count - a.count);
}

function getMonthDays(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const days = [];
  for (let i = 0; i < startDayOfWeek; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    days.push({
      date: d,
      dateStr: d.toISOString().split('T')[0],
      dayNum: i,
      person: getHomeOfficePerson(d),
      isHoliday: isHoliday(d),
      isToday: d.toDateString() === new Date().toDateString()
    });
  }
  return days;
}

function getWeekDays(date) {
  const startOfNow = new Date(date);
  startOfNow.setHours(0, 0, 0, 0);
  const day = startOfNow.getDay();
  const diff = startOfNow.getDate() - day + (day === 0 ? -6 : 1); // Lunes
  startOfNow.setDate(diff);

  const days = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(startOfNow);
    d.setDate(startOfNow.getDate() + i);
    days.push({
      date: d,
      dateStr: d.toISOString().split('T')[0],
      dayNum: d.getDate(),
      person: getHomeOfficePerson(d),
      isHoliday: isHoliday(d),
      birthday: getBirthday(d),
      isToday: d.toDateString() === new Date().toDateString()
    });
  }
  return days;
}

function render() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Stats Mensuales
  const monthDays = getMonthDays(currentMonthViewDate);
  const monthStats = getMonthlyStats(monthDays);
  const monthName = MONTHS_ES[currentMonthViewDate.getMonth()];
  const monthYear = currentMonthViewDate.getFullYear();

  // Cards
  const todayPerson = getHomeOfficePerson(now);
  let nextDay = new Date(now);
  do { nextDay.setDate(nextDay.getDate() + 1); }
  while (!isWorkingDay(nextDay) && nextDay.getFullYear() === now.getFullYear());
  const nextPerson = getHomeOfficePerson(nextDay);

  // Semana
  const weekDays = getWeekDays(currentViewDate);
  const weekMonth = MONTHS_ES[weekDays[0].date.getMonth()];


  const app = document.querySelector('#app');
  app.innerHTML = `
    <header>
      <div style="display: flex; align-items: center; gap: 15px;">
        <div class="logo-container"><img src="logo.svg" alt="Isla Bonita"></div>
        <div>
          <h1>Isla Bonita</h1>
          <p style="font-size: 0.7rem; opacity: 0.6; margin-top: -2px;">Seguimiento de Home Office</p>
        </div>
      </div>
      <button class="theme-toggle" onclick="toggleDarkMode()">${darkMode ? '☀️' : '🌙'}</button>
    </header>

    <main>
      <!-- WEEKLY -->
      <div class="calendar-card">
        <div class="calendar-header">
          <button class="nav-btn" onclick="prevWeek()">❮</button>
          <div style="text-align: center;">
            <span class="calendar-title">${weekMonth} ${weekDays[0].date.getFullYear()}</span>
            <div style="font-size: 0.7rem; opacity: 0.6;">Semana ${weekDays[0].dayNum} - ${weekDays[4].dayNum}</div>
          </div>
          <button class="nav-btn" onclick="nextWeek()">❯</button>
        </div>
        
        <div class="week-grid">
           ${weekDays.map(day => `
            <div class="day-cell ${day.isToday ? 'active' : ''} ${day.isHoliday ? 'holiday' : ''}" 
                 onclick="${!day.isHoliday ? `openSwapDialog('${day.dateStr}')` : ''}"
                 style="${day.person && !day.isHoliday ? `border-bottom: 3px solid ${day.person.color}` : ''}">
              <div style="font-size: 0.7rem; opacity: 0.7; font-weight:700;">${DAYS_ES[day.date.getDay()].substring(0, 3)} ${day.dayNum}</div>
               ${day.isHoliday ? '<div style="font-size:1.5rem">🇦🇷</div>' :
      day.birthday ? '<div class="user-avatar" style="background:#FFF0F5;color:#D81B60;border:1px solid #FF69B4;">🎂</div>' :
        `<div style="font-weight:800;font-size:0.9rem;color:${day.person?.color || 'inherit'}">${day.person?.name || '?'}</div>`
    }
               ${overrides[day.dateStr] ? '<div style="font-size:0.5rem">✏️</div>' : ''}
            </div>
           `).join('')}
        </div>
        <button class="btn-today" onclick="goToToday()">Volver a Hoy</button>
      </div>

      <!-- CARDS -->
      <div class="info-section">
        <div class="card big-card">
          <div class="icon-box bg-palm">🏠</div>
          <div class="card-content">
            <h3 class="label-small">Hoy:</h3>
            <p class="name-big">${todayPerson ? todayPerson.name : 'Nadie'}</p>
          </div>
        </div>
        <div class="card big-card">
          <div class="icon-box bg-sea">🌅</div>
          <div class="card-content">
            <h3 class="label-small">Siguiente:</h3>
            <p class="name-big">${nextPerson ? nextPerson.name : 'Nadie'}</p>
          </div>
        </div>
      </div>

      <!-- MONTHLY -->
      <div class="mcal-card">
        <div class="mcal-header">
           <button class="nav-btn" onclick="prevMonth()">❮</button>
           <span class="mcal-title">${monthName} ${monthYear}</span>
           <button class="nav-btn" onclick="nextMonth()">❯</button>
        </div>
        <div class="mcal-grid">
           <div class="mcal-head">D</div><div class="mcal-head">L</div><div class="mcal-head">M</div><div class="mcal-head">X</div><div class="mcal-head">J</div><div class="mcal-head">V</div><div class="mcal-head">S</div>
           ${monthDays.map(day => {
      if (!day) return '<div class="mcal-cell empty"></div>';
      const isWk = day.date.getDay() === 0 || day.date.getDay() === 6;
      return `
               <div class="mcal-cell ${day.isToday ? 'mcal-today' : ''} ${isWk ? 'mcal-off' : ''}"
                    onclick="${(!isWk && !day.isHoliday && day.person) ? `openSwapDialog('${day.dateStr}')` : ''}">
                 <span class="mcal-num">${day.dayNum}</span>
                 ${day.isHoliday ? '<span>🇦🇷</span>' : (day.person && !isWk ? `<div class="mcal-initial" style="background:${day.person.color}">${day.person.initial}</div>` : '')}
               </div>
             `;
    }).join('')}
        </div>
        
        <div class="mcal-summary">
           <div class="mcal-summary-title">Días Home Office (Estimado)</div>
           ${monthStats.map(s => `
             <div class="mcal-summary-item">
               <div class="mcal-summary-dot" style="background:${s.color}"></div>
               <div class="mcal-summary-name">${s.name}</div>
               <div class="mcal-summary-count" style="color:${s.color};background:${s.color}20">${s.count}</div>
             </div>
           `).join('')}
        </div>
      </div>
    </main>

    <div id="swap-modal" class="swap-modal">
      <div class="modal-content">
        <h2>Asignar a:</h2>
        <div class="team-list">
          ${TEAM.map(m => `
            <div class="team-item" onclick="confirmSwap(${m.id})">
              <div class="user-avatar" style="color:${m.color}">${m.initial}</div>
              <span>${m.name}</span>
            </div>
          `).join('')}
        </div>
        <button id="close-modal" style="margin-top:20px;width:100%;padding:10px;">Cancelar</button>
      </div>
    </div>
  `;
}

// --- GLOBAL EXPORTS (WINDOW) ---

function verifyAdmin() {
  if (isAdmin) return Promise.resolve(true);
  return new Promise(resolve => {
    if (confirm("🔒 ¿Sos Aldo?")) {
      const pin = prompt("PIN:");
      if (pin === '6352') {
        isAdmin = true;
        localStorage.setItem('isla_bonita_admin', 'true');
        showLocalNotification('Admin Activado');
        resolve(true);
      } else {
        alert("PIN Incorrecto");
        resolve(false);
      }
    } else {
      showLocalNotification("Solo Aldo puede editar");
      resolve(false);
    }
  });
}

function prevWeek() { currentViewDate.setDate(currentViewDate.getDate() - 7); render(); }
function nextWeek() { currentViewDate.setDate(currentViewDate.getDate() + 7); render(); }
function prevMonth() { currentMonthViewDate.setMonth(currentMonthViewDate.getMonth() - 1); render(); }
function nextMonth() { currentMonthViewDate.setMonth(currentMonthViewDate.getMonth() + 1); render(); }
function goToToday() { currentViewDate = new Date(); currentMonthViewDate = new Date(); render(); }

window.toggleDarkMode = toggleDarkMode;
window.prevWeek = prevWeek;
window.nextWeek = nextWeek;
window.prevMonth = prevMonth;
window.nextMonth = nextMonth;
window.goToToday = goToToday;

window.openSwapDialog = async (ds) => {
  if (await verifyAdmin()) {
    window.selectedDay = ds;
    document.getElementById('swap-modal').style.display = 'flex';
  }
};

window.confirmSwap = (pid) => {
  if (window.selectedDay) {
    saveOverride(window.selectedDay, pid);
    document.getElementById('swap-modal').style.display = 'none';
  }
};

window.onload = () => {
  const close = document.getElementById('close-modal');
  if (close) {
    document.addEventListener('click', (e) => {
      if (e.target && e.target.id == 'close-modal') {
        document.getElementById('swap-modal').style.display = 'none';
      }
    });
  }

  // Installer
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredPrompt = e;
    const banner = document.querySelector('#install-banner');
    if (banner) banner.style.display = 'flex';
  });

  // Install Click
  document.addEventListener('click', (e) => {
    if (e.target && e.target.id == 'btn-install') {
      if (window.deferredPrompt) {
        window.deferredPrompt.prompt();
        window.deferredPrompt.userChoice.then((choiceResult) => {
          window.deferredPrompt = null;
          document.querySelector('#install-banner').style.display = 'none';
        });
      }
    }
  });
};

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
render();
