---
title: "Eleventy y Decap CMS: cuando el cliente quiere editar"
description: "Las ventajas y los problemas reales de usar un CMS headless con un generador estático. Qué pasa cuando un cliente sin perfil técnico gestiona su propio contenido."
date: 2025-12-22
tags:
  - eleventy
  - cms
  - clientes
destacado: false
---

Eleventy es mi herramienta favorita para construir sitios web. Pero tiene un problema: no tiene panel de administración. Para mí eso es una virtud. Para un cliente que quiere actualizar su web sin llamarme cada vez, es un obstáculo.

La solución que más se recomienda en la comunidad Eleventy es [Decap CMS](https://decapcms.org/) (antes Netlify CMS): un panel de administración que se conecta a un repositorio Git y genera ficheros Markdown. En teoría, el cliente edita en un formulario bonito, el CMS hace commit a Git, se dispara un build, y la web se actualiza. En la práctica, es más complicado.

## Lo bueno

Decap CMS resuelve el problema fundamental: el cliente no necesita saber qué es Git, ni Markdown, ni un terminal. Ve un formulario con campos, escribe, le da a "Publicar" y su contenido aparece en la web.

La configuración es un único fichero `config.yml` donde defines las colecciones (blog, páginas, etc.) y los campos de cada una. La integración con Eleventy es natural porque ambos trabajan con ficheros Markdown y frontmatter YAML.

```yaml
collections:
  - name: "blog"
    label: "Blog"
    folder: "content/blog/posts"
    create: true
    fields:
      - { label: "Título", name: "title", widget: "string" }
      - { label: "Fecha", name: "date", widget: "datetime" }
      - { label: "Contenido", name: "body", widget: "markdown" }
```

## Lo malo: los builds

Aquí es donde empiezan los problemas. Cada vez que el cliente guarda un borrador, Decap CMS hace un commit. Cada commit dispara un build en Netlify, Cloudflare Pages o el servicio que uses. Un cliente que escribe un artículo y guarda tres borradores antes de publicar ha generado cuatro builds.

Si el sitio es pequeño y el build dura segundos, no pasa nada. Pero he visto proyectos donde un cliente entusiasta generaba 30-40 builds al día porque guardaba cada párrafo. Con los límites de minutos de build que tienen los planes gratuitos de la mayoría de plataformas, eso se convierte en un problema real.

## Lo peor: el contenido roto

Un CMS headless no valida el resultado visual. El cliente puede:

- Pegar texto desde Word con formato oculto que rompe el Markdown
- Subir imágenes de 5MB sin optimizar
- Dejar campos obligatorios vacíos (Decap los valida, pero no siempre bien)
- Crear estructuras de encabezados incorrectas (un H4 después de un H2)
- Romper el build si introduce caracteres especiales en el título que afectan al slug

He tenido clientes que borran contenido pensando que estaban editando, y como Decap hace commit directamente, el contenido desaparece de la web. Sí, está en el historial de Git, pero explicarle a un cliente qué es un `git revert` no es una conversación productiva.

## La alternativa honesta

Después de varios proyectos con esta arquitectura, he llegado a una conclusión incómoda: **si el cliente necesita editar contenido frecuentemente, un generador estático probablemente no es la herramienta adecuada**.

No digo que no funcione nunca. Para un cliente que actualiza su blog una vez al mes y tiene un perfil mínimamente técnico, Decap CMS con Eleventy es una buena solución. Pero para un cliente que publica a diario, tiene varios editores, necesita previsualización en tiempo real y quiere un flujo de borrador-revisión-publicación, un CMS tradicional como WordPress (sí, he dicho WordPress) sigue siendo más apropiado.

## Cuándo sí funciona

La combinación Eleventy + Decap CMS funciona bien cuando:

- El contenido se actualiza con poca frecuencia (semanal o menos)
- Hay un solo editor o un equipo muy pequeño
- El editor entiende la estructura básica del contenido (título, cuerpo, fecha)
- Hay un desarrollador disponible para solucionar problemas ocasionales
- Los builds son rápidos (menos de un minuto)

En esos casos, las ventajas del stack estático (rendimiento, seguridad, coste cero de hosting) superan las incomodidades del CMS.

## Lo que hago ahora

Para proyectos donde el cliente necesita autonomía total, uso WordPress con un tema a medida. Para proyectos donde el contenido es mayoritariamente estático o lo gestiono yo, uso Eleventy sin CMS. Y para el terreno intermedio, valoro caso a caso y soy honesto con el cliente sobre lo que implica cada opción.

La peor decisión es elegir la herramienta que a ti te gusta en vez de la que el cliente necesita.
