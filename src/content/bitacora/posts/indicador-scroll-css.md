---
title: "Un indicador de scroll con CSS puro"
description: "Cómo crear una barra de progreso de lectura sin una sola línea de JavaScript, desde el truco clásico del gradiente diagonal hasta scroll-driven animations."
date: 2026-01-15
tags:
  - css
  - técnicas
destacado: false
---

Hay trucos CSS que cuando los ves por primera vez piensas: "esto no debería funcionar". El indicador de scroll que ideó [Mike Riethmuller](https://codepen.io/MadeByMike/pen/ezLYQL) es uno de ellos. Una barra de progreso de lectura que se llena conforme bajas por la página, sin JavaScript. Cero líneas.

## La técnica clásica: el gradiente diagonal

La idea original de Mike se basa en tres conceptos combinados:

1. **Un gradiente diagonal** aplicado al `body` con un corte duro al 50%
2. **Un cálculo de tamaño** que compensa la altura del viewport
3. **Una máscara fija** que oculta todo excepto una tira de 3 píxeles

### La geometría

Imagina un rectángulo con una línea diagonal:

```
+------------------+
|            /   B |   B = fondo (transparente)
|         /        |
|      /           |
|   /              |
| A                |   A = color de acento
+------------------+
```

Cuando el viewport se desplaza hacia abajo por este rectángulo, la intersección de la diagonal con el borde superior se mueve de izquierda a derecha. Si solo ves una franja fina en la parte de arriba, parece una barra de progreso.

### El CSS del gradiente

```css
body {
  background-image: linear-gradient(
    to right top,
    #f86624 50%,
    transparent 50%
  );
  background-size: 100% calc(100% - 100vh + 4rem + 3px + 1px);
  background-repeat: no-repeat;
}

body::after {
  content: "";
  position: fixed;
  top: calc(4rem + 3px);
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  z-index: -1;
}
```

La parte más ingeniosa es el `background-size`:

| Parte | Propósito |
|-------|-----------|
| `100%` | Altura total del documento |
| `- 100vh` | Restar un viewport, porque al llegar al final aún ves una pantalla |
| `+ 4rem` | Sumar la altura de la cabecera fija |
| `+ 3px` | Sumar la altura de la barra indicadora |
| `+ 1px` | Corrección para que llegue al 100% exacto |

Sin el `- 100vh`, el gradiente solo estaría a medio llenar al final de la página. La resta compensa que el viewport ocupa espacio.

El pseudo-elemento `::after` con `z-index: -1` actúa como máscara: queda entre el canvas del navegador (donde se pinta el fondo del body) y el contenido normal.

### La limitación

Esta técnica tiene un inconveniente importante. El gradiente se pinta en el canvas — la capa más baja del modelo de renderizado del navegador. Cualquier elemento con fondo propio (bloques de código, tarjetas, tablas) se pinta por encima. Cuando estos elementos cruzan la franja del indicador al hacer scroll, la tapan momentáneamente.

En páginas con mucho texto plano funciona bien. En páginas con muchos bloques de código, la barra desaparece durante tramos largos. Es geometría pura, y es brillante. Pero los contextos de apilamiento de CSS le ganan la batalla.

## La versión moderna: scroll-driven animations

Desde 2023, CSS tiene una API nativa para vincular animaciones al progreso de scroll: `animation-timeline: scroll()`. Esta alternativa resuelve el problema del z-index.

```css
body::before {
  content: "";
  position: fixed;
  top: 4rem;
  left: 0;
  width: 100%;
  height: 3px;
  background: #f86624;
  z-index: 99;
  transform-origin: left;
  scale: 0 1;
  animation: scroll-indicator linear forwards;
  animation-timeline: scroll();
}

@keyframes scroll-indicator {
  to { scale: 1 1; }
}
```

El indicador es un pseudo-elemento fijo con `z-index: 99`, por encima de todo el contenido. La animación `scale` va de 0 a 1 en el eje X, y `animation-timeline: scroll()` la vincula al progreso del scroll.

El inconveniente: el soporte de navegadores todavía no es completo. Chrome y Edge lo soportan bien desde 2023, pero Firefox y Safari van con retraso. Para un sitio donde el soporte universal importa, puede no ser suficiente.

## CSS vs JavaScript

Un listener de scroll en JavaScript ejecuta código en cada frame, necesita `requestAnimationFrame` para no bloquear el hilo principal, y falla si el usuario deshabilita scripts. Las versiones CSS:

- No ejecutan código en cada frame
- El navegador optimiza la animación internamente
- Funcionan sin JavaScript
- Son menos de 15 líneas

Cada enfoque tiene sus compromisos. El gradiente diagonal es universal pero tiene el problema del z-index. Las scroll-driven animations lo resuelven pero dependen de soporte moderno. Y JavaScript, aunque menos elegante, funciona en todas partes sin limitaciones visuales.

A veces la solución más elegante no es la más práctica. Pero merece la pena conocerla.

---

*La técnica del gradiente diagonal es de [Mike Riethmuller](https://codepen.io/MadeByMike/pen/ezLYQL). También la explica en detalle [CSS-Tricks](https://css-tricks.com/books/greatest-css-tricks/scroll-indicator/). La API de scroll-driven animations está documentada en [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline/scroll).*
