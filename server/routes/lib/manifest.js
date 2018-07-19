module.exports = app => {
    app.get('/site.webmanifest', (req, res) => {
        res.json({
            "name": `${app.locals.appName}`,
            "short_name": `${app.locals.appName}`,
            "icons": [
                {
                    "src": "android-chrome-192x192.png",
                    "sizes": "192x192",
                    "type": "image/png"
                },
                {
                    "src": "android-chrome-512x512.png",
                    "sizes": "512x512",
                    "type": "image/png"
                }
            ],
            "theme_color": "#004785",
            "background_color": "#004785",
            "display": "standalone"
        });
    });
};