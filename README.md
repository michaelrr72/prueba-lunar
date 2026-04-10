# 🌙 Prueba Lunar v4.1.0

**Prueba Lunar** es una aplicación web temática inspirada en **Genshin Impact** para organizar retos en vivo, validar intentos y administrar un torneo rápido desde una interfaz clara, visual y pensada para eventos.

---

## ✨ Modos disponibles

### Modo Solo
- 3 rondas por intento
- se necesitan **2 victorias** para completar la prueba
- el reto **empieza vacío** y el primer jefe se define con la ruleta
- al terminar una ronda, debes volver a **sortear manualmente** el siguiente reto
- incluye cronómetro, condiciones y edición manual del reto actual

### Modo Supervisado
- formato adaptado para participante + juez
- reglas ajustadas para validación acompañada y mejor seguimiento
- mantiene el mismo flujo manual de sorteo por ronda
- incluye avisos, progreso y persistencia local por modo

### Modo Torneo
- registro rápido de participantes
- bracket de eliminación directa
- calificación manual con botones **Pasa / Falla**
- el participante impar también se resuelve desde el mismo flujo visual
- persistencia local para continuar el evento más tarde

---

## 🚀 Ejecución

Este proyecto está preparado para funcionar de dos formas:

### 1. Local, sin servidor
Puedes abrir directamente:

```text
index.html
```

en tu navegador y usar la aplicación desde archivos locales.

### 2. Publicado en GitHub Pages
También funciona correctamente en un despliegue estático como:

```text
https://michaelrr72.github.io/prueba-lunar/
```

> No requiere backend, framework ni proceso de build para ejecutarse.

---

## ⌨️ Atajos útiles

### Solo / Supervisado
- `S` → sortear reto
- `Espacio` → iniciar o pausar tiempo
- `R` → reiniciar intento
- `W` → marcar victoria
- `L` → marcar derrota
- `E` → editar reto actual

### Torneo
- `Ctrl + Enter` → agregar participantes más rápido
- `G` → generar torneo

---

## 🧠 Flujo actual del reto

Cada ronda sigue esta lógica:

1. el intento arranca **sin jefe asignado**
2. el organizador pulsa **Sortear reto**
3. la ruleta elige el jefe y las condiciones del reto actual
4. se juega la ronda con cronómetro
5. al marcar **victoria** o **derrota**, la siguiente ronda queda nuevamente **pendiente de sorteo**

Esto evita cambios automáticos de jefe y mantiene el control manual del evento.

---

## 🧱 Estructura del proyecto

```text
assets/
  css/
    base.css
    layout.css
    components.css
    modes.css
  js/
    app.js
    torneo.js
    data.js
    data.local.js
    core/
      state.js
      storage.js
      utils.js
    features/
      challenge-generator.js
      live-mode.js
      roulette.js
      timer.js
      tournament.js
    data/
      bosses.js
      conditions.js
      modes.js
```

### Resumen por carpeta

| Ruta | Uso |
|---|---|
| `assets/css/` | estilos base, layout, componentes y variantes por modo |
| `assets/js/app.js` | entrada usada por `solo.html` y `supervisado.html` |
| `assets/js/torneo.js` | entrada usada por `torneo.html` |
| `assets/js/data.local.js` | compatibilidad para apertura local sin servidor |
| `assets/js/core/` | utilidades, estado y persistencia |
| `assets/js/features/` | lógica de ruleta, timer, flujo en vivo y torneo |
| `assets/js/data/` | configuración de modos, jefes y condiciones |

---

## 📄 Páginas principales

- `index.html` → selector general
- `solo.html` → modo solo
- `supervisado.html` → modo supervisado
- `torneo.html` → módulo de torneo

---

## ♿ Accesibilidad y uso en vivo

La versión actual incluye:
- mejor contraste y lectura general
- interfaz más consistente entre pantallas
- regiones `aria-live` para avisos relevantes
- cronómetro más claro para seguimiento en directo
- navegación pensada para organizador + participante + juez

---

## 🛠️ Tecnologías

- HTML5
- CSS3 modular
- JavaScript vanilla
- `localStorage` para persistencia local

---

## 📌 Notas de mantenimiento

- El estado local está versionado para evitar conflictos entre cambios mayores.
- `solo.html` y `supervisado.html` comparten la misma base funcional.
- El proyecto está orientado a **sitio estático**, así que cualquier cambio debe mantener compatibilidad con apertura local y con GitHub Pages.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta [`LICENSE`](LICENSE) para más detalles.

---

## ⚠️ Aviso

Este proyecto es una creación fan inspirada en la experiencia de juego de **Genshin Impact**.
No está afiliado oficialmente a HoYoverse.