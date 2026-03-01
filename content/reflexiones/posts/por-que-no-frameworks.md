---
title: "Por qué elijo no usar frameworks"
description: "No es nostalgia ni desconocimiento. Es una decisión técnica fundamentada. Razones concretas por las que prefiero HTML, CSS y JavaScript vanilla para la mayoría de proyectos."
date: 2026-02-14
tags:
  - opinión
  - técnicas
  - oficio
destacado: false
---

Cada vez que menciono que no uso React, ni Vue, ni Tailwind, ni ningún framework JavaScript o CSS para mis proyectos web, la reacción es predecible: sorpresa, seguida de alguna variante de "¿pero por qué?".

La respuesta corta: porque no los necesito. La respuesta larga es más matizada.

## Lo que construyo

Mis proyectos son webs de contenido: blogs, sitios corporativos, portfolios, documentación. Son documentos, no aplicaciones. La interactividad se limita a menús, toggles de tema, formularios de contacto y alguna animación. No hay estado compartido entre componentes. No hay rutas client-side. No hay renderizado condicional complejo.

Para esto, HTML semántico + CSS moderno + JavaScript vanilla es el stack más eficiente que existe. Cualquier framework que añada encima aporta complejidad sin aportar funcionalidad.

## La ilusión de la productividad

El argumento más frecuente a favor de los frameworks es la productividad: "con Tailwind escribo CSS más rápido", "con React no tengo que pensar en el DOM". Y es cierto — para ciertos tipos de proyectos y para desarrolladores que trabajan exclusivamente con esas herramientas.

Pero la productividad tiene que medirse en el ciclo de vida completo del proyecto, no solo en la primera semana:

**Tailwind** te permite escribir estilos rápido, pero tu HTML se convierte en una sopa de clases de utilidad que nadie puede leer seis meses después. Y cuando necesitas algo que Tailwind no cubre (que pasa más de lo que parece), tienes que pelear con la especificidad y la cascada igualmente.

**React** te da componentes reutilizables, pero para una web de contenido estás renderizando HTML en el cliente con JavaScript — algo que el servidor (o un generador estático) ya podría haber hecho sin coste para el usuario. Y la cadena de dependencias (React, React DOM, un router, un state manager, un bundler) es un ecosistema que hay que actualizar y mantener.

El CSS que yo escribo para un proyecto es menos código que la configuración de Tailwind. El JavaScript que escribo es menos código que los imports de React. Y en ambos casos, lo que escribo no tiene fecha de caducidad.

## La deuda técnica de las dependencias

Cada dependencia que añades a un proyecto es una promesa: "este código ajeno va a seguir funcionando en el futuro". Es una promesa que a menudo se rompe.

He visto proyectos atrapados en versiones antiguas de Angular que requerían reescrituras completas para actualizar. Proyectos en Vue 2 que tuvieron que migrar a Vue 3 con una API completamente diferente. Proyectos con Webpack que nadie sabía configurar cuando algo fallaba.

¿Mi CSS vanilla? Funciona exactamente igual que cuando lo escribí hace cinco años. Las custom properties que definí en 2020 siguen siendo válidas en 2026 y lo serán en 2030. El JavaScript que escribí para un menú hamburguesa en 2021 sigue funcionando sin cambiar una coma.

La plataforma web es el framework más estable que existe. HTML, CSS y JavaScript no se deprecian. No cambian de versión mayor con breaking changes. No necesitan migración.

## "Pero no escala"

Otro argumento frecuente. Y es legítimo — para proyectos que realmente escalan. Si tienes un equipo de veinte desarrolladores trabajando en la misma interfaz, un framework con convenciones claras ayuda a la coordinación.

Pero mis proyectos no tienen veinte desarrolladores. Tienen uno: yo. Y en la mayoría de casos, el mantenimiento futuro lo haré yo o alguien con un perfil similar. No necesito convenciones impuestas por un framework porque tengo las mías propias. No necesito un sistema de componentes porque mis partials de Nunjucks hacen lo mismo sin dependencias.

La escala que necesito no es técnica. Es temporal: que el proyecto siga funcionando dentro de cinco años sin que nadie lo toque.

## Lo que no estoy diciendo

No estoy diciendo que los frameworks sean malos. React es una herramienta extraordinaria para lo que fue diseñada. Tailwind resuelve problemas reales en equipos grandes. Vue, Svelte, Astro — todos tienen su lugar.

Lo que estoy diciendo es que ese lugar no es "todos los proyectos". Y que la presión social del ecosistema JavaScript — donde parece que si no usas el framework de moda estás haciendo algo mal — nos ha hecho perder de vista la opción más simple: escribir HTML, CSS y JavaScript directamente.

No es nostalgia. No es desconocimiento. He usado React. He usado Vue. He usado Tailwind. Y he decidido, con conocimiento de causa, que para lo que yo hago, la plataforma web nativa es la mejor opción.
