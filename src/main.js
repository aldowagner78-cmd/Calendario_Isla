import './style.css'
import { isHoliday, getBirthday } from './holidays.js';
import { getOverridesRemote, saveOverrideRemote, subscribeOverrides } from './firebase.js';

// --- CONFIGURACIÓN DEL EQUIPO ---
const TEAM = [
  { id: 1, name: 'Machi', color: '#26C6DA', initial: 'M' },   // Cyan
  { id: 2, name: 'Fabi', color: '#7E57C2', initial: 'F' },    // Deep Purple
  { id: 3, name: 'Gaston', color: '#FFA000', initial: 'G' },  // Amber/Gold
  { id: 4, name: 'Romi', color: '#EF5350', initial: 'R' },    // Red
  { id: 5, name: 'Aldo', color: '#66BB6A', initial: 'A' }     // Green
];

// Fecha de inicio de la rotación (Lunes 9 de Feb 2026)
const START_DATE = new Date('2026-02-09T00:00:00');

const DAYS_ES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

// --- ESTADO DE LA APLICACIÓN ---
let currentViewDate = new Date();
let currentMonthViewDate = new Date(); // Estado independiente para el calendario mensual
let darkMode = localStorage.getItem('isla_bonita_dark_mode') === 'true';
let isAdmin = localStorage.getItem('isla_bonita_admin') === 'true';

// Aplicar modo oscuro al inicio
if (darkMode) {
  document.body.classList.add('dark-mode');
}

function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle('dark-mode', darkMode);
  localStorage.setItem('isla_bonita_dark_mode', darkMode);
  render();
}

// --- LÓGICA DE NEGOCIO (CORE) ---

// Overrides ahora vienen de Firebase
let overrides = {};
let isLoadingOverrides = true;

// Cargar overrides iniciales y suscribirse
(async () => {
  try {
    overrides = await getOverridesRemote();
    isLoadingOverrides = false;
    render();
  } catch (e) {
    console.error('Error cargando overrides de Firebase:', e);
    // Fallback a LocalStorage si falla Firebase
    overrides = JSON.parse(localStorage.getItem('isla_bonita_overrides')) || {};
    isLoadingOverrides = false;
    render();
  }
})();

subscribeOverrides(async () => {
  try {
    const newOverrides = await getOverridesRemote();
    if (JSON.stringify(newOverrides) !== JSON.stringify(overrides)) {
      overrides = newOverrides;
      showLocalNotification('🔄 Calendario actualizado remotamente');
      render();
    }
  } catch (e) { console.error(e); }
});


async function saveOverride(dateString, personId) {
  // Guardar en Firebase
  try {
    await saveOverrideRemote(dateString, personId);

    // Optimista: Actualizar local mientras llega la confirmación
    overrides[dateString] = personId;
    render();

    const person = TEAM.find(p => p.id === personId);
    if (person) {
      showLocalNotification(`Cambio guardado: ${person.name}`);
    }
  } catch (e) {
    showLocalNotification('❌ Error al guardar en la nube');
    console.error(e);
  }
}

function showLocalNotification(msg) {
  // Toast
  const toast = document.createElement('div');
  toast.innerText = msg;
  toast.style.position = 'fixed';
  toast.style.bottom = '80px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.background = 'var(--palm)';
  toast.style.color = 'var(--sand)';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '50px';
  toast.style.boxShadow = '0 4px 12px var(--shadow)';
  toast.style.zIndex = '10000';
  toast.style.fontSize = '0.9rem';
  toast.style.fontWeight = '600';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// Verifica si es día laboral (Lun-Vie y NO es feriado)
function isWorkingDay(date) {
  const day = date.getDay();
  if (day === 0 || day === 6) return false; // Finde
  return !isHoliday(date);
}

// Calcula cuántos días hábiles pasaron desde el inicio hasta la fecha dada
function getWorkingDayIndex(targetDate) {
  let count = 0;
  let currentDate = new Date(START_DATE);

  // Normalizar fechas a medianoche
  currentDate.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  if (target < currentDate) return -1;

  while (currentDate < target) {
    if (isWorkingDay(currentDate)) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return count;
}

function getHomeOfficePerson(date) {
  const dateStr = date.toISOString().split('T')[0];

  // 0. Revisar si es anterior al inicio
  if (date < START_DATE) return null;

  // 1. Revisar override
  if (overrides && overrides[dateStr]) {
    return TEAM.find(p => p.id === overrides[dateStr]);
  }

  // 2. Revisar si es fin de semana o feriado
  if (!isWorkingDay(date)) return null;

  // 3. Calcular rotación con desplazamiento semanal
  // Lógica: Cada semana la rotación se desplaza -1 (El que estaba el Viernes pasa al Lunes)
  const workingDayIndex = getWorkingDayIndex(date);

  // Calcular semanas pasadas desde el inicio para el shift
  const diffTime = date.getTime() - START_DATE.getTime();
  const weeksDiff = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000));

  // Fórmula: (IndiceDiaLaboral - SemanasTranscurridas) % 5
  // Usamos lógica de módulo positivo para evitar negativos
  const personIndex = ((workingDayIndex - weeksDiff) % 5 + 5) % 5;

  return TEAM[personIndex];
}

