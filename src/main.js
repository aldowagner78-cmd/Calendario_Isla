import './style.css'

// --- CONFIGURACIÓN DEL EQUIPO ---
const TEAM = [
  { id: 1, name: 'Machi', color: '#64C4BC', initial: 'M' },
  { id: 2, name: 'Profesor', color: '#2D5A27', initial: 'P' },
  { id: 3, name: 'Gaston', color: '#FFD700', initial: 'G' },
  { id: 4, name: 'Romi', color: '#5D4037', initial: 'R' },
  { id: 5, name: 'Aldo', color: '#64C4BC', initial: 'A' }
];

// Fecha de inicio de la rotación (debe ser un lunes)
const START_DATE = new Date('2026-02-09');

const DAYS_ES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

// --- LÓGICA DE NEGOCIO ---

function getWeekNumber(date) {
  const diffTime = Math.abs(date - START_DATE);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor((diffDays) / 7);
}

function getHomeOfficePerson(date) {
  let dayIndex = date.getDay() - 1; // 0=Mon, 4=Fri
  if (dayIndex < 0 || dayIndex > 4) return null; // Fines de semana

  const weekNum = getWeekNumber(date);
  // Algoritmo: (DayIndex - WeekNum) % 5
  let personIndex = (dayIndex - (weekNum % 5) + 5) % 5;
  return TEAM[personIndex];
}

function getWeekDays(date) {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Ajustar a lunes
  startOfWeek.setDate(diff);

  const days = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    days.push({
      date: d,
      person: getHomeOfficePerson(d),
      isToday: d.toDateString() === new Date().toDateString()
    });
  }
  return days;
}

// --- RENDERIZADO ---

const app = document.querySelector('#app');

function render() {
  const now = new Date();
  const weekDays = getWeekDays(now);
  const todayPerson = getHomeOfficePerson(now);
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowPerson = getHomeOfficePerson(tomorrow);

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
          <span class="calendar-title">Semana Actual</span>
          <span class="today-chip">Hoy</span>
        </div>
        
        <div class="week-grid">
          ${weekDays.map(day => `
            <div class="day-cell ${day.isToday ? 'active' : ''}">
              <span class="day-name">${DAYS_ES[day.date.getDay() - 1].substring(0, 3)}</span>
              <div class="user-avatar" style="${day.isToday ? '' : 'color: ' + day.person.color}">
                ${day.person.initial}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="info-section">
        <div class="card">
          <div class="icon-box bg-palm">🏠</div>
          <div class="card-content">
            <h3>Hoy le toca a:</h3>
            <p>${todayPerson ? todayPerson.name : 'Nadie (descanso)'}</p>
          </div>
        </div>

        <div class="card">
          <div class="icon-box bg-sea">🌅</div>
          <div class="card-content">
            <h3>Mañana le toca:</h3>
            <p>${tomorrowPerson ? tomorrowPerson.name : 'Nadie (descanso)'}</p>
          </div>
        </div>

        <div class="card" id="btn-swap">
          <div class="icon-box bg-sun">🔄</div>
          <div class="card-content">
            <h3>Intercambiar Día</h3>
            <p>Toca para negociar un cambio</p>
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
        <h2 class="modal-title">¿Con quién cambias?</h2>
        <div class="team-list">
          ${TEAM.map(member => `
            <div class="team-item">
              <div class="user-avatar" style="color: ${member.color}">${member.initial}</div>
              <span>${member.name}</span>
            </div>
          `).join('')}
        </div>
        <button id="close-modal" style="margin-top: 20px; width: 100%; padding: 10px; border: none; background: #eee; border-radius: 12px;">Cancelar</button>
      </div>
    </div>
  `;

  setupEventListeners();
}

function setupEventListeners() {
  // PWA Install Logic
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.querySelector('#install-banner').style.display = 'flex';
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

  // Modal Logic
  const btnSwap = document.querySelector('#btn-swap');
  const modal = document.querySelector('#swap-modal');
  const closeModal = document.querySelector('#close-modal');

  if (btnSwap) {
    btnSwap.addEventListener('click', () => {
      modal.style.display = 'flex';
    });
  }

  if (closeModal) {
    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  // Request Notifications
  if ('Notification' in window) {
    if (Notification.permission === 'default') {
      setTimeout(() => {
        Notification.requestPermission();
      }, 5000);
    }
  }
}

// Inicializar app
render();

// Registro de Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('SW registrado', reg))
      .catch(err => console.log('SW error', err));
  });
}
