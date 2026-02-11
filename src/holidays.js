// Lista de feriados inamovibles y trasladables de Argentina 2026 (Estimados)
// Formato YYYY-MM-DD
export const HOLIDAYS_2026 = [
    // Enero
    '2026-01-01', // Año Nuevo

    // Febrero (Carnaval - Estimado)
    '2026-02-16', // Lunes de Carnaval (Est)
    '2026-02-17', // Martes de Carnaval (Est)

    // Marzo
    '2026-03-24', // Día de la Memoria

    // Abril
    '2026-04-02', // Malvinas
    '2026-04-03', // Viernes Santo

    // Mayo
    '2026-05-01', // Día del Trabajador
    '2026-05-25', // Revolución de Mayo

    // Junio
    '2026-06-17', // Paso a la Inmortalidad de Güemes (Podría variar)
    '2026-06-20', // Belgrano / Bandera

    // Julio
    '2026-07-09', // Independencia

    // Agosto
    '2026-08-17', // San Martín (Probable que sea trasladado)

    // Octubre
    '2026-10-12', // Diversidad Cultural (Probable que sea trasladado)

    // Noviembre
    '2026-11-20', // Soberanía Nacional

    // Diciembre
    '2026-12-08', // Inmaculada Concepción
    '2026-12-25', // Navidad
];

// Función helper para chequear feriados
export function isHoliday(date) {
    const dateStr = date.toISOString().split('T')[0];
    return HOLIDAYS_2026.includes(dateStr);
}
