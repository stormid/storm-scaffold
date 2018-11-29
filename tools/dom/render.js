const h = require('./h');
const doctype = require('./doctype');
const walker = require('../utils').walker;
const render = require('preact-render-to-string');
const fse = require('fs-extra');
const path = require('path');
const config = require('../gulp.config');

const write = page => new Promise(resolve => {
    delete require.cache[require.resolve(`../../${config.paths.src.templates}/pages/${page.path}/${page.name}`)];
    const output = require(`../../${config.paths.src.templates}/pages/${page.path}/${page.name}`).default();
    const renderOutput = content => {
        fse.outputFile(
            path.resolve(__dirname, path.join(`../../${config.paths.dest.templates}`, page.path, `${page.name.replace(/.js/, '')}.html`)),
            doctype(render(content)),
            'utf8',
            () => resolve(page.name)
        );
    };
    if(output.then) output.then(res => renderOutput(res));
    else renderOutput(output);
});

module.exports = () => Promise.all(walker(__dirname, `../../${config.paths.src.templates}/pages`).map(write));