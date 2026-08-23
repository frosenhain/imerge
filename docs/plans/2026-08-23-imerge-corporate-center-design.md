# Imerge Corporate Center — Diseño del sitio

**Fecha:** 2026-08-23  
**Estado:** aprobado

## Objetivo

Crear una experiencia web premium para Imerge Corporate Center, un salón multieventos de Guatemala con múltiples espacios y tecnología inmersiva. El sitio debe inspirar, exhibir los espacios, presentar una agenda y facilitar consultas de disponibilidad por WhatsApp y correo electrónico.

## Dirección elegida

**Inmersión corporativa.** Una landing cinematográfica y contemporánea, inspirada en el video de referencia: superficies oscuras, luces escultóricas cálidas, acentos eléctricos y movimiento sutil. La tecnología forma parte de la propuesta de valor, no solamente de la decoración.

## Experiencia

1. **Portada:** imagen del venue como fondo, titular “Eventos que se sienten antes de empezar” y llamada a la acción para consultar disponibilidad.
2. **Espacios:** tarjetas visuales para descubrir cada ambiente y su carácter.
3. **Tecnología:** bloque que comunica pantallas, producción, conectividad y capacidad de transformación.
4. **Agenda:** calendario mock editable que muestra próximos eventos, horarios, formato y espacio asignado. No depende de un backend en esta primera entrega.
5. **Disponibilidad:** formulario con fecha, tipo de evento, cantidad de asistentes y mensaje. Genera un enlace de WhatsApp y un correo con la consulta precompletada.

## Arquitectura

- Aplicación Next.js existente, reconvertida en una landing de una página.
- Contenido del venue y agenda mock en datos locales tipados para que su edición sea directa y segura.
- Interacciones del calendario, modal/formulario y enlaces de contacto en el cliente.
- Activos derivados del video de referencia para representar auténticamente el salón.

## Componentes principales

- Navegación fija con enlaces de sección.
- Hero inmersivo con CTA.
- Galería de espacios.
- Banda de capacidades tecnológicas.
- Agenda interactiva con filtros y detalle de evento.
- Formulario de consulta y dos salidas: WhatsApp y email.
- Pie de página con datos de contacto de ejemplo claramente identificados para reemplazar.

## Manejo de estados y errores

- Validación en cliente para los campos mínimos del formulario.
- Mensajes claros si falta información antes de abrir un canal de contacto.
- Estado vacío previsto para agenda sin eventos.
- Datos mock y contactos señalados para edición posterior; no se pretende confirmar disponibilidad real en esta versión.

## Verificación

- Revisión de diseño en desktop y móvil.
- Prueba de filtros de agenda y estado vacío.
- Prueba de validación y contenido precompletado en enlaces de WhatsApp/correo.
- Build de producción con `npm.cmd run build`.
