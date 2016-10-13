const createScript = url => {
    return new Promise(function(resolve) {
        if (!(/js$/.test(url))){
            console.warn(url + " is not a js file");
            return resolve();
        }
        let script = document.createElement('script');
        script.src = url;
        document.head.appendChild(script);
        script.onload = script.onerror = resolve;
    });
}

export default urls => {
    return new Promise(function(resolve) {
        //we're creating these sequentially, so they load in the order they're passed in
        function next() {
            if (!urls.length) return resolve();
            let url = urls.shift();
            createScript(url).then(next);
        }
        next();
    });
};