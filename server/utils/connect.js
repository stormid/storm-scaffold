const net = require('net');
const browserSync = require('browser-sync');
const DEFAULT_START_PORT = 3000;
const TEST_PORT = require('../../jest-puppeteer.config').server.port;

//If running in Production, return port Heroku has assigned
//Otherwise find a free port
const getAvailablePort = app => {
    if(app.get('env') === 'test') return Promise.resolve(TEST_PORT);
    if(app.get('env') === 'production' && process.env.PORT) return Promise.resolve(process.env.PORT);
    
    function tryNext(currentPort, cb) {
        const server = net.createServer()
        server.listen(currentPort, _ => {
            server.once('close', _ => {
                cb(currentPort)
            })
            server.close()
        })
        server.on('error', _ => {
            tryNext(++currentPort, cb)
        })
    }

    return new Promise(resolve => {
        tryNext(DEFAULT_START_PORT, resolve)
    })
};

//Acquire port, start server and plumb browserSync in to server if in development env
module.exports = app => {
    return getAvailablePort(app)
        .then(port => {
            return new Promise(resolve => {
                let server = app.listen(app.get('env') === 'development' ? (port + 1) : port, () => {
                    console.log(`Server listening on port ${port}`);
                    if(app.get('env') === 'development') {
                        browserSync({
                            files: ['app/**/*.*'],
                            port: port,
                            open: false,
                            notify: false,
                            proxy: `localhost:${(port + 1)}`
                        });
                    }
                });
                resolve(server);
            });
        });
};