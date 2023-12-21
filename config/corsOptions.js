const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback) => {
        // @TODO remove "!origin" last part in production
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS')); 
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions;