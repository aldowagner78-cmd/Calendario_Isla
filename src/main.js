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

  // 1. Revisar override
  if (overrides && overrides[dateStr]) {
    return TEAM.find(p => p.id === overrides[dateStr]);
  }

  // 2. Revisar si es fin de semana o feriado
  if (!isWorkingDay(date)) return null;

  // 3. Calcular rotación basada en días hábiles acumulados
  const workingDayIndex = getWorkingDayIndex(date);
  const personIndex = workingDayIndex % 5;

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
  render();
}

// --- SEGURIDAD (ADMIN MODE SIMPLE) ---
async function verifyAdmin() {
  if (isAdmin) return true;

  const pin = prompt("🔒 Modo Admin\nIngresa el PIN de seguridad:");
  // PIN Hardcodeado simple para Aldo. 
  if (pin === '1234') {
    isAdmin = true;
    localStorage.setItem('isla_bonita_admin', 'true');
    showLocalNotification('🔓 Modo Admin Activado');
    return true;
  } else {
    alert("PIN Incorrecto");
    return false;
  }
}

// --- RENDERIZADO ---

const app = document.querySelector('#app');
let selectedDayToSwap = null;

function render() {
  const now = new Date(new Date().setHours(0, 0, 0, 0));

  const weekDays = getWeekDays(currentViewDate);
  const todayPerson = getHomeOfficePerson(now);

  const tomorrow = new Date(now);
  do {
    tomorrow.setDate(tomorrow.getDate() + 1);
  } while (!isWorkingDay(tomorrow) && tomorrow.getFullYear() === now.getFullYear());

  const tomorrowPerson = getHomeOfficePerson(tomorrow);

  const weekMonth = MONTHS_ES[weekDays[0].date.getMonth()];
  const weekYear = weekDays[0].date.getFullYear();

  app.innerHTML = `
    <button class="theme-toggle" onclick="toggleDarkMode()">
      ${darkMode ? '☀️' : '🌙'}
    </button>

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

        <div class="card" id="btn-swap-info" style="opacity: 0.7;">
          <div class="icon-box bg-sun">💡</div>
          <div class="card-content">
            <h3>Tip:</h3>
            <p>Toca un día en el calendario para cambiar (Admin).</p>
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

  if (isLoadingOverrides) {
    // Spinner logic placeholder
  }

  setupEventListeners();
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


window.openSwapDialog = async (dateStr) => {
  // VERIFICAR ADMIN ANTES DE ABRIR
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

function setupEventListeners() {
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const banner = document.querySelector('#install-banner');
    if (banner) banner.style.display = 'flex';
  });

  const btnInstall = document.querySelector('#btn-install');
  if (btnInstall) {
    btnInstall.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          document.querySelector('#install-banner').style.display = 'none';
        }
        deferredPrompt = null;
      }
    });
  }

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

// Request notification permission on load
if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
  Notification.requestPermission();
}

render(); // render inicial
