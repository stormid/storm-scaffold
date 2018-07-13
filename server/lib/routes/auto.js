// Map routes to .html files a directory tree
const walker = require('./walker');

// module.exports = app => dir => {
//     fs.readdirSync(path.join(__dirname, `../../ui/templates/views${dir}`))
//         .forEach(fileName => {
//             let name = fileName.substr(0, fileName.lastIndexOf('.'));
//             app.get(`${dir}/${name}`, (req, res) => {
//                 res.render(`views/${dir}/${name}`, {
//                     title: name
//                 });
//             });
//         });
// };


module.exports = app => dir => {
    walker(__dirname, `../../../app/ui/templates/views`, /(index)?.html/)
        .forEach(url => {
            url = url === '.' ? '/' : url;

            app.get(url, (req, res) => {
                res.render(`views/${url}`, {
                    // title: name
                });
            });
        });
};