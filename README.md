
# Slack Personalizado - Backend


Backend de Slack construido con Node.js, Express y MongoDBAtlas. API RESTful con autenticación JWT y comunicación.

## 🚀 Características
- 📝 **BACKEND** (Node.js + Express + Mongoose):
- 🔐 **Autenticación JWT**
- 🗄️ **Base de datos MongoDBAtlas con Mongoose**
- 👥 **Sistema de usuarios y espacios de trabajo CRUD funcional completo**
- 📁 **Gestión de canales y mensajes CRUD funcional completo**
- 🛡️ **Middleware de seguridad y validación**
- 📊 **API RESTful completa**

## 🛠️ Stack Tecnológico

- **Runtime:** Node.js
- **Framework:** Express.js
- **Base de datos:** MongoDB Atlas con Mongoose ODM
- **Autenticación:** JWT, bcrypt
- **Validación:** Express Validator
- **Variables de entorno:** Dotenv
- **CORS** : conexión con frontend

## Estructura

├── src/
│   ├── config/
│   │   └── environment.config.js
│   │   └── mailer.config.js
│   │   └── mongoDB.config.js
│   ├── controllers/
│   │   └── auth.controller.js
│   │   └── channel.controller.js
│   │   └── member.controller.js
│   │   └── message.controller.js
│   │   └── workspace.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── channel.middleware.js
│   │   └── workspace.middleware.js
│   ├── models/
│   │   └── Channel.model.js
│   │   └── ChannelMessage.model.js
│   │   └── MemberWorkspace.model.js
│   │   └── User.model.js
│   │   └── Workspace.model.js
│   ├── repositories/
│   │   └── channel.repository.js
│   │   └── channelMessage.repository.js
│   │   └── memberWorkspace.repository.js
│   │   └── user.repository.js
│   │   └── workspace.repository.js
│   ├── routes/
│   │   └── auth.router.js
│   │   └── channel.router.js
│   │   └── member.router.js
│   │   └── message.router.js
│   │   └── workspace.router.js
│   ├── services/
│   │   └── auth.service.js
│   │   └── channel.service.js
│   │   └── member.service.js
│   │   └── message.service.js
│   │   └── workspace.service.js
│   ├── utils/
│   │   └── customError.utils.js
│   │   └── validations.utils.js
│   └── server.js
├── vercel.json
└── .gitignore
├── package.json
└── .env
├── .env.example


## API Endpoints

**Autenticación**
POST /api/auth/register - Registro de usuario
POST /api/auth/login - Login de usuario
GET /api/auth/verify-email/:verification_token
PUT /reset-password
GET /me


**Workspaces**
GET /
GET /all
GET /:workspace_id
POST /
PUT /:workspace_id
DELETE /:workspace_id
POST /:workspace_id/invite

**Canales**
GET /workspace/:workspace_id
GET /:workspace_id/:channel_id 
POST /
PUT /:workspace_id/:channel_id
DELETE /:workspace_id/:channel_id

**Mensajes**
GET /:workspace_id/:channel_id
GET /:message_id
POST /
PUT /:message_id
DELETE /:message_id

## ToDo Mejoras

El back esta completamente funcional e integrado con el front,(CRUD en workspace, canales y mensajes), si se registra un usuario y verifica el mail podrá hacer el login y cuando haga la invitacion tambien lo logrará hacer, cuando se hacen los mailer tanto de registro como de invitacion a un workspace los mail y los redirect funcionan, PERO queda a mejorar que si desde la misma redireccion se intenta loguear aveces falla, no logre encontrar el fallo.


## 📦 Instalación

```bash
# Clonar repositorio
git clone https://github.com/JuanAlbanes/Backend_prueba_sin_mock.git
cd Backend_prueba_sin_mock

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

npm run dev

