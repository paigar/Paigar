---
title: "La deuda técnica en proyectos pequeños"
description: "La deuda técnica no es exclusiva de grandes empresas. En proyectos pequeños, sus efectos son incluso más devastadores porque no hay equipo para absorberla."
date: 2025-10-30
tags:
  - opinión
  - oficio
destacado: false
---

Cuando se habla de deuda técnica, casi siempre se piensa en grandes empresas con bases de código enormes y equipos de cientos de desarrolladores. Facebook reescribiendo su interfaz. Twitter migrando de Ruby a Scala. Google refactorizando sus sistemas internos.

Pero la deuda técnica más dañina que he visto no está en las grandes empresas. Está en los proyectos pequeños — las webs de autónomos, las tiendas online de pequeños negocios, los portales de empresas locales. Proyectos que hizo un profesional hace tres años y que nadie ha tocado desde entonces.

## Cómo se acumula

En un proyecto grande, la deuda técnica se acumula por decisiones conscientes: "sabemos que esto no es ideal, pero lo hacemos así para llegar al deadline y lo arreglaremos después". Es deuda reconocida y, en teoría, gestionada.

En un proyecto pequeño, la deuda se acumula de forma diferente:

**Decisiones que parecían buenas en su momento**. Instalar ese plugin de WordPress que resolvía el problema del día. Usar ese snippet de Stack Overflow que funcionaba sin entenderlo del todo. Elegir esa versión de PHP porque era la que tenía el hosting.

**Mantenimiento que no se hace**. WordPress sin actualizar durante dos años. Plugins abandonados por sus desarrolladores. Certificados SSL que caducan porque nadie configuró la renovación automática.

**Documentación inexistente**. Nadie apuntó las credenciales del hosting. Nadie documentó cómo se despliega. Nadie explicó por qué ese fragmento de código personalizado está ahí.

**El profesional que desaparece**. El freelance que hizo la web ya no trabaja en esto. La agencia que la construyó cerró. El sobrino que sabía de informática se fue a estudiar fuera.

## Las consecuencias

En una empresa grande, la deuda técnica se traduce en menor velocidad de desarrollo. Molestos, pero la empresa puede absorberlo — tiene recursos para refactorizar, reescribir o migrar.

En un proyecto pequeño, la deuda técnica puede ser terminal. He visto negocios que tuvieron que tirar su web y empezar de cero porque:

- La web fue hackeada a través de un plugin desactualizado y la copia de seguridad tenía seis meses
- El hosting subió la versión de PHP y la web dejó de funcionar porque usaba funciones obsoletas
- El tema de WordPress ya no es compatible con la versión actual y no se puede actualizar sin romper todo
- Nadie tiene acceso al panel de administración porque las credenciales se perdieron

En cada uno de estos casos, el coste de resolver el problema superó el coste original de la web. El negocio se quedó sin presencia online durante semanas o meses. Y todo por deuda técnica que se podría haber evitado con decisiones diferentes desde el principio.

## Cómo la evito

**Minimizo las dependencias**. Cada dependencia es una fuente potencial de deuda. Un sitio con Eleventy, CSS puro y JavaScript vanilla tiene exactamente una dependencia técnica: Node.js. Compare eso con un WordPress con 20 plugins — 20 puntos de fallo potencial, 20 componentes que requieren actualización.

**Uso tecnología estable**. HTML no se deprecia. CSS no tiene breaking changes. JavaScript vanilla funciona igual que hace diez años. Eligiendo la plataforma web como base, apuesto por la tecnología más estable que existe.

**Documento todo**. Cada proyecto que entrego tiene un README con: cómo instalarlo, cómo desplegarlo, dónde están las credenciales (en un gestor de contraseñas, no en un Post-it), qué dependencias tiene y por qué están ahí.

**Simplifico la infraestructura**. Un sitio estático en un CDN no necesita mantenimiento de servidor. No hay PHP que actualizar, no hay MySQL que parchear, no hay WordPress que mantener. Es HTML en un disco — la infraestructura más simple y robusta que existe.

**Planifico el mantenimiento desde el inicio**. Cuando presupuesto un proyecto, incluyo el mantenimiento como parte del coste. No como un servicio opcional que el cliente puede declinar — como una parte integral del trabajo. Una web sin plan de mantenimiento es una web con fecha de caducidad.

## La deuda que no se ve

La deuda técnica más peligrosa es la que no se ve hasta que explota. Un sitio puede parecer que funciona perfectamente durante años mientras acumula vulnerabilidades de seguridad, incompatibilidades de versión y dependencias abandonadas.

El momento en que te das cuenta de la deuda siempre es el peor momento posible: cuando algo se rompe en producción, cuando un cliente necesita un cambio urgente, cuando Google marca tu sitio como inseguro.

La forma más barata de gestionar la deuda técnica en proyectos pequeños es no generarla. Y la forma de no generarla es construir con la menor complejidad posible desde el primer día.
