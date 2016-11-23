/**
 * @name storm-load: Lightweight promise-based script loader
 * @version 0.1.0: Thu, 20 Oct 2016 12:55:45 GMT
 * @author stormid
 * @license MIT
 */
const create = url => {
    return new Promise(function(resolve) {
        if (!(/js$/.test(url))){
            console.log(url + " is not a js file");
            return resolve();
        }
        let script = document.createElement('script');
        script.src = url;
        document.head.appendChild(script);
        script.onload = script.onerror = resolve;
    });
}

export const synchronous = urls => {
    return new Promise((resolve, reject) => {
        let next = () => {
            if (!urls.length) return resolve();
            let url = urls.shift();
            create(url).then(next);
        };
        next();
    });
};

export default (urls, async = true) => {
    if (!async) return synchronous(urls);

    return new Promise((resolve, reject) => {
        if(!!!Array.isArray(urls)) return reject(); 
        
        return Promise.all(urls.map(url => {
                    return create(url); 
                }))
                .then(resolve, reject);
    });
};