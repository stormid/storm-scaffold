module.exports = app => {
    /*
     * Hide app from the rest of the www
     */
    // Setting headers stops pages being indexed even if indexed pages link to them.
    app.use(function (req, res, next) {
        res.setHeader('X-Robots-Tag', 'noindex')
        next();
    })

    //Hide from crawlers
    app.get('/robots.txt', function (req, res) {
        res.type('text/plain')
        res.send('User-agent: *\nDisallow: /')
    });
};