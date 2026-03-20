---
title: "CSS custom properties vs variables Sass: por qué ya no necesito un preprocesador"
description: "Las custom properties de CSS hacen innecesario Sass para la mayoría de proyectos. Comparación práctica con ejemplos de lo que puedes hacer con CSS nativo que antes requería un preprocesador."
date: 2025-05-20
tags:
  - css
  - técnicas
destacado: false
---

Usé Sass durante años. Era imprescindible: variables, nesting, mixins, funciones. CSS por sí solo era limitado y repetitivo. Sass lo hacía manejable.

Pero CSS ha cambiado. Y la pregunta que me hago ahora no es "¿qué preprocesador uso?" sino "¿necesito un preprocesador?". La respuesta, para la mayoría de mis proyectos, es no.

## Lo que Sass resolvía

Las razones principales por las que usábamos Sass eran:

1. **Variables** — para no repetir valores de colores, tamaños, fuentes
2. **Nesting** — para evitar selectores largos
3. **Mixins** — para reutilizar bloques de declaraciones
4. **Funciones** — para cálculos y transformaciones de color
5. **Partials e imports** — para organizar el código en ficheros

Veamos qué ha pasado con cada una.

## Variables: custom properties ganan

```scss
// Sass
$color-acento: #f86624;
.boton { background: $color-acento; }
```

```css
/* CSS */
:root { --color-acento: #f86624; }
.boton { background: var(--color-acento); }
```

Hasta aquí parecen equivalentes. Pero las custom properties hacen algo que Sass no puede: **cambiar en tiempo de ejecución**. Un cambio de tema, un hover, una media query — las custom properties se recalculan en el navegador. Las variables Sass se resuelven en el build y desaparecen del CSS final.

```css
/* Esto es imposible con Sass */
[data-theme="dark"] {
  --color-fondo: #111118;
}
```

Con Sass tendrías que duplicar todos los selectores que usan ese color. Con custom properties, cambias la variable y todo se actualiza automáticamente.

## Nesting: CSS lo tiene (casi)

CSS Nesting ya está disponible en los navegadores modernos:

```css
.tarjeta {
  padding: 1rem;

  & .titulo {
    font-weight: 700;
  }

  &:hover {
    border-color: var(--color-acento);
  }
}
```

La sintaxis es ligeramente diferente (necesitas el `&` en más casos), pero funciona. Para proyectos que no necesitan soportar navegadores antiguos, el nesting nativo es suficiente.

Dicho esto, yo uso poco el nesting — prefiero selectores planos por claridad. Pero si era tu razón principal para usar Sass, ya no lo es.

## Mixins: no los echo de menos

Los mixins más comunes eran para vendor prefixes y patrones repetitivos. Los vendor prefixes ya no son necesarios para la mayoría de propiedades. Y los patrones repetitivos se resuelven mejor con custom properties:

```css
/* En vez de un mixin de Sass para botones... */
.boton {
  padding: var(--boton-padding, 0.5em 1em);
  border-radius: var(--boton-radius, 0.25em);
  background: var(--boton-bg, var(--color-acento));
  color: var(--boton-color, white);
}

/* Variantes cambiando las variables */
.boton--grande {
  --boton-padding: 0.75em 1.5em;
  --boton-radius: 0.5em;
}
```

Más flexible que un mixin porque las variantes se pueden definir en cualquier contexto — incluso desde el HTML con `style`.

## Funciones: CSS tiene calc(), clamp() y color-mix()

Sass ofrecía `darken()`, `lighten()`, `mix()`. CSS ahora tiene `color-mix()`:

```css
.overlay {
  background: color-mix(in srgb, var(--color-acento) 15%, transparent);
}
```

Para cálculos numéricos, `calc()` y `clamp()` cubren todo lo que necesitas:

```css
.grid {
  gap: calc(var(--space-base) * 2);
  font-size: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
}
```

## Organización: la única ventaja real de Sass

El único punto donde Sass sigue aportando algo es la organización en parciales con `@use` y `@forward`. CSS tiene `@import`, pero carga cada fichero como una petición HTTP separada, lo que es malo para el rendimiento.

Mi solución es diferente: uso `eleventy-plugin-bundle` para concatenar los ficheros CSS en build. Cada fichero CSS se incluye en orden en el layout base, y el plugin los une en un único bloque inline. La organización es por ficheros, la salida es un único bloque — lo mejor de ambos mundos sin Sass.

## El build step que desaparece

Esta es la ventaja más subestimada de abandonar Sass: **no necesitas compilar tu CSS**. No hay `sass --watch`, no hay plugin de Webpack, no hay dependencia de `node-sass` o `dart-sass` que se rompe al actualizar Node.

Abres un fichero CSS, lo editas, el navegador lo interpreta. Así de simple. Así debería ser.
