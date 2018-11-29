import { h } from './h'; 
const doctype = require('./doctype');
const walker = require('../utils').walker;
const render = require('preact-render-to-string');
const fse = require('fs-extra');
const path = require('path');
const config = require('../gulp.config');


/**
 * Removes a module from the cache
 */
function purgeCache(moduleName) {
    // Traverse the cache looking for the files
    // loaded by the specified module name
    searchCache(moduleName, function (mod) {
        delete require.cache[mod.id];
    });

    // Remove cached paths to the module.
    // Thanks to @bentael for pointing this out.
    Object.keys(module.constructor._pathCache).forEach(function(cacheKey) {
        if (cacheKey.indexOf(moduleName)>0) {
            delete module.constructor._pathCache[cacheKey];
        }
    });
};

/**
 * Traverses the cache to search for all the cached
 * files of the specified module name
 */
function searchCache(moduleName, callback) {
    // Resolve the module identified by the specified name
    var mod = require.resolve(moduleName);

    // Check if the module has been resolved and found within
    // the cache
    if (mod && ((mod = require.cache[mod]) !== undefined)) {
        // Recursively go over the results
        (function traverse(mod) {
            // Go over each of the module's children and
            // traverse them
            mod.children.forEach(function (child) {
                traverse(child);
            });

            // Call the specified callback providing the
            // found cached module
            callback(mod);
        }(mod));
    }
};
const write = page => new Promise(resolve => {
    // delete require.cache[require.resolve(`../../${config.paths.src.dom}/pages/${page.path}/${page.name}`)];
    purgeCache(`../../${config.paths.src.dom}/pages/${page.path}/${page.name}`);
    const output = require(`../../${config.paths.src.dom}/pages/${page.path}/${page.name}`).default();
    const renderOutput = content => {
        fse.outputFile(
            path.resolve(__dirname, path.join(`../../${config.paths.build}`, page.path, `${page.name.replace(/.js/, '')}.html`)),
            doctype(render(content)),
            'utf8',
            () => resolve(page.name)
        );
    };
    if(output.then) output.then(res => renderOutput(res));
    else renderOutput(output);
});

module.exports = () => Promise.all(walker(__dirname, `../../${config.paths.src.dom}/pages`).map(write));