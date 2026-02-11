import './style.css'
import { isHoliday, getBirthday } from './holidays.js';

// --- CONFIGURACIÓN DEL EQUIPO ---
const TEAM = [
  { id: 1, name: 'Machi', color: '#26C6DA', initial: 'M' },   // Cyan
  { id: 2, name: 'Fabi', color: '#7E57C2', initial: 'F' },    // Deep Purple
  { id: 3, name: 'Gaston', color: '#FFA000', initial: 'G' },  // Amber/Gold
  { id: 4, name: 'Romi', color: '#EF5350', initial: 'R' },    // Red
  { id: 5, name: 'Aldo', color: '#66BB6A', initial: 'A' }     // Green
]; // Colores distintivos pero dentro de una paleta armoniosa

// Fecha de inicio de la rotación (Lunes 9 de Feb 2026)
const START_DATE = new Date('2026-02-09T00:00:00');

const DAYS_ES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

// --- ESTADO DE LA APLICACIÓN ---
let currentViewDate = new Date(); // Fecha que se está visualizando

// --- LÓGICA DE NEGOCIO (CORE) ---

// Cargar overrides del localStorage
let overrides = JSON.parse(localStorage.getItem('isla_bonita_overrides')) || {};

function saveOverride(dateString, personId) {
  overrides[dateString] = personId;
  localStorage.setItem('isla_bonita_overrides', JSON.stringify(overrides));
  render();
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

  // 1. Revisar si hay un override manual
  if (overrides[dateStr]) {
    return TEAM.find(p => p.id === overrides[dateStr]);
  }

  // 2. Revisar si es fin de semana o feriado
  if (!isWorkingDay(date)) return null;

  // 3. Calcular rotación con desplazamiento semanal
  // Cada ciclo de 5 días hábiles, el orden se desplaza 1 posición
  // Así nadie repite siempre el mismo día de la semana
  const workingDayIndex = getWorkingDayIndex(date);
  const cycle = Math.floor(workingDayIndex / 5);
  const positionInCycle = workingDayIndex % 5;
  const personIndex = (positionInCycle + cycle) % 5;

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

function prevMonth() {
  currentViewDate.setMonth(currentViewDate.getMonth() - 1);
  render();
}

function nextMonth() {
  currentViewDate.setMonth(currentViewDate.getMonth() + 1);
  render();
}

// --- RENDERIZADO ---

// Mini-calendario mensual
function renderMonthCalendar(viewDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const MONTHS_FULL = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  // Primer día del mes y cuántos días tiene
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Día de la semana del 1ro (0=Dom, ajustar a Lun=0)
  let startWeekday = firstDay.getDay(); // 0=Dom
  startWeekday = startWeekday === 0 ? 6 : startWeekday - 1; // Lun=0, Mar=1... Dom=6

  // Generar datos de cada día
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayCells = [];
  const hoCount = {}; // {personId: count}
  TEAM.forEach(p => hoCount[p.id] = 0);

  // Celdas vacías antes del día 1
  for (let i = 0; i < startWeekday; i++) {
    dayCells.push('<div class="mcal-cell empty"></div>');
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    date.setHours(0, 0, 0, 0);
    const person = getHomeOfficePerson(date);
    const isToday = date.getTime() === today.getTime();
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const holiday = isHoliday(date);

    if (person) hoCount[person.id]++;

    let cellClass = 'mcal-cell';
    if (isToday) cellClass += ' mcal-today';
    if (isWeekend || holiday) cellClass += ' mcal-off';

    let content = `<span class="mcal-num">${d}</span>`;
    if (person) {
      content += `<span class="mcal-dot" style="background:${person.color}"></span>`;
    }

    dayCells.push(`<div class="${cellClass}">${content}</div>`);
  }

  // Resumen de HO por persona
  const summaryItems = TEAM.map(p =>
    `<div class="mcal-summary-item">
      <span class="mcal-summary-dot" style="background:${p.color}"></span>
      <span class="mcal-summary-name">${p.name}</span>
      <span class="mcal-summary-count">${hoCount[p.id]}</span>
    </div>`
  ).join('');

  return `
    <div class="mcal-card">
      <div class="mcal-header">
        <button class="nav-btn" onclick="prevMonth()">❮</button>
        <span class="mcal-title">${MONTHS_FULL[month]} ${year}</span>
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
        ${dayCells.join('')}
      </div>
      <div class="mcal-summary">
        <h4 class="mcal-summary-title">Home Office del mes</h4>
        ${summaryItems}
      </div>
    </div>
  `;
}

const app = document.querySelector('#app');
let selectedDayToSwap = null;

function render() {
  const now = new Date();
  // Usar currentViewDate para la grilla
  const weekDays = getWeekDays(currentViewDate);

  // Info cards siempre muestran Hoy/Mañana REALES
  const todayPerson = getHomeOfficePerson(now);

  const tomorrow = new Date(now);
  do {
    tomorrow.setDate(tomorrow.getDate() + 1);
  } while (!isWorkingDay(tomorrow) && tomorrow.getFullYear() === now.getFullYear());

  const tomorrowPerson = getHomeOfficePerson(tomorrow);

  // Título de la semana
  const weekMonth = MONTHS_ES[weekDays[0].date.getMonth()];
  const weekYear = weekDays[0].date.getFullYear();

  app.innerHTML = `
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
                 onclick="${!day.isHoliday ? `openSwapDialog('${day.dateStr}')` : ''}">
              <div style="font-size: 0.7rem; font-weight: 700; margin-bottom: 2px;">
                ${DAYS_ES[day.date.getDay()].substring(0, 3)} ${day.dayNum}
              </div>
              
              ${day.isHoliday
      ? '<div style="font-size: 1.5rem;">🇦🇷</div>'
      : day.birthday
        ? `<div class="user-avatar" style="background: #FFF0F5; color: #D81B60; border: 1px solid #FF69B4; font-size: 1.2rem;">🎂</div>`
        : `<div class="user-avatar" style="${day.isToday ? '' : 'color: ' + day.person?.color}">
                      ${day.person?.initial || '?'}
                     </div>`
    }
              ${day.birthday ? `<div style="font-size: 0.5rem; color: #D81B60; margin-top: -5px; font-weight: 700;">Cumple ${day.birthday}</div>` : ''}
              ${!day.isHoliday && !day.birthday && day.person ? `<div style="font-size: 0.6rem; opacity: 0.8;">${day.person.name}</div>` : ''}
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
            <p>Toca un día en el calendario para cambiar.</p>
          </div>
        </div>
      </div>

      ${renderMonthCalendar(currentViewDate)}

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


window.openSwapDialog = (dateStr) => {
  selectedDayToSwap = dateStr;
  document.querySelector('#swap-modal').style.display = 'flex';
};

window.confirmSwap = (personId) => {
  if (selectedDayToSwap) {
    saveOverride(selectedDayToSwap, personId);
    selectedDayToSwap = null;
    document.querySelector('#swap-modal').style.display = 'none';
  }
};

window.prevWeek = prevWeek;
window.nextWeek = nextWeek;
window.goToToday = goToToday;
window.prevMonth = prevMonth;
window.nextMonth = nextMonth;

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
      .then(reg => {
        console.log('SW registrado', reg);
        // Forzar actualización del SW si hay una nueva versión
        reg.update();
      })
      .catch(err => console.log('SW error', err));
  });
}

try {
  render();
} catch (e) {
  console.error('Error al renderizar:', e);
  document.querySelector('#app').innerHTML = '<p style="padding:20px;text-align:center;">Error al cargar. Recargá la página.</p>';
}
// setInterval(render, 1000 * 60 * 60);
