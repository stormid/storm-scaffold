const express = require('express');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const helmet = require('helmet');
const path = require('path');
const connect = require('./connect');
const pkg = require('../../package.json');
const appConfig = require('../../app/config');
// const buildConfig = require('../../gulp.config');

module.exports = () => {
    const app = express();

    app.use(helmet());

    //Parse incoming request body in a middleware, adds to req.body property
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    //Assign global app data from config
    app.locals.version = pkg.version;
    for(key in appConfig) app.locals[key] = appConfig[key];

    //Bootstrap session support
    require('./cookies')(app);

    app.use(express.static(path.join(__dirname, '../../public')));
    app.set('view engine', 'html');

    //Bootstrap routes
    require('../../app/routes')(app);

	//Prevent SE indexing
	require('./routes/hide')(app);
    
	//Error handling
    require('./routes/errors')(app);


    const njk = nunjucks.configure(
        [path.join(__dirname, '../../app/ui/templates')],
        {
            autoescape: true,
            express: app,
            noCache: true,
            watch: true
        }
    );
    return connect(app).then(instance => instance);
};

