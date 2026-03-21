---
title: "El selector :has() — el selector padre que CSS siempre necesitó"
description: "Casos prácticos del selector :has() de CSS: formularios reactivos, navegación contextual y layouts que responden al contenido. Sin JavaScript y con progressive enhancement."
date: 2026-01-14
tags:
  - css
  - técnicas
destacado: false
---

Durante años, la pregunta más repetida en cualquier foro de CSS era: "¿puedo seleccionar un elemento padre en función de sus hijos?". La respuesta siempre fue no. Podías ir hacia abajo (descendientes), hacia los lados (hermanos con `~` y `+`), pero nunca hacia arriba. El selector padre era el unicornio de CSS.

`:has()` cambia eso. Y no solo resuelve el caso del selector padre — es mucho más potente de lo que parece a primera vista.

## Qué es `:has()`

En su forma más simple, `:has()` selecciona un elemento que **contiene** algo:

```css
/* Selecciona los artículos que tienen una imagen */
article:has(img) {
  grid-template-columns: 1fr 1fr;
}

/* Selecciona los artículos que NO tienen imagen */
article:not(:has(img)) {
  grid-template-columns: 1fr;
}
```

Eso es el selector padre. Un `article` que contiene un `img` recibe un layout diferente. Antes necesitabas una clase extra en el HTML o JavaScript para conseguir esto.

Pero `:has()` acepta cualquier selector como argumento, incluyendo pseudo-clases, combinadores y selectores compuestos. Ahí es donde se pone interesante.

## Formularios reactivos sin JavaScript

El caso de uso que más me convence es hacer que los formularios respondan a su propio estado sin una sola línea de JavaScript.

### Mostrar ayuda cuando un campo tiene foco

```css
.campo:has(input:focus) .ayuda {
  display: block;
}
```

Cuando el `input` dentro de `.campo` tiene foco, el texto de ayuda se muestra. Sin eventos `focus`/`blur` en JS, sin toggle de clases.

### Resaltar campos inválidos con contexto

```css
.campo:has(input:invalid:not(:placeholder-shown)) {
  --borde-campo: var(--color-error);
}

.campo:has(input:invalid:not(:placeholder-shown)) .mensaje-error {
  display: block;
}
```

El truco de `:not(:placeholder-shown)` evita que el campo se marque como inválido antes de que el usuario escriba algo. `:has()` permite que el contenedor reaccione, no solo el input.

### Deshabilitar visualmente el botón de envío

```css
form:has(:invalid) button[type="submit"] {
  opacity: 0.5;
  pointer-events: none;
}
```

Si el formulario contiene algún campo inválido, el botón se atenúa. El formulario entero es consciente de su estado, sin necesidad de validación JavaScript para el feedback visual.

## Navegación contextual

Otro patrón útil: que la navegación sepa qué está pasando en la página.

```css
/* Si la página tiene un hero, la nav es transparente */
body:has(.hero) .nav-principal {
  background: transparent;
  position: absolute;
}

/* Si un menú desplegable está abierto, oscurecer el fondo */
body:has(.dropdown[open]) .overlay {
  opacity: 1;
  pointer-events: auto;
}
```

Antes, el patrón habitual era añadir clases al `body` con JavaScript (`body.has-hero`, `body.menu-open`). Con `:has()`, el CSS lo resuelve solo.

## Layouts que responden al contenido

Esto es lo que más me interesa para este mismo sitio. En vez de crear variantes con clases CSS, el layout se adapta a lo que contiene.

### Tarjetas con o sin imagen

```css
.tarjeta:has(img) {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1rem;
}

.tarjeta:not(:has(img)) {
  padding: 1.5rem;
}
```

### Grids que reaccionan a la cantidad de hijos

Combinando `:has()` con `:nth-child()` puedes crear grids que se reorganizan según cuántos elementos contienen:

```css
/* Si el grid tiene más de 3 hijos, usar 3 columnas */
.grid:has(:nth-child(4)) {
  grid-template-columns: repeat(3, 1fr);
}

/* Si tiene 2 o menos, usar 2 columnas */
.grid:not(:has(:nth-child(3))) {
  grid-template-columns: repeat(2, 1fr);
}
```

Sin JavaScript contando elementos, sin clases condicionales generadas desde el servidor.

## Seleccionar hermanos previos

Un efecto secundario inesperado de `:has()` es que habilita la selección de hermanos **anteriores**, algo que nunca fue posible en CSS:

```css
/* Resaltar todos los elementos de la lista anteriores al hover */
li:has(~ li:hover) {
  color: var(--color-acento);
}
```

Esto dice: "selecciona un `li` que tiene un hermano posterior (`~`) que está en hover". En otras palabras, selecciona los anteriores al elemento en hover. Perfecto para crear un sistema de valoración con estrellas, por ejemplo.

## Soporte en navegadores

`:has()` está soportado en todos los navegadores modernos desde finales de 2023:

- **Chrome / Edge**: desde la versión 105 (agosto 2022)
- **Safari**: desde la versión 15.4 (marzo 2022) — fue el primero en implementarlo
- **Firefox**: desde la versión 121 (diciembre 2023) — el último en llegar

A fecha de hoy, el soporte global supera el 96% de los usuarios según Can I Use. La única franja sin cobertura son versiones muy antiguas de navegadores que probablemente tampoco soporten otras características modernas que ya usamos con normalidad como `gap` en flexbox o `aspect-ratio`.

## Progressive enhancement: úsalo sin miedo

Hay una característica de `:has()` que lo convierte en candidato ideal para progressive enhancement: **cuando un navegador no lo entiende, simplemente ignora la regla**. No lanza errores, no rompe el resto del CSS. El selector no aplica y punto.

Esto significa que puedes usarlo como una **mejora visual** sobre un diseño base que funciona sin él:

```css
/* Base: funciona en todos los navegadores */
.tarjeta {
  padding: 1.5rem;
}

/* Mejora: solo se aplica si el navegador entiende :has() */
.tarjeta:has(img) {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1rem;
  padding: 0;
}
```

El diseño base muestra una tarjeta funcional y legible. Si el navegador soporta `:has()`, obtiene un layout mejorado con la imagen al lado. Si no, la imagen simplemente aparece encima del texto, dentro del flujo normal. Nada se rompe.

La clave es diseñar el caso base primero — el CSS que funciona sin `:has()` — y luego añadir las mejoras. No construyas layouts que *dependan* de `:has()` para ser usables. Úsalo para mejorar la experiencia, no para sostenerla.

En la práctica, con más del 96% de soporte, el porcentaje de usuarios que no se beneficiarán de tus reglas con `:has()` es mínimo, y esos usuarios seguirán viendo un sitio perfectamente funcional.

## Cuándo no usarlo

`:has()` no reemplaza JavaScript para lógica compleja. Si necesitas validación asíncrona, peticiones al servidor o transformaciones de datos, sigue usando JS. Lo que elimina son los casos donde JavaScript solo servía para **observar el DOM y aplicar clases CSS** — exactamente el tipo de código que siempre pareció que no debería ser necesario.

Tampoco es ideal para animaciones complejas basadas en el estado. Para eso, las custom properties con un pequeño script siguen siendo más explícitas y depurables.

## La regla que me aplico

Antes de añadir un `addEventListener` que solo hace `classList.toggle()`, pienso si `:has()` lo resuelve. La mayoría de las veces, sí. Y el resultado es CSS que se lee como una frase: *"si el formulario tiene un campo inválido, atenúa el botón"*. Sin intermediarios.
