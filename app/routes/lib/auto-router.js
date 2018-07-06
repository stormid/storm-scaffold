// Map routes to .html files a directory tree
const fs = require('fs');
const path = require('path');

module.exports = app => dir => {
    fs.readdirSync(path.join(__dirname, `../../ui/templates/views${dir}`))
        .forEach(fileName => {
            let name = fileName.substr(0, fileName.lastIndexOf('.'));
            app.get(`${dir}/${name}`, (req, res) => {
                res.render(`views/${dir}/${name}`, {
                    title: name
                });
            });
        });
};