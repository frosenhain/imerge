# Imerge Corporate Center — Administración de agenda

**Fecha:** 2026-08-28  
**Estado:** aprobado

## Objetivo

Permitir al equipo de Imerge administrar la agenda pública desde una URL independiente, con acceso por usuario y contraseña. Cada modificación debe reflejarse en la agenda de la home sin requerir un nuevo despliegue.

## Enfoque elegido

Usar **Vercel Blob** como almacenamiento compartido de una única agenda en formato JSON y rutas de servidor de Next.js para leerla y actualizarla. Es una solución adecuada para una agenda pequeña administrada por una persona y evita un proveedor de base de datos adicional.

## Experiencia de administración

- `/admin` muestra una pantalla de acceso con usuario y contraseña.
- Tras validar las credenciales, `/admin/agenda` muestra los eventos existentes y permite crear, editar, duplicar y eliminar.
- Cada evento incluye: fecha, horario, nombre, tipo, espacio, estado y descripción opcional.
- Al guardar se confirma el resultado y la agenda pública vuelve a solicitar los datos actualizados.
- El cierre de sesión borra la cookie de sesión segura.

## Seguridad y datos

- Las credenciales y la clave para firmar la sesión se definen como variables de entorno de Vercel, nunca dentro del código ni enviadas al navegador.
- La sesión se mantiene en una cookie `HttpOnly`, `Secure` en producción y `SameSite=Lax`.
- Las rutas que modifican eventos exigen una sesión válida. La ruta de lectura es pública y sólo expone la agenda.
- Vercel Blob conserva el JSON de agenda; si aún no existe, el sitio utiliza y devuelve los eventos de muestra actuales como estado inicial.

## Arquitectura

- `app/api/agenda/route.ts`: entrega los eventos públicos.
- `app/api/admin/login/route.ts` y `app/api/admin/logout/route.ts`: crean y eliminan sesiones.
- `app/api/admin/agenda/route.ts`: lectura y operaciones de creación, edición y eliminación autenticadas.
- `app/admin/page.tsx`: acceso.
- `app/admin/agenda/page.tsx`: interfaz CRUD.
- Un módulo común valida, ordena y persiste eventos para evitar duplicación entre rutas.
- La home consume la API pública, actualiza al recuperar el foco y continúa mostrando un estado de carga o un mensaje de contingencia si el servicio no está disponible.

## Errores y verificación

- Validar campos obligatorios, fechas y horarios antes de persistir.
- Mostrar errores de autenticación sin revelar cuál credencial falló.
- Si falla una escritura, mantener el formulario y explicar que no se guardó.
- Verificar el build de producción, el flujo de login, CRUD, cierre de sesión y la actualización de la home.
