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
- modo torneo con bracket de eliminación directa
- navegación entre Prueba Lunar y Torneo Lunar
- bracket visual con avance manual de ganadores
- definición de un campeón final

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

## 🏆 Modo Torneo

Además del modo principal de retos, el proyecto incluye una página alternativa de torneo pensada para dinámicas competitivas entre varios participantes.

Características del modo torneo:
- registro manual de participantes
- generación automática de bracket
- eliminación directa hasta obtener un campeón
- avance manual de ganadores por ronda
- soporte visual para enfrentamientos y final
- persistencia local mediante `localStorage`

---

## 🧱 Estructura ampliada del proyecto

```
prueba-lunar/
├── index.html
├── torneo.html
├── README.md
└── assets/
    ├── css/
    │   └── styles.css
    └── js/
        ├── data.js
        ├── app.js
        └── torneo.js
```

---

## 🎮 Modos disponibles
**Prueba Lunar**

Modo principal de retos individuales contra jefes seleccionados, con condiciones aleatorias, tiempo límite y progreso por rondas.

**Torneo Lunar**

Modo competitivo de eliminación directa, pensado para organizar enfrentamientos entre participantes hasta definir un único campeón.

---

## 🛠️ Tecnologías utilizadas
- HTML5
- CSS3
- JavaScript Vanilla

No utiliza frameworks externos para la lógica principal.

---

## � Instalación y Uso

### Requisitos previos
- Un navegador web moderno (Chrome, Firefox, Edge, etc.)
- Conexión a internet (opcional, para fuentes externas)

### Instalación
1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/prueba-lunar.git
   ```
2. Navega al directorio del proyecto:
   ```bash
   cd prueba-lunar
   ```
3. Abre `index.html` en tu navegador web.

### Uso
- **Modo Prueba Lunar**: Abre `index.html` para generar retos aleatorios.
- **Modo Torneo Lunar**: Abre `torneo.html` para organizar torneos.
- Los datos se guardan automáticamente en el navegador usando `localStorage`.

### Demo en línea
Si está desplegado, incluye un enlace aquí: [Demo](https://tu-usuario.github.io/prueba-lunar/)

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Para contribuir:

1. Haz un fork del proyecto.
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -am 'Agrega nueva funcionalidad'`).
4. Push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

### Ideas para contribuir
- Agregar más jefes o condiciones.
- Mejorar la accesibilidad (ARIA, navegación por teclado).
- Traducir a otros idiomas.
- Optimizar el rendimiento.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 📝 Changelog

### v2.0
- Agregado modo torneo con bracket de eliminación directa.
- Mejoras en la interfaz y persistencia de datos.
- Soporte para personalización manual de retos.

### v1.0
- Versión inicial con generación de retos aleatorios.
- Cronómetro integrado y reglas globales.

---

## ⚠️ Aviso

Este proyecto es una creación de fans inspirada en la experiencia de juego de Genshin Impact.
No está afiliado oficialmente a HoYoverse.
