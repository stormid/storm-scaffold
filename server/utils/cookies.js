const session = require('express-session');
const crypto = require('crypto');

//Development only
//https://stackoverflow.com/questions/10760620/using-memorystore-in-production/39637830
//cookie-session instead?
module.exports = app => {
    app.use(session({
        cookie: {
            maxAge: 1000 * 60 * 60 * 4,
            secure: app.get('env') === 'production'
        },
        genid(){ return crypto.randomBytes(64).toString('hex'); },
        name: `${app.locals.name ? app.locals.name.replace(' ', '-') : 'storm-id'}[${crypto.randomBytes(64).toString('hex')}`,
        resave: false,
        saveUninitialized: false,
        secret: crypto.randomBytes(64).toString('hex')
    }));

    app.set('trust proxy', 1);
};