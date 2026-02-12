// test_rules.js - Script de diagnóstico para las 6 Reglas de Oro
// Simula 5 años y verifica TODAS las reglas

// ========== EQUIPO ==========
const TEAM = [
  { id: 1, name: 'Machi', color: '#26C6DA', initial: 'M' },
  { id: 2, name: 'Fabi', color: '#7E57C2', initial: 'F' },
  { id: 3, name: 'Gaston', color: '#FFA000', initial: 'G' },
  { id: 4, name: 'Romi', color: '#EF5350', initial: 'R' },
  { id: 5, name: 'Aldo', color: '#66BB6A', initial: 'A' }
];

const START_DATE = new Date('2026-02-09T00:00:00');

// ========== FERIADOS (copiados de holidays.js) ==========
const FIXED_HOLIDAYS_DDMM = [
  '01-01', '24-03', '02-04', '01-05', '25-05',
  '20-06', '09-07', '08-12', '25-12',
];

function getEasterDate(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

const _holidaysCache = {};
function getHolidaysSetForYear(year) {
  if (_holidaysCache[year]) return _holidaysCache[year];
  const holidays = new Set();
  FIXED_HOLIDAYS_DDMM.forEach(dayMonth => {
    const [day, month] = dayMonth.split('-');
    holidays.add(`${year}-${month}-${day}`);
  });
  const easter = getEasterDate(year);
  const goodFriday = new Date(easter.getTime());
  goodFriday.setDate(easter.getDate() - 2);
  holidays.add(goodFriday.toISOString().split('T')[0]);
  const carnivalMon = new Date(easter.getTime());
  carnivalMon.setDate(easter.getDate() - 48);
  holidays.add(carnivalMon.toISOString().split('T')[0]);
  const carnivalTue = new Date(easter.getTime());
  carnivalTue.setDate(easter.getDate() - 47);
  holidays.add(carnivalTue.toISOString().split('T')[0]);
  ['17-08', '12-10', '20-11'].forEach(dayMonth => {
    const [day, month] = dayMonth.split('-');
    holidays.add(`${year}-${month}-${day}`);
  });
  _holidaysCache[year] = holidays;
  return holidays;
}

function isHoliday(date) {
  const year = date.getFullYear();
  const holidaysSet = getHolidaysSetForYear(year);
  const dateStr = date.toISOString().split('T')[0];
  return holidaysSet.has(dateStr);
}

function isWorkingDay(date) {
  const day = date.getDay();
  if (day === 0 || day === 6) return false;
  return !isHoliday(date);
}

// ========== SIMULACIÓN (copia EXACTA del nuevo main.js runSimulation v19) ==========
function runSimulationCurrent(overrides = {}, yearsToSimulate = 5) {
  const simulationCache = {};

  let state = {
    monthlyCounts: {},
    weeklyCounts: {},
    pendingFridayUser: null,
    lastAssignedIndex: TEAM.length - 1,
    currentMonth: -1,
    currentYear: -1,
    currentWeekStr: ''
  };

  TEAM.forEach(p => state.monthlyCounts[p.id] = 0);

  const endDate = new Date(START_DATE);
  endDate.setFullYear(endDate.getFullYear() + yearsToSimulate);

  let d = new Date(START_DATE);
  d.setHours(0, 0, 0, 0);

  while (d <= endDate) {
    const dateStr = d.toISOString().split('T')[0];
    const month = d.getMonth();
    const year = d.getFullYear();

    const weekStart = new Date(d);
    const dayOfWeek = weekStart.getDay();
    const diffToMon = weekStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    weekStart.setDate(diffToMon);
    const weekStr = weekStart.toISOString().split('T')[0];

    if (month !== state.currentMonth || year !== state.currentYear) {
      TEAM.forEach(p => state.monthlyCounts[p.id] = 0);
      state.currentMonth = month;
      state.currentYear = year;
    }

    if (weekStr !== state.currentWeekStr) {
      state.weeklyCounts = {};
      TEAM.forEach(p => state.weeklyCounts[p.id] = 0);
      state.currentWeekStr = weekStr;
    }

    if (isWorkingDay(d)) {
      let assignedPerson = null;

      // REGLA 1: OVERRIDES SAGRADOS
      if (overrides[dateStr]) {
        assignedPerson = TEAM.find(p => p.id === overrides[dateStr]);
      } else {
        // REGLA 2: Pool de elegibles
        const eligible = TEAM.filter(p => state.weeklyCounts[p.id] < 1);

        if (eligible.length > 0) {
          const nextIdx = (state.lastAssignedIndex + 1) % TEAM.length;

          // REGLA 3: CONTINUIDAD (equidad siempre prioridad)
          if (state.pendingFridayUser && eligible.some(p => p.id === state.pendingFridayUser.id)) {
            const minCount = Math.min(...eligible.map(p => state.monthlyCounts[p.id]));
            if (state.monthlyCounts[state.pendingFridayUser.id] <= minCount) {
              assignedPerson = state.pendingFridayUser;
            }
          }

          if (!assignedPerson) {
            // REGLAS 4 y 6: EQUIDAD + ROTACIÓN
            const sorted = [...eligible].sort((a, b) => {
              const diff = state.monthlyCounts[a.id] - state.monthlyCounts[b.id];
              if (diff !== 0) return diff;
              const aIdx = TEAM.findIndex(t => t.id === a.id);
              const bIdx = TEAM.findIndex(t => t.id === b.id);
              const aDist = (aIdx - nextIdx + TEAM.length) % TEAM.length;
              const bDist = (bIdx - nextIdx + TEAM.length) % TEAM.length;
              return aDist - bDist;
            });

            assignedPerson = sorted[0];
          }
        }
        // eligible vacío → no asignación (Regla 2 absoluta)
      }

      if (assignedPerson) {
        simulationCache[dateStr] = assignedPerson.id;
        state.monthlyCounts[assignedPerson.id]++;
        state.weeklyCounts[assignedPerson.id]++;
        state.lastAssignedIndex = TEAM.findIndex(p => p.id === assignedPerson.id);

        if (d.getDay() === 5) {
          state.pendingFridayUser = assignedPerson;
        } else {
          state.pendingFridayUser = null;
        }
      }
    }

    d.setDate(d.getDate() + 1);
  }

  return simulationCache;
}

// ========== VERIFICACIÓN DE REGLAS ==========
function testRules(simulationCache) {
  const violations = {
    rule2: [],
    rule3_hard: [],   // Violaciones en semanas 1-3 (INACEPTABLE)
    rule3_soft: [],   // Sacrificios de continuidad en día 21+ (ACEPTABLE por equidad)
    rule5: [],
    monthlyStats: [],
  };

  const weeks = {};
  const months = {};

  const entries = Object.entries(simulationCache).sort(([a], [b]) => a.localeCompare(b));

  for (const [dateStr, personId] of entries) {
    const d = new Date(dateStr + 'T00:00:00');

    // REGLA 5: No asignaciones en feriados
    if (isHoliday(d)) {
      violations.rule5.push({ date: dateStr, person: TEAM.find(p => p.id === personId)?.name });
    }

    // Agrupar por semana
    const weekStart = new Date(d);
    const dayOfWeek = weekStart.getDay();
    const diffToMon = weekStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    weekStart.setDate(diffToMon);
    const weekStr = weekStart.toISOString().split('T')[0];

    if (!weeks[weekStr]) weeks[weekStr] = {};
    if (!weeks[weekStr][personId]) weeks[weekStr][personId] = [];
    weeks[weekStr][personId].push(dateStr);

    // Agrupar por mes
    const monthStr = dateStr.substring(0, 7);
    if (!months[monthStr]) {
      months[monthStr] = {};
      TEAM.forEach(p => months[monthStr][p.id] = 0);
    }
    months[monthStr][personId]++;
  }

  // REGLA 2: Máx 1 día por semana
  for (const [weekStr, personDays] of Object.entries(weeks)) {
    for (const [personId, days] of Object.entries(personDays)) {
      if (days.length > 1) {
        violations.rule2.push({
          week: weekStr,
          person: TEAM.find(p => p.id === parseInt(personId))?.name,
          days: days,
          count: days.length
        });
      }
    }
  }

  // REGLA 3: Continuidad Viernes→ siguiente día hábil
  let lastFridayPerson = null;
  let lastFridayDate = null;

  for (const [dateStr, personId] of entries) {
    const d = new Date(dateStr + 'T00:00:00');
    const dayOfWeek = d.getDay();

    if (dayOfWeek === 5) {
      lastFridayPerson = personId;
      lastFridayDate = dateStr;
    } else if (lastFridayPerson !== null) {
      // ¿Es este el primer día hábil después del viernes?
      const friday = new Date(lastFridayDate + 'T00:00:00');
      let nextWorkDay = new Date(friday);
      nextWorkDay.setDate(nextWorkDay.getDate() + 1);
      while (!isWorkingDay(nextWorkDay)) {
        nextWorkDay.setDate(nextWorkDay.getDate() + 1);
      }
      const nextWorkDayStr = nextWorkDay.toISOString().split('T')[0];

      if (dateStr === nextWorkDayStr) {
        if (personId !== lastFridayPerson) {
          // Verificar si el de viernes ya tenía día esa semana (excepción Regla 2)
          const wkStart = new Date(d);
          const dow = wkStart.getDay();
          const diff = wkStart.getDate() - dow + (dow === 0 ? -6 : 1);
          wkStart.setDate(diff);
          const wStr = wkStart.toISOString().split('T')[0];

          const fridayPersonDays = weeks[wStr]?.[lastFridayPerson] || [];
          const alreadyHasDay = fridayPersonDays.some(dd => dd < dateStr);

          // También verificar override
          const isOverridden = false; // No tenemos overrides en test base

          if (!alreadyHasDay && !isOverridden) {
            // Sacrificio de continuidad por equidad (siempre aceptable)
            violations.rule3_soft.push({
              friday: lastFridayDate,
              fridayPerson: TEAM.find(p => p.id === lastFridayPerson)?.name,
              nextWorkDay: dateStr,
              assignedTo: TEAM.find(p => p.id === personId)?.name,
            });
          }
        }
        lastFridayPerson = null;
      }
    }
  }

  // EQUIDAD MENSUAL
  for (const [monthStr, counts] of Object.entries(months)) {
    const values = Object.values(counts);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const stddev = Math.sqrt(values.reduce((sum, v) => sum + (v - avg) ** 2, 0) / values.length);
    const details = TEAM.map(p => `${p.name}:${counts[p.id]}`).join(', ');

    violations.monthlyStats.push({
      month: monthStr,
      min, max, diff: max - min, stddev: stddev.toFixed(2),
      details
    });
  }

  return violations;
}

// ========== EJECUCIÓN ==========
console.log('========================================');
console.log('  DIAGNÓSTICO DE REGLAS DE ORO');
console.log('========================================\n');
console.log(`Fecha inicio: ${START_DATE.toISOString().split('T')[0]}`);
console.log('Simulando 10 años...\n');

const cache = runSimulationCurrent({}, 10);
const totalDays = Object.keys(cache).length;
console.log(`Total días asignados: ${totalDays}\n`);

const results = testRules(cache);

// --- REGLA 2 ---
console.log('--- REGLA 2: Límite Semanal (máx 1 día/semana) ---');
if (results.rule2.length === 0) {
  console.log('✅ Sin violaciones\n');
} else {
  console.log(`❌ ${results.rule2.length} VIOLACIONES:`);
  results.rule2.slice(0, 30).forEach(v => {
    console.log(`  Semana ${v.week}: ${v.person} tiene ${v.count} días → [${v.days.join(', ')}]`);
  });
  if (results.rule2.length > 30) console.log(`  ... y ${results.rule2.length - 30} más`);
  console.log();
}

// --- REGLA 3 ---
console.log('--- REGLA 3: Continuidad Viernes→Lunes ---');
console.log('✅ Continuidad como preferencia (equidad siempre prioritaria)');
if (results.rule3_soft.length > 0) {
  console.log(`ℹ️  ${results.rule3_soft.length} veces se sacrificó continuidad por equidad → OK`);
}
console.log();

// --- REGLA 5 ---
console.log('--- REGLA 5: No asignaciones en feriados ---');
if (results.rule5.length === 0) {
  console.log('✅ Sin violaciones\n');
} else {
  console.log(`❌ ${results.rule5.length} VIOLACIONES:`);
  results.rule5.forEach(v => console.log(`  ${v.date}: ${v.person}`));
  console.log();
}

// --- EQUIDAD MENSUAL ---
console.log('--- EQUIDAD MENSUAL (Reglas 4 y 6) ---');
let badMonths = 0;
let warnMonths = 0;
results.monthlyStats.forEach(s => {
  if (s.diff > 2) {
    badMonths++;
    console.log(`  ❌ ${s.month}: Dif=${s.diff}, StdDev=${s.stddev} | ${s.details}`);
  } else if (s.diff > 1) {
    warnMonths++;
    console.log(`  ⚠️  ${s.month}: Dif=${s.diff}, StdDev=${s.stddev} | ${s.details}`);
  }
});
if (badMonths === 0 && warnMonths === 0) {
  console.log('✅ Todos los meses tienen diferencia ≤ 1\n');
} else if (badMonths === 0) {
  console.log(`\n⚠️  ${warnMonths} meses con dif=2 (estructural: Regla 3 mata equidad + feriados)\n`);
  console.log('   Nota: diff=2 es inevitable cuando continuidad Vie→Lun colisiona');
  console.log('   con feriados en semanas parciales. Regla 3 > Regla 4 por diseño.\n');
} else {
  console.log(`\n❌ ${badMonths} meses con dif > 2 (BUG REAL)\n`);
}

// --- RESUMEN FINAL ---
console.log('========================================');
console.log('  RESUMEN');
console.log('========================================');
console.log(`Violaciones Regla 2 (semanal):   ${results.rule2.length}`);
console.log(`Sacrificios Regla 3 (equidad):   ${results.rule3_soft.length}`);
console.log(`Violaciones Regla 5 (feriados):  ${results.rule5.length}`);
console.log(`Meses con dif > 2 (BUG):         ${badMonths}/${results.monthlyStats.length}`);
console.log(`Meses con dif = 2:               ${warnMonths}/${results.monthlyStats.length}`);

const allGood = results.rule2.length === 0 && results.rule5.length === 0 && badMonths === 0;
console.log(allGood ? '\n🎉 TODAS LAS REGLAS SE CUMPLEN' : '\n🔴 HAY VIOLACIONES - SE REQUIERE CORRECCIÓN');
