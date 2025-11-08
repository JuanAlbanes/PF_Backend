import ENVIRONMENT from "./config/environment.config.js";
import connectMongoDB from "./config/mongoDB.config.js";
import workspace_router from "./routes/workspace.route.js";
import channel_router from "./routes/channel.router.js";
import message_router from "./routes/messages.router.js";

connectMongoDB()

import express from 'express'
import auth_router from "./routes/auth.router.js";
import cors from 'cors'
import authMiddleware from "./middleware/auth.middleware.js";
import member_router from "./routes/member.router.js";

const app = express()

const allowedOrigins = [
    'https://pf-frontend-eta-plum.vercel.app',
    'http://localhost:5173'
];


const corsOptions = {
    origin: function (origin, callback) {
        console.log('🔍 Request from origin:', origin);
        
        if (!origin) {
            console.log('✅ Allowing request without origin');
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            console.log('✅ Origin allowed:', origin);
            callback(null, true);
        } else {
            console.log('🚫 CORS blocked for origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'Cookie', 
        'Set-Cookie', 
        'X-Requested-With',
        'Accept',
        'Origin'
    ],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 86400, 
    preflightContinue: false,
    optionsSuccessStatus: 204
};


app.use(cors(corsOptions));


app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie, Set-Cookie, X-Requested-With, Accept, Origin');
        res.header('Access-Control-Expose-Headers', 'Set-Cookie');
    }
    
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    
    next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth', auth_router)

app.use('/api/members', authMiddleware, member_router)
app.use('/api/workspaces', authMiddleware, workspace_router)
app.use('/api/channels', authMiddleware, channel_router)
app.use('/api/messages', authMiddleware, message_router)

app.get('/api/members/test', (req, res) => {
    res.json({ message: 'Ruta de miembros funcionando correctamente' })
})

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        frontendUrl: process.env.URL_FRONTEND,
        allowedOrigins: allowedOrigins
    });
});

app.get('/api/ruta-protegida', authMiddleware, (request, response) => {
    console.log(request.user)
    response.send({
        ok: true,
        user: request.user,
        message: 'Ruta protegida funcionando'
    })
})

app.get('/', (req, res) => {
    res.json({
        message: 'Slack Clone API',
        version: '1.0',
        environment: process.env.NODE_ENV || 'development',
        allowedOrigins: allowedOrigins
    });
});


app.use((err, req, res, next) => {
    console.error('Error global:', err);

    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            error: 'CORS Error',
            message: 'Origin not allowed',
            origin: req.headers.origin
        });
    }

    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
    });
});

app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method
    });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("🚀 Servidor funcionando en puerto", PORT)
    console.log("🌍 Environment:", process.env.NODE_ENV || 'development')
    console.log("🔗 Frontend URL:", process.env.URL_FRONTEND || 'http://localhost:5173')
    console.log("🔗 Backend URL:", process.env.URL_API_BACKEND || `http://localhost:${PORT}`)
    console.log("📧 Gmail User:", process.env.GMAIL_USERNAME || 'Not configured')
    console.log("✅ CORS configurado para:", allowedOrigins)
})

export default app