function getWeekDays(date) {
  const startOfWeek = new Date(date);
  startOfWeek.setHours(0, 0, 0, 0);
  const day = startOfWeek.getDay(); // 0 (Dom) - 6 (Sab)

  // Ajustar al Lunes de la semana actual
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);

  const days = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    days.push({
      date: d,
      dateStr: d.toISOString().split('T')[0],
      dayNum: d.getDate(),
      person: getHomeOfficePerson(d),
      isHoliday: isHoliday(d),
      birthday: getBirthday(d), // Chequear si es cumple
      isToday: d.toDateString() === new Date().toDateString()
    });
  }
  return days;
}

// --- NHELPER CALENDARIO MENSUAL ---
function getMonthDays(date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0 (Dom) - 6 (Sab)

  const days = [];

  // Días vacíos previos (padding)
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }

  // Días del mes
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

// Helper para contar días por persona en el mes
function getMonthlyStats(days) {
  const stats = {};
  TEAM.forEach(t => stats[t.id] = 0);

  days.forEach(day => {
    if (day && day.person && !day.isHoliday && day.date.getDay() !== 0 && day.date.getDay() !== 6) {
      stats[day.person.id]++;
    }
  });

  return TEAM.map(t => ({
    ...t,
    count: stats[t.id]
  })).sort((a, b) => b.count - a.count); // Ordenar por quien tiene más
}


// --- NAVEGACIÓN ---

function prevWeek() {
  currentViewDate.setDate(currentViewDate.getDate() - 7);
  render();
}

function nextWeek() {
  currentViewDate.setDate(currentViewDate.getDate() + 7);
  render();
}

function goToToday() {
  currentViewDate = new Date();
  currentMonthViewDate = new Date(); // También resetear mes
  render();
}

function prevMonth() {
  currentMonthViewDate.setMonth(currentMonthViewDate.getMonth() - 1);
  render();
}

function nextMonth() {
  currentMonthViewDate.setMonth(currentMonthViewDate.getMonth() + 1);
  render();
}


// --- SEGURIDAD (ADMIN MODE SIMPLE) ---
async function verifyAdmin() {
  if (isAdmin) return true;

  const intent = confirm("🔒 Esta acción es solo para Aldo.\n\n¿Sos Aldo? (Aceptar para ingresar PIN, Cancelar para volver)");

  if (!intent) {
    showLocalNotification("⛔ Pide el cambio a Aldo");
    return false;
  }

  const pin = prompt("Ingresa el PIN de seguridad:");

  if (pin === '6352') {
    isAdmin = true;
    localStorage.setItem('isla_bonita_admin', 'true');
    showLocalNotification('🔓 Modo Admin Activado (Guardado)');
    return true;
  } else {
    alert("PIN Incorrecto");
    return false;
  }
}


function isCurrentWeek(date) {
  const now = new Date();
  const startOfNow = new Date(now);
  startOfNow.setHours(0, 0, 0, 0);
  const day = startOfNow.getDay();
  const diff = startOfNow.getDate() - day + (day === 0 ? -6 : 1);
  startOfNow.setDate(diff);

  const startOfView = new Date(date);
  startOfView.setHours(0, 0, 0, 0);
  const dayView = startOfView.getDay();
  const diffView = startOfView.getDate() - dayView + (dayView === 0 ? -6 : 1);
  startOfView.setDate(diffView);

  return startOfNow.getTime() === startOfView.getTime();
}

