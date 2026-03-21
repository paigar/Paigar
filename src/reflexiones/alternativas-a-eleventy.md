---
title: "Cuando tu herramienta favorita cambia de rumbo"
description: "Eleventy se convierte en Build Awesome, y los que construimos con generadores estáticos por filosofía tenemos que plantearnos qué viene después."
date: 2026-03-06
tags:
  - opinión
  - herramientas
  - oficio
  - lume
destacado: true
---

El pasado 3 de marzo, Eleventy confirmó lo que muchos intuíamos desde que en septiembre de 2024 se anunciara su incorporación a Font Awesome: el generador de sitios estáticos que tantos hemos adoptado como herramienta de cabecera iba a dejar de llamarse 11ty para convertirse en Build Awesome.

Y por si el nombre no fuera suficientemente desafortunado por sí solo, la campaña de Kickstarter asociada al lanzamiento — que alcanzó su objetivo de financiación en un solo día — acaba de ser cancelada, alegando problemas de entrega de correo electrónico. No es el tipo de estabilidad que inspira confianza.

## El patrón conocido

Zach Leatherman, creador y mantenedor de Eleventy, ha insistido en que el proyecto sigue siendo código abierto, que la compatibilidad con el ecosistema actual está garantizada y que Build Awesome Pro no será un requisito para usar la herramienta. Le creo. Pero el patrón es conocido: Font Awesome siguió exactamente el mismo camino con Web Awesome (antes Shoelace), convirtiendo un proyecto comunitario en un producto freemium con capa de pago.

El argumento de que "la versión gratuita nunca desaparecerá" puede ser cierto, pero cambia inevitablemente la naturaleza del proyecto y sus prioridades. Cuando hay una versión de pago, los recursos de desarrollo se dirigen hacia las funcionalidades que justifican el precio. La versión gratuita se mantiene, pero deja de ser el foco.

Para quienes llevamos años en el nicho de los generadores estáticos precisamente porque nos alejaban de esa dinámica — porque 11ty era un proyecto de una sola persona, sin inversores, sin agenda comercial, con una comunidad que construía por placer — la transformación supone un punto de inflexión. No hace falta abandonar el barco hoy mismo, pero sí tiene sentido empezar a mirar el horizonte.

## Lo que busco en un generador estático

Antes de mirar alternativas, conviene definir el punto de partida. No todo el mundo necesita lo mismo.

Hugo es extraordinariamente rápido, pero su sistema de plantillas en Go tiene una curva de aprendizaje pronunciada y resulta árido para quienes venimos de Nunjucks o Liquid. Astro es potente y moderno, pero arrastra una complejidad y una orientación hacia el componente JavaScript que lo aleja bastante de la filosofía que muchos valoramos en 11ty: cero JavaScript en el cliente por defecto, sin magia, sin estructura impuesta.

Lo que busco es algo que comparta esa misma filosofía: un generador que salga del camino. Que no inyecte nada en mi HTML sin pedírselo. Que soporte múltiples lenguajes de plantillas. Que sea mantenido por una comunidad real — o al menos por una persona comprometida sin agenda corporativa. Y que tenga builds rápidos.

## Lume: el sucesor espiritual

Buscando alternativas me he encontrado con [Lume](https://lume.land/), y la impresión ha sido inmediata. Creado y mantenido por Óscar Otero, un desarrollador gallego, Lume es un generador de sitios estáticos construido sobre Deno que comparte con 11ty una cantidad notable de principios: soporte para múltiples lenguajes de plantillas, cero JavaScript en el cliente por defecto, estructura de proyecto libre, y una configuración en TypeScript que resulta familiar a cualquier usuario de Eleventy. Que sea un proyecto nacional, de un desarrollador independiente con una filosofía clara, también pesa en la balanza.

La gran diferencia respecto a un proyecto Node.js es que Deno elimina completamente la carpeta `node_modules`. Las dependencias se descargan y cachean automáticamente, lo que convierte el setup inicial en una experiencia notablemente más limpia. Quienes hayan sufrido alguna vez la gestión de dependencias en un proyecto Node grande entenderán lo que esto significa en términos de mantenimiento a largo plazo. Y Deno es compatible con los paquetes npm, así que la transición no implica renunciar al ecosistema existente.

En cuanto a migración, el salto desde Eleventy parece más sencillo que a cualquier otro generador. Los conceptos de layouts, includes, data files y colecciones funcionan de manera análoga. Incluso Nunjucks funciona de fábrica como lenguaje de plantillas, lo que puede facilitar mucho la migración de proyectos existentes. El proyecto lleva activo desde 2020, tiene una versión 3 estable y madura, y su repositorio en GitHub muestra commits regulares.

La comunidad de Lume es todavía pequeña comparada con la de Eleventy o Hugo. La documentación es buena pero no tan exhaustiva, y las búsquedas de soluciones a problemas específicos podrían ser menos fructíferas. Pero eso, lejos de ser un freno, es lo que hace interesante el momento: un proyecto joven donde todavía puedes formar parte de su crecimiento, contribuir con documentación, reportar problemas y sentir que tu aportación importa. Es exactamente el tipo de comunidad que muchos echamos de menos en proyectos que ya han crecido demasiado.

## La decisión

No es que Eleventy haya dejado de funcionar. Es que la promesa original — un proyecto pequeño, independiente, sin compromisos comerciales — ya no está sobre la mesa. Y si una de las razones por las que uso generadores estáticos es mantener la independencia de mi stack, tiene sentido que la herramienta que lo sostiene sea también independiente.

Después de escribir esto me ha surgido la tentación de probar Lume. Y creo que tiene sentido hacerlo con mi propio sitio — un proyecto pequeño, controlado, donde puedo permitirme romper cosas y aprender por el camino. Si funciona, migro. Si no, Eleventy sigue ahí. Pero al menos habré explorado el terreno.
