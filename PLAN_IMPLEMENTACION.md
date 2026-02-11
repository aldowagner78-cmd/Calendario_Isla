# Plan de Implementación: Isla Bonita

## 🏝️ Concepto
Aplicación PWA para la gestión de Home Office rotativo con estética tropical minimalista.

## 🛠️ Stack Tecnológico
- **Frontend:** HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **Tooling:** Vite para desarrollo y bundling.
- **PWA:** Web App Manifest y Service Worker para instalación y funcionamiento offline.
- **Backend (Propuesto):** LocalStorage para la versión inicial, Supabase para persistencia grupal.

## 📋 Fases

### Fase 1: Identidad Visual y Estructura
- [ ] Generar logo e íconos (Palmera y Playa).
- [ ] Configurar el sistema de diseño en `style.css` (colores, tipografía, variables).
- [ ] Crear la estructura base en `index.html`.

### Fase 2: Lógica de Calendario y Rotación
- [ ] Implementar algoritmo de rotación secuencial para 5 personas.
- [ ] Desarrollar vista de calendario mensual/semanal.
- [ ] Implementar funcionalidad de "Intercambio de días" (Drag & Drop o Modal).

### Fase 3: PWA e Instalación
- [ ] Crear `manifest.json`.
- [ ] Implementar Service Worker para cacheo de assets.
- [ ] Añadir guía visual de instalación para iOS y Android.

### Fase 4: Persistencia y Notificaciones
- [ ] Sincronización con Backend (Supabase) para el "Link Mágico".
- [ ] Implementar API de Notificaciones del Navegador para avisos diarios.
- [ ] Lógica de avisos: "Mañana te toca Home Office".

## 🎨 Paleta de Colores (Tropical Minimal)
- **Fondo (Arena):** `#FDFCF0`
- **Primario (Palma):** `#2D5A27`
- **Secundario (Turquesa):** `#64C4BC`
- **Acento (Sol):** `#FFD700`
- **Texto:** `#1A2F1A`
