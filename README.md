# 🏛️ DenunciaCiudadana API

## 📋 ¿Qué hace el proyecto?

DenunciaCiudadana API es el backend de un sistema de gestión de denuncias ciudadanas. Proporciona una API RESTful que permite a los ciudadanos registrar denuncias sobre problemáticas urbanas (baches, alumbrado, residuos, etc.) y a las autoridades gestionar, dar seguimiento y resolver dichas denuncias. Incluye un sistema de chat bidireccional entre ciudadanos y autoridades para una comunicación directa y transparente sobre cada caso.

## 💡 ¿Por qué el proyecto es útil?

- **Transparencia gubernamental**: Ofrece un canal formal y trazable para que los ciudadanos reporten problemáticas en su comunidad y reciban respuestas oficiales.
- **Seguimiento en tiempo real**: Cada denuncia cuenta con un número de seguimiento único y un historial de estados que permite al ciudadano conocer el progreso de su caso.
- **Comunicación directa**: El chat bidireccional elimina la brecha de comunicación entre la ciudadanía y las autoridades, permitiendo aclaraciones, solicitudes de información adicional y notificaciones de resolución.
- **Gestión centralizada**: Las autoridades pueden administrar todas las denuncias desde un solo lugar, filtrar por estado, tipo y fecha, y generar estadísticas para la toma de decisiones.

## ✨ Características Principales

- **Autenticación y autorización**: Registro e inicio de sesión con JWT. Control de acceso basado en roles (Ciudadano / Autoridad).
- **Recuperación de contraseña**: Flujo completo de recuperación vía correo electrónico con tokens seguros.
- **Gestión de denuncias**: CRUD completo de reportes con número de seguimiento único, soporte para evidencia fotográfica (URL de imagen), ubicación (calle y número) y tipificación de denuncias.
- **Sistema de estados**: Flujo de estados configurable (Pendiente, En Proceso, Resuelta, Rechazada, etc.) con actualización exclusiva por parte de las autoridades.
- **Chat bidireccional**: Sistema de comentarios asociados a cada denuncia que permite la comunicación entre ciudadanos y autoridades, con diferenciación de respuestas oficiales.
- **Panel de administración**: Endpoint dedicado para que las autoridades consulten todas las denuncias con filtros, y endpoint de estadísticas para dashboards.
- **Notificaciones por email**: Envío de correos electrónicos a través de Nodemailer (recuperación de contraseña).
- **Validación de datos**: Validación robusta de todas las entradas con Zod.
- **Seguridad**: Protección con Helmet, CORS configurado y manejo centralizado de errores.
- **Testing**: Suite de tests con Vitest y Supertest.

## 🛠️ Tecnologías Utilizadas

| Tecnología | Uso |
|---|---|
| **Node.js** | Entorno de ejecución del servidor |
| **Express 5** | Framework web para la API REST |
| **TypeScript** | Tipado estático y seguridad en el código |
| **Prisma ORM** | Modelado de datos, migraciones y consultas a la base de datos |
| **PostgreSQL** | Base de datos relacional (alojada en Supabase) |
| **JSON Web Tokens (JWT)** | Autenticación basada en tokens |
| **bcryptjs** | Hashing seguro de contraseñas |
| **Zod** | Validación de esquemas y datos de entrada |
| **Nodemailer** | Envío de correos electrónicos |
| **Helmet** | Seguridad HTTP (cabeceras) |
| **Morgan** | Logging de peticiones HTTP |
| **Vitest + Supertest** | Testing unitario y de integración |
| **tsx** | Ejecución directa de TypeScript en desarrollo |

## 🚀 ¿Cómo empezar con el proyecto? (Instalación)

