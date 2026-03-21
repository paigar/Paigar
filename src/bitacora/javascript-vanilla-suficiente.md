---
title: "JavaScript vanilla es suficiente para tu web"
description: "Por qué no necesitas React, Vue ni ningún framework JavaScript para la mayoría de sitios web. Con ejemplos de lo que puedes hacer con el lenguaje nativo del navegador."
date: 2025-07-20
tags:
  - javascript
  - opinión
  - técnicas
destacado: false
---

Cada vez que alguien me pregunta qué framework JavaScript uso, la respuesta les sorprende: ninguno. Para los proyectos que hago — webs corporativas, blogs, portfolios, sitios de contenido — JavaScript vanilla es más que suficiente. Y no lo digo por nostalgia, sino por pragmatismo.

## Lo que realmente necesitas

Pensemos en las interacciones típicas de un sitio web:

- Menú hamburguesa que se abre y cierra
- Toggle de tema claro/oscuro
- Elementos que aparecen al hacer scroll
- Enlaces externos que se abren en pestaña nueva
- Un banner de cookies

¿Cuánto JavaScript necesitas para eso? Veamos el menú hamburguesa completo:

```javascript
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".nav-hamburger");
  const panel = document.getElementById("nav-panel");
  const overlay = document.getElementById("nav-overlay");
  const close = document.querySelector(".nav-panel__close");

  function open() {
    panel.classList.add("is-open");
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    btn.setAttribute("aria-expanded", "true");
  }

  function cerrar() {
    panel.classList.remove("is-open");
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    btn.setAttribute("aria-expanded", "false");
  }

  btn.addEventListener("click", open);
  close.addEventListener("click", cerrar);
  overlay.addEventListener("click", cerrar);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") cerrar();
  });
});
```

Son 25 líneas. Funciona en todos los navegadores, no tiene dependencias, no necesita build step, y hace exactamente lo que tiene que hacer. ¿Merece la pena cargar React (40KB+ gzipped) más React DOM para esto?

## Lo que ha cambiado

La razón por la que jQuery era imprescindible en 2010 era que JavaScript y el DOM eran un campo de minas. `addEventListener` no existía en IE. Seleccionar elementos era verboso. Las diferencias entre navegadores eran enormes.

Hoy tenemos:

- `document.querySelector` y `querySelectorAll` — selectores CSS nativos
- `classList` — manipulación de clases sin regex
- `addEventListener` — universal y consistente
- `fetch` — peticiones HTTP sin XMLHttpRequest
- `IntersectionObserver` — detección de visibilidad sin cálculos de scroll
- Template literals, destructuring, arrow functions, async/await

El lenguaje que justificó la existencia de jQuery ha mejorado tanto que la librería ya no tiene razón de ser.

## IntersectionObserver: el ejemplo perfecto

Antes, para saber si un elemento era visible en pantalla necesitabas escuchar el evento scroll, calcular la posición del elemento con `getBoundingClientRect()`, y comparar con el viewport. Era costoso y propenso a errores.

Ahora:

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".reveal").forEach(el => {
  observer.observe(el);
});
```

Esto es lo que uso en este sitio para las animaciones de entrada. No necesité instalar `aos.js` (24KB), ni `scroll-reveal` (22KB), ni mucho menos una librería de animación completa. Diez líneas de JavaScript vanilla y las transiciones se definen en CSS, donde pertenecen.

## Cuándo sí necesitas un framework

No soy un fundamentalista. Los frameworks tienen su lugar:

- **Aplicaciones con estado complejo** — un dashboard con datos en tiempo real, un editor visual, una herramienta de gestión. Aquí la reactividad de React o Vue aporta valor real.
- **SPAs con mucha interactividad** — donde la navegación client-side y la gestión de estado justifican la complejidad.
- **Equipos grandes** — donde la estructura que impone un framework ayuda a la coordinación.

Pero un blog, una web corporativa, un portfolio, una landing page... no son aplicaciones. Son documentos. Y los documentos se resuelven con HTML, CSS y una pizca de JavaScript.

## El coste oculto

Cada framework que añades tiene un coste que va más allá del tamaño del bundle:

- Dependencia de un ecosistema que puede cambiar de versión mayor cada año
- Build step obligatorio — ya no puedes abrir un HTML y trabajar
- Curva de aprendizaje para ti y para quien mantenga el proyecto después
- Actualizaciones de seguridad que tienes que seguir
- La tentación de "componentizar" todo, incluso lo que no lo necesita

JavaScript vanilla no tiene ninguno de estos costes. Funciona hoy y funcionará dentro de diez años. No se deprecia, no cambia de API, no necesita migración.
