const path = require('path');
const fs = require('fs');
const express = require('express');
const config = require('../gulp.config.js');
const walker = (base, dir, regex) => {
    const baseDir = path.join(base, dir);
    const walk = (dir, filelist = []) => {
        fs.readdirSync(dir).forEach(file => {
            filelist = fs.statSync(path.join(dir, file)).isDirectory()
            ? walk(path.join(dir, file), filelist)
            : filelist.concat(path.join(dir.split(baseDir)[1], file.replace(regex, '')));

        });
        return filelist;
    };
    return walk(path.join(base, dir));
};
    
const app = express();

app.use(express.static(path.join(__dirname, `../../${config.paths.build}`)));

walker(__dirname, `../../${config.paths.build}`, /(index)?.html/)
        .forEach(url => {
            url = url === '.' ? '/' : url;

            app.get(url, (req, res) => {
                res.render(`../../${config.paths.build}/${url}`, {
                    // title: name
                });
            });
        });

return app.listen(4444, () => {
    console.log(`Server listening on port 4444`)
});