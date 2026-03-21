---
title: "prefers-reduced-motion: respetar al usuario que no quiere animaciones"
description: "Cómo usar la media query prefers-reduced-motion para desactivar animaciones cuando el usuario lo ha pedido. Con ejemplos prácticos y la filosofía detrás."
date: 2026-01-30
tags:
  - css
  - accesibilidad
  - técnicas
destacado: false
---

Hay usuarios que no quieren animaciones en la web. No es una preferencia estética — es una necesidad. Las animaciones pueden causar mareos, náuseas y desorientación en personas con trastornos vestibulares. Otros simplemente las encuentran distractivas. Ambos grupos merecen poder navegar cómodamente.

Los sistemas operativos modernos permiten activar una opción de "reducir movimiento" (macOS, iOS, Windows, Android). Y CSS tiene una media query que detecta esa preferencia: `prefers-reduced-motion`.

## La implementación básica

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Este bloque nuclear desactiva todas las animaciones y transiciones de un plumazo. Es efectivo pero tosco — también elimina transiciones sutiles que no causan problemas, como un cambio de color en hover.

## Un enfoque más matizado

En vez de matar todas las animaciones, prefiero desactivar selectivamente las que implican movimiento real (traslaciones, rotaciones, escalados) y mantener las que son puramente visuales (cambios de color, opacidad):

```css
@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }

  .animado {
    animation: none !important;
  }
}
```

Así mantengo los cambios de color en hover (que son informativos, no decorativos) pero elimino los elementos que entran deslizándose, las rotaciones del scroll y las transiciones de posición.

## La filosofía: motion como mejora progresiva

Hay un enfoque alternativo que me gusta más. En vez de definir animaciones y luego desactivarlas, puedes hacer lo contrario: definir la versión estática por defecto y añadir animaciones solo cuando el usuario no ha pedido reducirlas:

```css
/* Por defecto: sin animación */
.reveal {
  opacity: 1;
}

/* Solo animar si el usuario no ha pedido reducir movimiento */
@media (prefers-reduced-motion: no-preference) {
  .reveal {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }

  .reveal.visible {
    opacity: 1;
    transform: none;
  }
}
```

Este enfoque trata la animación como una **mejora progresiva**: la funcionalidad base es estática y funcional, y la animación se añade solo cuando es bienvenida. Es más robusto y más respetuoso.

## JavaScript también

Si tu JavaScript controla animaciones, también debería comprobar la preferencia:

```javascript
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (!prefersReducedMotion) {
  // Inicializar IntersectionObserver para reveals
  // Activar animaciones de scroll
  // etc.
}
```

Y si la preferencia puede cambiar durante la sesión (el usuario activa/desactiva la opción mientras navega):

```javascript
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

motionQuery.addEventListener("change", () => {
  if (motionQuery.matches) {
    desactivarAnimaciones();
  } else {
    activarAnimaciones();
  }
});
```

## En este sitio

Las animaciones de "reveal" (elementos que aparecen al hacer scroll) respetan `prefers-reduced-motion`. Si tienes la opción activada en tu sistema operativo, los elementos simplemente están ahí — sin deslizamiento, sin fundido. El contenido es el mismo; la decoración es la que cambia.

Es un esfuerzo mínimo para el desarrollador y una diferencia enorme para el usuario que lo necesita. No hay excusa para ignorarlo.
