---
title: "Accesibilidad web: el mínimo que todo desarrollador debería cumplir"
description: "No hace falta ser experto en WCAG para hacer webs accesibles. Estas son las prácticas básicas que marcan la diferencia y que no tienen excusa para no implementarse."
date: 2025-06-28
tags:
  - accesibilidad
  - html
  - técnicas
destacado: false
---

La accesibilidad web tiene fama de ser complicada. Y a cierto nivel, lo es — las pautas WCAG son extensas y los edge cases son infinitos. Pero el 80% del impacto viene del 20% del esfuerzo. Hay un mínimo viable de accesibilidad que cualquier desarrollador puede implementar sin ser experto en la materia.

## HTML semántico: la base de todo

La forma más efectiva de hacer una web accesible es usar las etiquetas HTML correctas. No es un consejo sofisticado, pero es el que más se ignora:

```html
<!-- Mal -->
<div class="boton" onclick="enviar()">Enviar</div>

<!-- Bien -->
<button type="submit">Enviar</button>
```

El `<button>` es focusable por teclado, activable con Enter y Space, anunciado como "botón" por los lectores de pantalla, y gestiona correctamente los estados `:focus` y `:active`. El `<div>` no hace nada de eso — tendrías que reimplementarlo todo con JavaScript y ARIA.

Lo mismo aplica para:
- `<nav>` en vez de `<div class="nav">`
- `<main>` en vez de `<div class="contenido">`
- `<header>` y `<footer>` en vez de divs genéricos
- `<h1>`-`<h6>` en orden jerárquico, sin saltar niveles
- `<a>` para navegación, `<button>` para acciones

## Contraste de color

Las WCAG piden un ratio de contraste mínimo de **4.5:1 para texto normal** y **3:1 para texto grande** (18px+ o 14px+ en negrita). Es una regla simple con herramientas simples para verificarla.

En las DevTools de Chrome y Firefox, al inspeccionar un color de texto, te muestra el ratio de contraste directamente. Si está por debajo del mínimo, cámbialo.

Los errores más comunes:
- Texto gris claro sobre fondo blanco (esos grises "elegantes" de `#999` o `#aaa` que no pasan el mínimo)
- Texto sobre imágenes sin overlay oscuro
- Placeholders de formulario demasiado claros (los placeholders también necesitan contraste)

## Textos alternativos en imágenes

Toda imagen con contenido informativo necesita un `alt` descriptivo:

```html
<!-- Decorativa: alt vacío -->
<img src="ornamento.svg" alt="">

<!-- Informativa: descripción del contenido -->
<img src="grafico-ventas.png" alt="Gráfico de ventas trimestrales mostrando un crecimiento del 15%">
```

Un `alt` vacío (`alt=""`) le dice al lector de pantalla "ignora esta imagen". Omitir el atributo `alt` completamente hace que el lector de pantalla lea el nombre del fichero, que suele ser algo como "IMG_20240315_142356.jpg". Eso no ayuda a nadie.

## Navegación por teclado

Toda funcionalidad de la web debe ser accesible con teclado. Esto significa:

- **Tab** navega entre elementos interactivos
- **Enter/Space** activa botones y enlaces
- **Escape** cierra modales y menús
- El **foco** es visible en todo momento

El error más dañino es eliminar el outline del foco:

```css
/* NUNCA hagas esto sin proporcionar una alternativa */
*:focus { outline: none; }
```

Si el outline por defecto te parece feo, reemplázalo con uno mejor, pero no lo elimines:

```css
:focus-visible {
  outline: 2px solid var(--color-acento);
  outline-offset: 2px;
}
```

`:focus-visible` es mejor que `:focus` porque solo se activa con navegación por teclado, no con clics de ratón. Así mantienes la indicación visual para quien la necesita sin molestar a quien usa ratón.

## Skip to content

Un enlace oculto al principio del documento que permite a los usuarios de teclado saltar directamente al contenido principal, sin tener que tabular por toda la navegación:

```html
<body>
  <a href="#contenido" class="skip-link">Saltar al contenido principal</a>
  <header>...</header>
  <main id="contenido">...</main>
</body>
```

```css
.skip-link {
  position: absolute;
  left: -9999px;
}
.skip-link:focus {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  /* estilos visibles */
}
```

Es una de las técnicas más simples de implementar y de las más apreciadas por usuarios de teclado y lectores de pantalla.

## Formularios con labels

Cada campo de formulario necesita un `<label>` asociado:

```html
<label for="email">Tu email</label>
<input type="email" id="email" name="email">
```

No un placeholder como sustituto del label. No un div con texto al lado. Un `<label>` con `for` apuntando al `id` del input. Es la forma en que los lectores de pantalla saben qué pedir al usuario.

## Tamaño de áreas táctiles

En móvil, los elementos interactivos deben tener al menos **44x44 píxeles** de área de toque. Un enlace de texto pequeño en una lista puede ser difícil de pulsar para personas con motricidad reducida — o para cualquiera en un autobús en movimiento.

```css
.nav__link {
  padding: 0.75em 1em;
  min-height: 44px;
  display: flex;
  align-items: center;
}
```

## No es difícil, es hábito

Ninguna de estas prácticas es técnicamente compleja. No requieren librerías, plugins ni conocimientos especializados. Son decisiones de implementación que cualquier desarrollador puede tomar si es consciente de ellas.

La accesibilidad no es un feature que se añade al final del proyecto. Es una forma de escribir código desde el principio. Y como toda buena práctica, se convierte en automática con el tiempo.