// --- RENDERIZADO ---

const app = document.querySelector('#app');
let selectedDayToSwap = null;


function render() {
  const now = new Date(new Date().setHours(0, 0, 0, 0));

  // SEMANA
  const weekDays = getWeekDays(currentViewDate);
  const weekMonth = MONTHS_ES[weekDays[0].date.getMonth()];
  const weekYear = weekDays[0].date.getFullYear();

  // MES
  const monthDays = getMonthDays(currentMonthViewDate);
  const monthName = MONTHS_ES[currentMonthViewDate.getMonth()];
  const monthYear = currentMonthViewDate.getFullYear();

  // CARDS
  const todayPerson = getHomeOfficePerson(now);
  const tomorrow = new Date(now);
  do {
    tomorrow.setDate(tomorrow.getDate() + 1);
  } while (!isWorkingDay(tomorrow) && tomorrow.getFullYear() === now.getFullYear());
  const tomorrowPerson = getHomeOfficePerson(tomorrow);


  app.innerHTML = `
    <header>
      <div style="display: flex; align-items: center; gap: 15px;">
        <div class="logo-container">
          <img src="logo.svg" alt="Isla Bonita">
        </div>
        <div>
          <h1>Isla Bonita</h1>
          <p style="font-size: 0.7rem; opacity: 0.6; margin-top: -2px;">Seguimiento de Home Office</p>
        </div>
      </div>
      
      <button class="theme-toggle" onclick="toggleDarkMode()">
        ${darkMode ? '☀️' : '🌙'}
      </button>
    </header>

    <main>
      <!-- VISTA SEMANAL -->
      <div class="calendar-card">
        <div class="calendar-header">
          <button class="nav-btn" onclick="prevWeek()">❮</button>
          <div style="text-align: center;">
            <span class="calendar-title">${weekMonth} ${weekYear}</span>
            <div style="font-size: 0.7rem; opacity: 0.6;">Semana del ${weekDays[0].dayNum} al ${weekDays[4].dayNum}</div>
          </div>
          <button class="nav-btn" onclick="nextWeek()">❯</button>
        </div>
        
        <div class="week-grid">
          ${weekDays.map(day => `
            <div class="day-cell ${day.isToday ? 'active' : ''} ${day.isHoliday ? 'holiday' : ''}" 
                 onclick="${!day.isHoliday ? `openSwapDialog('${day.dateStr}')` : ''}"
                 style="${!day.isHoliday && day.person ? `border-bottom: 3px solid ${day.person.color}` : ''}">
              
              <div style="font-size: 0.7rem; font-weight: 700; margin-bottom: 4px; opacity: 0.7;">
                ${DAYS_ES[day.date.getDay()].substring(0, 3)} ${day.dayNum}
              </div>
              
              ${day.isHoliday
      ? '<div style="font-size: 1.5rem;">🇦🇷</div>'
      : day.birthday
        ? `<div class="user-avatar" style="background: #FFF0F5; color: #D81B60; border: 1px solid #FF69B4; font-size: 1.2rem;">🎂</div>`
        : `<div style="font-weight: 800; font-size: 0.9rem; color: ${day.person?.color || 'inherit'}; text-align: center; line-height: 1.1;">
                      ${day.person?.name || '?'}
                     </div>`
    }
              
              ${day.birthday ? `<div style="font-size: 0.5rem; color: #D81B60; font-weight: 700; margin-top: 2px;">Cumple</div>` : ''}
              ${overrides[day.dateStr] ? '<div style="font-size: 0.5rem; margin-top: 1px;">✏️</div>' : ''}
            </div>
          `).join('')}
        </div>
        <button class="btn-today" onclick="goToToday()" style="${isCurrentWeek(currentViewDate) ? 'display:none' : ''}">Volver a Hoy</button>
      </div>

      <!-- CARDS INFO -->
      <div class="info-section">
        <div class="card big-card">
          <div class="icon-box bg-palm">🏠</div>
          <div class="card-content">
            <h3 class="label-small">Hoy le toca:</h3>
            <p class="name-big">${todayPerson ? todayPerson.name : 'Nadie (Feriado/Finde)'}</p>
          </div>
        </div>

        <div class="card big-card">
          <div class="icon-box bg-sea">🌅</div>
          <div class="card-content">
            <h3 class="label-small">Mañana le toca:</h3>
            <p class="name-big">${tomorrowPerson ? tomorrowPerson.name : 'Nadie'}</p>
          </div>
        </div>
      </div>

      <!-- VISTA MENSUAL -->
      <div class="mcal-card">
        <div class="mcal-header">
          <button class="nav-btn" onclick="prevMonth()">❮</button>
          <span class="mcal-title">${monthName} ${monthYear}</span>
          <button class="nav-btn" onclick="nextMonth()">❯</button>
        </div>
        
        <div class="mcal-grid">
          <div class="mcal-head">D</div>
          <div class="mcal-head">L</div>
          <div class="mcal-head">M</div>
          <div class="mcal-head">X</div>
          <div class="mcal-head">J</div>
          <div class="mcal-head">V</div>
          <div class="mcal-head">S</div>

          ${monthDays.map(day => {
      if (!day) return '<div class="mcal-cell empty"></div>';

      const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;
      let content = '';

      if (day.isHoliday) {
        content = '<span style="font-size: 0.8rem;">🇦🇷</span>';
      } else if (day.person && !isWeekend) {
        content = `<div class="mcal-initial" style="background-color: ${day.person.color}">${day.person.initial}</div>`;
      }

      return `
              <div class="mcal-cell ${day.isToday ? 'mcal-today' : ''} ${isWeekend ? 'mcal-off' : ''}"
                   onclick="${(!isWeekend && !day.isHoliday && day.person) ? `openSwapDialog('${day.dateStr}')` : ''}">
                <span class="mcal-num">${day.dayNum}</span>
                ${content}
              </div>
            `;
    }).join('')}
        </div>

        <!-- RESUMEN MENSUAL -->
        <div class="mcal-summary">
          <div class="mcal-summary-title">Días Home Office (Estimado)</div>
          ${(() => {
      const stats = getMonthlyStats(monthDays); // Calcular stats
      return stats.map(st => `
              <div class="mcal-summary-item">
                <div class="mcal-summary-dot" style="background-color: ${st.color}"></div>
                <div class="mcal-summary-name">${st.name}</div>
                <div class="mcal-summary-count" style="color: ${st.color}; background: ${st.color}20">${st.count}</div>
              </div>
            `).join('');
    })()}
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
          ${TEAM.map(member => `
            <div class="team-item" onclick="confirmSwap(${member.id})">
              <div class="user-avatar" style="color: ${member.color}">${member.initial}</div>
              <span>${member.name}</span>
            </div>
          `).join('')}
        </div>
        <button id="close-modal" style="margin-top: 20px; width: 100%; padding: 10px; border: none; background: #eee; border-radius: 12px; font-weight: 600;">Cancelar</button>
      </div>
    </div>
  `;

  setupEventListeners();
}

