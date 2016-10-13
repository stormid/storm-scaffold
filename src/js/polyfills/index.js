import Load from '../require/loader.js';

export default () => {
    let urls = [].slice.call(arguments);
    return new Promise(function(resolve) {
        //feature tests
        if(!!Object.assign && !!Promise && !!('classList' in document.documentElement)){ 
            return resolve();
        } else {
            Load(['/content/js/async/polyfills.js'])
                .then(() => {
                    return resolve();
                });
        }
    });
};