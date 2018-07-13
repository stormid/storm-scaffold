const fs = require('fs');
const path = require('path');

module.exports = (base, dir, regex) => {
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