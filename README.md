# 🌙 Prueba Lunar

**Prueba Lunar** es una aplicación web temática inspirada en **Genshin Impact**, diseñada para generar retos aleatorios en directo contra **Leyendas Locales** y otros jefes seleccionados.

El sistema construye desafíos con una combinación de:
- **1 jefe aleatorio**
- **2 condiciones medias**
- **1 condición dura**
- **1 tiempo límite adaptado**

Además, incluye un **cronómetro integrado**, reglas globales visibles dentro de la interfaz y una ambientación visual inspirada en un estilo elegante, nocturno y fantástico.

---

## ✨ Características principales

- Generación aleatoria de retos
- Jefes inspirados en contenidos de Genshin Impact
- Condiciones separadas por nivel de dificultad
- Tiempo límite adaptado al jefe o reto
- Cronómetro visual integrado
- Registro de victoria o derrota por ronda
- Sistema de progreso por 3 retos
- Reglas globales del modo visibles en la interfaz
- Personalización manual del reto actual
- Persistencia local mediante `localStorage`
- Diseño temático con estética lunar y fondo animado

---

## 🎯 Objetivo del proyecto

Este proyecto fue pensado para usarse en:
- directos o streams
- dinámicas con espectadores
- retos entre amigos
- eventos temáticos inspirados en Genshin Impact

La idea central es crear una experiencia visualmente atractiva y fácil de seguir, donde cada participante deba superar una serie de pruebas bajo condiciones específicas.

---

## 🧩 Estructura general del reto

Cada partida sigue esta lógica:

- Se generan **3 retos**
- El participante debe superar al menos **2 de 3**
- Cada reto incluye:
  - un jefe
  - dos condiciones medias
  - una condición dura
  - un tiempo límite

Si el cronómetro llega a cero, el sistema permite registrar si el reto fue cumplido o fallado antes del límite.

---

## 📜 Reglas globales del modo

Estas reglas aplican de forma permanente a todos los retos:

- El equipo debe definirse antes de entrar
- Sin cambiar el equipo después de iniciar
- Sin pausar el juego durante el intento
- Sin bajar el nivel de mundo

Estas reglas no se sortean: forman parte fija del modo de juego.

---

## 🕒 Cronómetro integrado

La aplicación incluye un temporizador visual para cada reto.

Funciones principales:
- iniciar el tiempo manualmente
- reiniciar el tiempo del reto actual
- adaptar el límite según el reto generado
- registrar el resultado al finalizar el tiempo

Esto permite mantener el ritmo de la dinámica sin depender de herramientas externas.

---

## 🧠 Lógica de generación

El sistema separa el contenido en varias capas:

- **BOSS_POOL**: jefes disponibles
- **MEDIUM_CONDITIONS**: condiciones medias
- **HARD_CONDITIONS_BY_TYPE**: condiciones duras por tipo de jefe
- **GLOBAL_RULES**: reglas permanentes del modo

También se aplican validaciones para evitar combinaciones redundantes o conflictivas entre condiciones.

---

## 🎨 Diseño visual

La interfaz busca transmitir una sensación:
- elegante
- nocturna
- mágica
- temática de fantasía

Incluye:
- paleta oscura con acentos dorados
- tipografías decorativas
- fondo con estrellas animadas
- elementos visuales inspirados en una estética lunar

---

## 📂 Estructura del proyecto

```
prueba-lunar/
├── index.html
├── README.md
└── assets/
    ├── css/
    │   └── styles.css
    └── js/
        ├── data.js
        └── app.js
```

---

## 🛠️ Tecnologías utilizadas
- HTML5
- CSS3
- JavaScript Vanilla

No utiliza frameworks externos para la lógica principal.

---

## 🔧 Personalización

El proyecto está preparado para seguir creciendo. Algunas ideas de ampliación son:

- agregar más jefes
- agregar más condiciones compatibles
- crear modos de dificultad
- ponderar la frecuencia de retos extremos
- añadir efectos de sonido
- incluir historial de partidas
- mostrar badges para condiciones medias y duras
- separar aún más las categorías de retos

---

## 📌 Estado del proyecto

Actualmente el proyecto se encuentra en una etapa funcional y jugable, con una base sólida para seguir iterando tanto en:

- balance de condiciones
- compatibilidad entre reglas
- interfaz
- experiencia para stream

---

## ⚠️ Aviso

Este proyecto es una creación de fans inspirada en la experiencia de juego de Genshin Impact.
No está afiliado oficialmente a HoYoverse.

---

## 👤 Autor

Proyecto desarrollado y adaptado como herramienta de retos temáticos para dinámicas en directo.