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

### Modo Cooperativo
- formato para **2 jugadores** enfrentando el mismo jefe
- cada jugador recibe una **condición individual** además de las **condiciones compartidas**
- los dos deben cumplir su condición para ganar la ronda
- la dificultad escala: los jefes difíciles se tratan como **extremos** y los extremos suman una condición extra compartida
- mismo sistema de 3 rondas y 2 victorias necesarias, con persistencia local independiente

### Modo Torneo
- registro rápido de participantes
- bracket de eliminación directa
- calificación manual con botones **Pasa / Falla**
- el participante impar también se resuelve desde el mismo flujo visual
- persistencia local para continuar el evento más tarde

---

## 🆕 Funciones recientes

### 🤍 Modo amable
Un interruptor global que **filtra las condiciones marcadas como duras** del próximo sorteo. Útil para sesiones casuales, demos o cuando se quiere bajar el listón sin reescribir reglas.

- **Dónde activarlo**: botón **🤍 Modo amable** junto al botón **Sortear reto** (panel de configuración), disponible en solo, supervisado y cooperativo.
- **Qué hace**: cuando está **ON**, retira del pool las condiciones marcadas con `hard: true` (14 en total: individuales, medias y duras por tipo de jefe) antes de cualquier sorteo o re-roll.
- **Aplicación inmediata**: si pulsas el toggle **con un reto ya sorteado y la ronda aún no iniciada**, el reto en pantalla se regenera al vuelo con el filtro nuevo (mismo jefe, condiciones recalculadas).
- **Aplicación diferida**: si la ronda ya empezó (timer corriendo o resultados marcados), el cambio se reserva para el próximo sorteo y se anuncia por `aria-live`.
- **Indicador visual**: cuando está activo, aparece un chip rosa **🤍 Modo amable** en la cabecera de la tarjeta del reto para que el filtro sea visible de un vistazo.
- **Cobertura**: aplica al sorteo principal, al re-roll del reto y al re-roll individual del cooperativo.
- **Persistencia**: la preferencia se guarda en `localStorage` (`prueba-lunar-friendly-mode`) y es **global**: si lo activas en modo solo, también queda activo en supervisado y coop.
- **Salvaguarda**: si tras filtrar el pool queda vacío para algún tipo de jefe, se restaura el pool completo de esa categoría para garantizar que siempre haya algo que sortear.

### 🔄 Re-roll por jugador (cooperativo)
Cada jugador en el modo cooperativo dispone de **un re-roll individual por intento** para su condición personal, sin afectar la del compañero.

- **Dónde**: botón **🔄 Re-roll** debajo de la condición de cada jugador, una vez sorteado el jefe.
- **Cuánto**: **1 uso por jugador por intento**. Se reinicia al pulsar **Reiniciar intento**, no entre rondas individuales.
- **Garantías**: la condición resultante es distinta a la que tenía el jugador antes del re-roll **y** distinta a la del otro jugador.
- **Respeta el Modo amable**: si está activo, el re-roll también filtra las condiciones duras.
- **Estado visual**: una vez usado, el botón queda gris, tachado y deshabilitado con texto "Re-roll usado".
- **Persistencia**: los flags `player1RerollUsed` / `player2RerollUsed` se guardan junto al resto del estado del intento.

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

### Cooperativo
- `S` → sortear reto
- `Espacio` → iniciar o pausar tiempo
- `R` → reiniciar ronda (o reiniciar la prueba completa si ya terminó)
- `1` → ciclar resultado del Jugador 1 (pendiente → cumplió → falló)
- `2` → ciclar resultado del Jugador 2

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
      coop-mode.js
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
- `cooperativo.html` → modo cooperativo (2 jugadores)
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
- **PWA**: `manifest.json` + Service Worker (`sw.js`) para funcionar offline e instalarse en el dispositivo

---

## 📱 Progressive Web App (PWA)

La app es instalable y funciona sin conexión:

- En **móvil**: abre la app en el navegador y pulsa "Añadir a pantalla de inicio". Aparecerá un ícono lunar igual que cualquier app nativa.
- En **escritorio** (Chrome/Edge): aparecerá un botón "Instalar" en la barra de direcciones.
- Tras instalar, la app **funciona sin internet** — útil en eventos con WiFi inestable.
- Para forzar actualización tras un cambio importante, abre DevTools → Application → Service Workers → "Update on reload" y recarga.

---

## 📌 Notas de mantenimiento

- El estado local está versionado para evitar conflictos entre cambios mayores.
- `solo.html` y `supervisado.html` comparten la misma base funcional (`assets/js/app.js`).
- `cooperativo.html` usa su propia entrada (`assets/js/features/coop-mode.js`) con persistencia local independiente.
- El proyecto está orientado a **sitio estático**, así que cualquier cambio debe mantener compatibilidad con apertura local y con GitHub Pages.
- **Importante para PWA**: si modificas `sw.js` o los assets precacheados, cambia también `CACHE_VERSION` dentro de `sw.js` para que los clientes existentes refresquen la caché.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta [`LICENSE`](LICENSE) para más detalles.

---

## ⚠️ Aviso de atribución

**Prueba Lunar** es un proyecto fan no oficial sin ánimo de lucro, creado por afición.

**Genshin Impact**, sus personajes, mecánicas, nombres, y todos los assets visuales del juego son propiedad de © **COGNOSPHERE PTE. LTD.** y miHoYo Ltd. Todos los derechos reservados. Este proyecto no está afiliado, asociado, autorizado, respaldado por, ni conectado oficialmente con HoYoverse / Cognosphere.

Los retratos de personajes se sirven desde CDNs comunitarios:
- [`genshin.jmp.blue`](https://genshin.jmp.blue/) — API comunitaria de Genshin Impact.
- [`enka.network`](https://enka.network/) — base de datos comunitaria de showcases.

Las propiedades intelectuales, marcas registradas e imágenes utilizadas pertenecen a sus respectivos propietarios.

Si eres parte del equipo legal de HoYoverse / Cognosphere y consideras que este proyecto necesita modificarse o retirarse, abre un *issue* en este repositorio y será atendido de inmediato.