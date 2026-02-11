
# PROMPT PARA DEBUGGEAR PWA ISLA BONITA (PANTALLA BLANCA)

**Contexto:**
- **Stack:** Vite (Vanilla JS), sin framework, PWA (con Service Worker manual).
- **Hosting:** GitHub Pages en subdirectorio `/Calendario_Isla/`.
- **Problema:** Al instalar la PWA en Android, se muestra una **pantalla blanca** (white screen) al abrirla. En navegador funciona (o funcionaba antes).
- **Cambios recientes:** Se agregó lógica de feriados perpetuos (cálculo de Pascua/Carnaval), se cambiaron nombres y colores, y se ajustó el CSS para nombres grandes.

**Archivos Clave:**

**1. `vite.config.js`**
```js
import { defineConfig } from 'vite'
export default defineConfig({
  base: '/Calendario_Isla/',
  build: { outDir: 'dist' }
})
```

**2. `public/manifest.json`**
```json
{
  "name": "Isla Bonita - Home Office",
  "start_url": "/Calendario_Isla/",
  "scope": "/Calendario_Isla/",
  "display": "standalone",
  "background_color": "#FDFCF0",
  "theme_color": "#2D5A27",
  "icons": [ ... ]
}
```

**3. `public/sw.js`**
```js
const CACHE_NAME = 'isla-bonita-v3';
const ASSETS = ['./', 'index.html', 'logo.svg', 'manifest.json'];
// ... install & fetch handlers standard
```

**4. `src/main.js` (Lógica Principal)**
- Importa `holidays.js`.
- Renderiza el calendario en `#app` al cargar.
- Si falla, el `app.innerHTML` nunca se llena -> Pantalla Blanca.

**Posibres Causas a Investigar:**
1.  **Error de JS en `holidays.js`:** La función `getEasterDate` o el uso de `Set` podría estar fallando en versiones antiguas de Android WebView, o tener un error de sintaxis que detiene la ejecución global.
2.  **Ruta de `start_url`:** Si el `manifest.json` está en `/Calendario_Isla/manifest.json`, el `start_url` absoluto `/Calendario_Isla/` debería funcionar, pero a veces `./index.html` es más seguro.
3.  **Módulo ES6:** Vite usa `<script type="module">`. Si el navegador del PWA es muy viejo, podría fallar (aunque raro en 2026).
4.  **Cache del Service Worker:** Si `index.html` se cacheó mal o apunta a un JS inexistente.

**Instrucción para la IA:**
Revisa el código, busca errores de sintaxis o lógica en los cálculos de fecha, y sugiere una configuración de PWA más robusta para evitar la pantalla blanca.
