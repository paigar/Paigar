---
title: "Nunjucks como motor de plantillas: lo bueno y lo mejorable"
description: "Mi experiencia usando Nunjucks con Eleventy tras varios años y varios proyectos. Qué me gusta, qué me frustra y qué alternativas he considerado."
date: 2025-09-15
tags:
  - eleventy
  - nunjucks
  - herramientas
destacado: false
---
{% raw %}
Nunjucks es el motor de plantillas que uso en todos mis proyectos con Eleventy. Lo elegí porque es potente, tiene una sintaxis clara y la herencia de layouts funciona exactamente como esperas. Después de varios años usándolo, tengo una opinión matizada: es muy bueno, pero no es perfecto.

## Lo que me gusta

### Herencia de layouts

La característica estrella. Defines un layout base y los demás lo extienden:

```html
{# base.njk #}
<!DOCTYPE html>
<html>
  <head>...</head>
  <body>
    {{ content | safe }}
  </body>
</html>

{# post.njk — extiende base #}
---
layout: layouts/base.njk
---
<article class="post">
  <h1>{{ title }}</h1>
  {{ content | safe }}
</article>
```

Es limpio, predecible y fácil de seguir. Cada layout sabe qué hereda y qué añade.

### Includes y partials

Los parciales de Nunjucks son la forma más natural de componentizar HTML sin JavaScript:

```html
{% include 'partials/cabecera.njk' %}
{% include 'partials/pie.njk' %}
```

No hay props, no hay estado, no hay ciclo de vida. Es solo insertar HTML. Para una web estática, es todo lo que necesitas.

### Filtros

Los filtros son funciones que transforman datos en la plantilla. Eleventy permite definirlos en la configuración y usarlos en Nunjucks:

```html
<time>{{ date | readableDate }}</time>
<p>{{ content | intro(100) }}</p>
```

Son compositivos — puedes encadenarlos — y mantienen la lógica de presentación separada de los datos. Es el patrón correcto.

### Loops y condicionales

La sintaxis para iterar y condicionar es directa:

```html
{%- for post in collections.bitacora %}
  {% if post.data.destacado %}
    {% include 'partials/postcard.njk' %}
  {% endif %}
{%- endfor %}
```

Sin sorpresas, sin edge cases raros. Hace lo que parece que hace.

## Lo que me frustra

### Errores crípticos

Cuando algo falla en una plantilla Nunjucks, los mensajes de error son a menudo inútiles. Un paréntesis mal cerrado o una variable inexistente te dan un error genérico que apunta a la línea equivocada. Depurar una plantilla compleja a veces se convierte en un proceso de eliminación: vas comentando bloques hasta que encuentras el que falla.

### No hay tipado

Nunjucks no sabe qué propiedades tiene un objeto hasta el runtime. Si escribes `{{ post.tittle }}` (con doble T), no hay error — simplemente no renderiza nada. Te das cuenta cuando ves un hueco vacío en la web. TypeScript arruinó mi tolerancia a los errores en tiempo de ejecución.

### Sintaxis verbosa para lógica compleja

Cuando la lógica se complica, Nunjucks se vuelve difícil de leer:

```html
{%- set postsOrdenados = collections.bitacora | ordenarPorFecha | head(3) %}
{%- for post in postsOrdenados %}
  {%- if post.data.tags | filterTagList | length > 0 %}
    ...
  {%- endif %}
{%- endfor %}
```

No es terrible, pero cuando tienes tres niveles de anidación con filtros encadenados, echas de menos poder escribir lógica en un lenguaje de verdad.

### Whitespace control

Los `{%-` y `-%}` para controlar los espacios en blanco son necesarios pero molestos. Si no los usas, tu HTML generado tiene líneas vacías y sangrado irregular. Si los usas en todas partes, la plantilla se vuelve ruidosa.

## Lo que he considerado

**Liquid**: más limitado que Nunjucks, pero con mejor manejo de errores. Jekyll lo usa y la comunidad es enorme.

**WebC**: la propuesta nativa de Eleventy para componentes web. Interesante, pero todavía joven y con una curva de aprendizaje diferente.

**JSX/TSX con 11ty**: técnicamente posible, pero va contra la filosofía de mantener las plantillas simples y sin build step.

De momento me quedo con Nunjucks. Sus defectos son menores comparados con sus ventajas, y la familiaridad acumulada después de varios proyectos tiene un valor que no se puede subestimar. El mejor motor de plantillas es el que ya conoces, siempre que no te limite activamente.
{% endraw %}
