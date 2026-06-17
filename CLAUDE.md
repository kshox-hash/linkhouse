# runtimeGenerateUi — Contexto del proyecto

## Stack
- **Backend:** Node.js + TypeScript + Express 5 + PostgreSQL (Render)
- **Frontend:** Flutter (app móvil)
- **Auth:** JWT + Google OAuth (Passport)
- **Pagos:** MercadoPago (marketplace OAuth + webhooks HMAC-SHA256)
- **Otros:** Nodemailer, PDFKit, Zod, Helmet, express-rate-limit

## Módulos del backend

| Módulo | Carpeta | Estado |
|--------|---------|--------|
| Estadísticas y reseñas | `src/modules/stadistics/` | ✅ |
| Calendario + reservas + pagos MP | `src/modules/appointments/` + `src/modules/calendar/` | ✅ |
| Webhook MercadoPago (HMAC-SHA256) | `src/modules/webhook/` | ✅ |
| MP OAuth connect | `src/modules/mp-connect/` | ✅ |
| Cotizaciones (PDF + email) | `src/modules/quotes/` | ✅ |
| Notificaciones push | `src/modules/notifications/` | ✅ |
| Perfil de empresa | `src/modules/profiles/` | ✅ |
| Portal público (chat, servicios, reservas) | `src/modules/menus/public-portal/` | ✅ |
| Chat con IA | `src/modules/chat/` | ✅ |
| Clientes (CRM básico) | `src/modules/clients/` | ✅ |
| Servicios | `src/modules/services/` | ✅ |
| Bloques | `src/modules/blocks/` | ✅ |
| Slugs públicos | `src/modules/slug/` | ✅ |
| Recordatorios (cron) | `src/modules/reminders/` | ✅ |
| Admin | `src/modules/admin/` | ✅ |
| WhatsApp | `src/whatsapp/` | ✅ |
| Login email/password + Google OAuth | `src/login/` | ✅ |

## Seguridad implementada
- Auth JWT en todos los endpoints privados (`authMiddleware`)
- IDOR check (JWT userId vs params userId) en todos los módulos
- Ownership check en mutations de DB (user_id en WHERE de UPDATE/DELETE)
- CORS con allowlist via `CORS_ORIGIN`
- Helmet + rate limiting en `/auth` (20 req/15min)
- Verificación HMAC-SHA256 en webhook MercadoPago
- Credenciales DB solo desde env vars
- Graceful shutdown (SIGTERM/SIGINT)
- Health check en `GET /health`

## Variables de entorno requeridas
```
# Auth
JWT_SECRET=

# Base de datos (Render PostgreSQL)
PGHOST=
PGUSER=
PGPASSWORD=
PGDATABASE=
PGPORT=5432

# CORS (separar múltiples orígenes con coma)
CORS_ORIGIN=https://tudominio.com

# URLs
PUBLIC_BASE_URL=https://tudominio.com

# MercadoPago — cuenta global de la plataforma
ACCESS_TOKEN_MP=
MP_WEBHOOK_SECRET=

# MercadoPago — OAuth marketplace (para conectar cuentas de negocios)
MP_APP_ID=
MP_APP_SECRET=
MP_REDIRECT_URI=https://tudominio.com/auth/mp/callback

# Notificaciones
BUSINESS_NOTIFICATION_EMAIL=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=

# App móvil
APP_DEEPLINK_URL=automatiza://auth
```

## Nota técnica importante
`@types/express` v5.0.6 cambió `ParamsDictionary` a `{ [key: string]: string | string[] }`.
En controllers usar `String(req.params["paramName"])` — NO `req.params.paramName` directo.