### Prerrequisitos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [npm](https://www.npmjs.com/) (incluido con Node.js)
- Una base de datos PostgreSQL (local o en la nube, ej: [Supabase](https://supabase.com/))

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Vera-Pablo/DenunciaCiudadanaAPI.git
   cd DenunciaCiudadanaAPI
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar las variables de entorno**
   
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```env
   PORT=3000
   DATABASE_URL=postgresql://usuario:contraseña@host:puerto/nombre_db

   # JWT
   JWT_SECRET=tu_secreto_super_seguro

   # URL del Frontend
   FRONTEND_URL=http://localhost:5173

   # Configuración de Email (para recuperación de contraseña)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=tu_email@gmail.com
   EMAIL_PASS=tu_contraseña_de_aplicacion
   ```

4. **Generar el cliente de Prisma y ejecutar las migraciones**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

5. **Poblar la base de datos con datos iniciales (seed)**
   ```bash
   npx prisma db seed
   ```

6. **Iniciar el servidor en modo desarrollo**
   ```bash
   npm run dev
   ```
   El servidor estará disponible en `http://localhost:3000`.

### Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor en modo desarrollo con hot-reload |
| `npm test` | Ejecuta la suite de tests con Vitest |
| `npm run test:watch` | Ejecuta los tests en modo watch |
| `npm run fresh` | Limpia la base de datos y ejecuta el seed nuevamente |
| `npm run clean` | Limpia todos los datos de la base de datos |

## 📁 Estructura Principal del Proyecto

```
DenunciaCiudadanaAPI/
├── prisma/
│   ├── migrations/        # Migraciones de la base de datos
│   ├── schema.prisma      # Modelo de datos (Role, User, Report, Comment, Status, Type)
│   ├── seed.ts            # Script de datos iniciales
│   └── clean.ts           # Script de limpieza de datos
├── src/
│   ├── __tests__/         # Tests unitarios y de integración
│   ├── config/
│   │   └── db.ts          # Configuración de Prisma con PostgreSQL (patrón Singleton)
│   ├── controllers/       # Controladores (manejan las peticiones HTTP)
│   │   ├── auth.controller.ts
│   │   ├── comment.controller.ts
│   │   ├── health.controller.ts
│   │   ├── report.controller.ts
│   │   ├── role.controller.ts
│   │   ├── status.controller.ts
│   │   ├── type.controller.ts
│   │   └── user.controller.ts
│   ├── middlewares/        # Middlewares de Express
│   │   ├── auth.middleware.ts     # Verificación de JWT
│   │   ├── role.middleware.ts     # Autorización por roles
│   │   └── errorHandler.ts       # Manejo centralizado de errores
│   ├── repositories/      # Capa de acceso a datos (consultas Prisma)
│   │   ├── comment.repository.ts
│   │   ├── report.repository.ts
│   │   ├── role.repository.ts
│   │   ├── status.repository.ts
│   │   ├── type.repository.ts
│   │   └── user.repository.ts
│   ├── routes/             # Definición de rutas de la API
│   │   ├── auth.routes.ts         # /api/v1/auth/*
│   │   ├── health.routes.ts       # /api/v1/health
│   │   ├── report.routes.ts       # /api/v1/reports/*
│   │   ├── role.routes.ts         # /api/v1/roles/*
│   │   ├── status.routes.ts       # /api/v1/statuses/*
│   │   ├── type.routes.ts         # /api/v1/types/*
│   │   └── user.routes.ts         # /api/v1/users/*
│   ├── schemas/            # Esquemas de validación con Zod
│   │   ├── auth.schema.ts
│   │   ├── comment.schema.ts
│   │   ├── common.schema.ts
│   │   ├── report.schema.ts
│   │   ├── role.schema.ts
│   │   ├── status.schema.ts
│   │   ├── type.schema.ts
│   │   └── user.schema.ts
│   ├── services/           # Lógica de negocio
│   │   ├── auth.service.ts
│   │   ├── comment.service.ts
│   │   ├── email.service.ts
│   │   ├── report.service.ts
│   │   ├── role.service.ts
│   │   ├── status.service.ts
│   │   ├── type.service.ts
│   │   └── user.service.ts
│   ├── utils/              # Utilidades
│   │   └── user.mapper.ts
│   ├── app.ts              # Configuración de Express (middlewares y rutas)
│   └── server.ts           # Punto de entrada del servidor
├── .env                    # Variables de entorno (no incluido en el repo)
├── .gitignore
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

> La arquitectura sigue un patrón en capas: **Routes → Controllers → Services → Repositories → Prisma/DB**, lo que facilita el mantenimiento, la escalabilidad y el testing de cada componente de forma independiente.
