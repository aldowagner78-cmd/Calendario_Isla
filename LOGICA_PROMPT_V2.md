# PROMPT MAESTRO PARA IA (ISLA BONITA - LOGICA DEFINITIVA)

**Objetivo:** Corregir y perfeccionar el algoritmo de asignación de Home Office en `src/main.js` para que cumpla ESTRICTAMENTE las **"6 Reglas de Oro"** indefinidamente (para siempre), sin romper la UI ni el estilo visual.

**Contexto:**
Es una aplicación web (Vanilla JS) que asigna 1 día de Home Office por semana a un equipo de 5 personas (Machi, Fabi, Gaston, Romi, Aldo). Las asignaciones se calculan en tiempo real mediante `runSimulation()` desde una fecha de inicio (2026-02-09).

---

## TAREA 1: DIAGNÓSTICO Y SCRIPT DE PRUEBA (CRÍTICO) 🛑✋

ANTES de tocar una sola línea de código en `src/main.js`, debes crear y ejecutar un script de prueba en Node.js (ej: `test_rules.js`) que simule la asignación por 2 o 5 años (iterando día a día) y verifique si se cumplen las reglas.

**El script debe reportar:**
1.  **Iteración Semanal:** Violaciones donde alguien tiene > 1 día (REGLA 2).
2.  **Iteración de Continuidad:** Casos donde el Viernes NO es seguido por el Lunes (pudiendo serlo) (REGLA 3).
3.  **Iteración Mensual:** Desviación estándar de días asignados por mes (REGLA 1).

---

## TAREA 2: IMPLEMENTACIÓN DE LAS 6 REGLAS 🛠️

Solo si el script de prueba falla, modifica `runSimulation()` en `src/main.js` para asegurar que NUNCA fallen estas reglas:

### 1. REGLA SUPREMA: Overrides (Sagrados) 👑
*   Si el usuario (admin) define manualmente un día (`overrides`), eso es **LEY**.
*   El sistema JAMÁS debe sobrescribir una decisión manual.
*   El sistema debe recalcular todo el futuro ADAPTÁNDOSE a ese cambio manual.

### 2. REGLA DE HIERRO: Límite Semanal (1 por semana) 🔒
*   **Ningún usuario** puede tener más de 1 día de Home Office en la misma semana (Lunes a Viernes).
*   Esta regla es **BLOQUEANTE**. Si te toca por rotación o por continuidad pero ya tienes un día esa semana, pierdes el turno.

### 3. REGLA DE CONTINUIDAD: Viernes -> Lunes 🔗
*   Quien tiene asignado el **Viernes**, tiene **DERECHO PREFERENTE** al **Lunes siguiente** (o el primer día hábil siguiente si es feriado).
*   Este derecho **MATA** a la equidad mensual (Regla 1).
*   **Excepción:** Solo se pierde si choca con la Regla 2 (ya tiene día esa semana) o la Regla 1 (Override).

### 4. REGLA DE ADAPTACIÓN: Fin de Mes (Equidad Forzada) ⚖️
*   A partir del **día 21** de cada mes, la prioridad de asignación cambia.
*   Se debe priorizar a los usuarios que tienen **MENOS** días asignados en el mes corriente.
*   Objetivo: Que al cerrar el mes, todos tengan la misma cantidad (o diferencia máx de 1).

### 5. REGLA DE FERIADOS: No cuentan 🇦🇷
*   Los feriados (definidos en `holidays.js` o `isHoliday()`) son días muertos.
*   Nadie tiene Home Office en feriado.
*   La continuidad salta feriados (Viernes -> Martes si Lunes es feriado).

### 6. REGLA DE EQUIDAD SUAVE: Durante el mes 🌊
*   Durante las primeras 3 semanas, intenta mantener los contadores parejos.
*   Si asignar a X hace que tenga 2 días más que el mínimo, intenta saltarlo (Soft Pass), **A MENOS QUE** sea por Continuidad (Regla 3), que tiene prioridad.

---

## RESTRICCIONES TÉCNICAS 🚫
1.  **NO CAMBIES LA UI:** El HTML/CSS y las funciones de renderizado (`render()`, `cards`, `dark mode`) no se tocan. Solo lógica.
2.  **LÓGICA EN `runSimulation()`:** Toda la magia debe ocurrir dentro de la función de simulación.
3.  **DETERMINISMO:** La simulación debe ser siempre igual para las mismas fechas si no hay overrides nuevos.

---

**Tu entregable debe ser:**
1.  El código del script de prueba (`test_rules.js`).
2.  El reporte de errores encontrados con ese script.
3.  (Si aplica) El código corregido de `src/main.js` que pase el test al 100%.
