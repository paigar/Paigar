---
title: "Animaciones ligadas al scroll con una sola línea de JavaScript"
description: "Cómo usar una variable CSS alimentada por el scroll del navegador para crear animaciones complejas sin librerías. La técnica detrás de la versión anterior de paigar.es."
date: 2025-12-02
tags:
  - css
  - javascript
  - animaciones
  - técnicas
destacado: false
---

La versión anterior de paigar.es tenía animaciones complejas ligadas al scroll: secciones que rotaban, imágenes que aparecían desde los laterales, textos que se revelaban progresivamente. Todo eso sin GSAP, sin ScrollMagic, sin ninguna librería de animación. Solo CSS y una línea de JavaScript.

La técnica se basa en un truco elegante: usar una animación CSS pausada, y controlar en qué fotograma se encuentra usando `animation-delay` con un valor negativo calculado a partir del scroll.

## La idea central

El único JavaScript necesario es actualizar una variable CSS con la posición de scroll:

```javascript
window.addEventListener("scroll", () => {
  requestAnimationFrame(() => {
    document.body.style.setProperty(
      "--recorrido",
      window.pageYOffset
    );
  });
}, { passive: true });
```

Eso es todo el JavaScript. Una variable CSS (`--recorrido`) que contiene los píxeles recorridos. El resto es CSS puro.

## La clase mágica

El núcleo del sistema es una clase `.animado` que convierte cualquier animación CSS en una animación controlada por scroll:

```css
.animado {
  animation: var(--nombreanimacion) 1s linear forwards;
  animation-play-state: paused;
  animation-delay: calc(
    ((var(--recorrido, 0) - var(--posinicio, 0)) / var(--altura, 1)) * -1s
  );
  animation-fill-mode: both;
}
```

Vamos a descomponer esta fórmula:

- `--recorrido` — la posición de scroll actual (viene del JS)
- `--posinicio` — el punto de scroll donde empieza la animación de este elemento
- `--altura` — la distancia en píxeles durante la que se desarrolla la animación
- El resultado se multiplica por `-1s` para convertirlo en un delay negativo

## ¿Por qué funciona?

El truco está en cómo los navegadores interpretan `animation-delay` con valores negativos. Cuando una animación tiene un delay de `-0.5s` y dura `1s`, el navegador la renderiza como si llevase medio segundo reproduciéndose. Pero como `animation-play-state` está en `paused`, no avanza: se queda congelada en ese punto exacto.

Al cambiar el valor de `--recorrido` con el scroll, el `animation-delay` se recalcula automáticamente (gracias a las custom properties), y el navegador renderiza el fotograma correspondiente. El efecto es una animación que avanza y retrocede siguiendo el scroll.

## Configurar cada elemento

Cada elemento animado necesita tres cosas:

1. **La animación** — un `@keyframes` que defina el movimiento
2. **El punto de inicio** — `--posinicio` establecido en el HTML o CSS
3. **La duración** — `--altura` que define cuántos píxeles de scroll dura

```css
@keyframes rotar {
  from { transform: rotate(0deg); }
  to { transform: rotate(45deg); }
}

#cabecera .intro {
  --nombreanimacion: rotar;
}
```

Y en el HTML o con JavaScript, se establecen las variables de posición:

```javascript
// Calcular las alturas de cada sección
document.body.style.setProperty(
  "--alturaCabecera",
  document.getElementById("cabecera").offsetHeight
);
```

## Las ventajas

**Rendimiento**: no hay cálculos de transformación en JavaScript. Todo lo hace el motor de renderizado CSS, que está optimizado para eso. El JS solo escribe una variable numérica en cada frame.

**Composición**: puedes combinar múltiples animaciones en el mismo elemento. Un elemento puede rotar, cambiar de opacidad y moverse, todo controlado por el mismo scroll.

**Reversibilidad**: como el cálculo es bidireccional, hacer scroll hacia arriba revierte la animación naturalmente. No necesitas código adicional.

**Mantenibilidad**: las animaciones se definen en CSS, donde pertenecen. Si quieres cambiar un movimiento, editas un `@keyframes`. El JavaScript no cambia nunca.

## Las limitaciones

No es perfecto. El cálculo asume un scroll vertical lineal, así que no funciona bien con scroll horizontal o con contenedores con scroll propio. Las variables de posición (`--posinicio`, `--altura`) hay que calcularlas una vez al cargar y actualizar en el resize, lo que añade algo de complejidad.

Y si el contenido es dinámico y cambia de altura después de cargar, las posiciones se descuadran. Para una web estática donde tú controlas el contenido, funciona a la perfección.

## El futuro: CSS Scroll-Driven Animations

La especificación CSS ahora incluye `animation-timeline: scroll()`, que hace lo mismo de forma nativa, sin JavaScript:

```css
@keyframes revelar {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.elemento {
  animation: revelar linear both;
  animation-timeline: scroll();
  animation-range: entry 0% entry 100%;
}
```

Todavía no tiene soporte universal, pero cuando lo tenga, el JavaScript desaparecerá por completo. Hasta entonces, la técnica del `animation-delay` negativo sigue siendo la más fiable y ligera.