// Re-declarar funciones globales para window
window.openSwapDialog = async (dateStr) => {
  const isAuthorized = await verifyAdmin();
  if (isAuthorized) {
    selectedDayToSwap = dateStr;
    document.querySelector('#swap-modal').style.display = 'flex';
  }
};

window.confirmSwap = (personId) => {
  if (selectedDayToSwap) {
    saveOverride(selectedDayToSwap, personId);
    selectedDayToSwap = null;
    document.querySelector('#swap-modal').style.display = 'none';
  }
};

window.toggleDarkMode = toggleDarkMode;
window.prevWeek = prevWeek;
window.nextWeek = nextWeek;
window.goToToday = goToToday;
window.prevMonth = prevMonth;
window.nextMonth = nextMonth;

function setupEventListeners() {
  const btnInstall = document.querySelector('#btn-install');
  if (btnInstall) {
    btnInstall.addEventListener('click', () => {
      // Logic for install placeholder
      if (window.deferredPrompt) {
        window.deferredPrompt.prompt();
        window.deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          window.deferredPrompt = null;
          document.querySelector('#install-banner').style.display = 'none';
        });
      }
    });
  }

  // Capture install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredPrompt = e;
    const banner = document.querySelector('#install-banner');
    if (banner) banner.style.display = 'flex';
  });

  const modal = document.querySelector('#swap-modal');
  const closeModal = document.querySelector('#close-modal');
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('SW registrado', reg))
      .catch(err => console.log('SW error', err));
  });
}

if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
  Notification.requestPermission();
}

render();
