const server = require('./lib/init')();

module.exports = {
    close() { server && server.close(); },
    getPort() { return server.address().port; }
};