// --- FERIADOS ARGENTINA (Lógica Perpetua) ---

// Feriados Inamovibles (Día-Mes)
// Vamos a usar DD-MM para la lista de entrada y convertir internamente a YYYY-MM-DD
const FIXED_HOLIDAYS_DDMM = [
    '01-01', // Año Nuevo
    '24-03', // Día de la Memoria
    '02-04', // Malvinas
    '01-05', // Día del Trabajador
    '25-05', // Revolución de Mayo
    '20-06', // Belgrano / Bandera
    '09-07', // Independencia
    '08-12', // Inmaculada Concepción
    '25-12', // Navidad
];

// Cumpleaños (Día-Mes) - Nombre
// DD-MM
const BIRTHDAYS_DDMM = {
    '22-10': 'Aldo',
    '25-06': 'Gaston',
    '28-01': 'Machi',
    '25-07': 'Fabi',
    '01-12': 'Romi'
};

// Algoritmo para calcular Pascua (Meeus/Jones/Butcher) - Devuelve objeto Date
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

// Cache de feriados por año para no recalcular siempre
const holidaysCache = {};

function getHolidaysSetForYear(year) {
    if (holidaysCache[year]) return holidaysCache[year];

    const holidays = new Set();

    // 1. Feriados Fijos
    FIXED_HOLIDAYS_DDMM.forEach(dayMonth => {
        const [day, month] = dayMonth.split('-');
        // Formato ISO: YYYY-MM-DD
        holidays.add(`${year}-${month}-${day}`);
    });

    // 2. Feriados Variables calculados (Pascua y Carnaval)
    const easter = getEasterDate(year);

    // Viernes Santo (Easter - 2 días)
    const goodFriday = new Date(easter.getTime());
    goodFriday.setDate(easter.getDate() - 2);
    holidays.add(goodFriday.toISOString().split('T')[0]);

    // Carnaval Lunes y Martes (Easter - 48 y - 47 días)
    // Lunes
    const carnivalMon = new Date(easter.getTime());
    carnivalMon.setDate(easter.getDate() - 48);
    holidays.add(carnivalMon.toISOString().split('T')[0]);

    // Martes
    const carnivalTue = new Date(easter.getTime());
    carnivalTue.setDate(easter.getDate() - 47);
    holidays.add(carnivalTue.toISOString().split('T')[0]);

    // Feriados trasladables 'fijos' (San Martín 17/8, Diversidad 12/10, Soberanía 20/11)
    // Dejamos fijos por ahora DD-MM
    [
        '17-08', // San Martín
        '12-10', // Diversidad
        '20-11'  // Soberanía
    ].forEach(dayMonth => {
        const [day, month] = dayMonth.split('-');
        holidays.add(`${year}-${month}-${day}`);
    });

    holidaysCache[year] = holidays;
    return holidays;
}

export function isHoliday(date) {
    const year = date.getFullYear();
    const holidaysSet = getHolidaysSetForYear(year);
    const dateStr = date.toISOString().split('T')[0];
    return holidaysSet.has(dateStr);
}


export function getBirthday(date) {
    // Formato DD-MM
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const key = `${day}-${month}`;

    return BIRTHDAYS_DDMM[key] || null;
}
