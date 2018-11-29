const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const fs = require('fs');
const path = require('path');

const handleError = err => {
	notify.onError({
		title:    'Gulp',
		subtitle: 'Failure!',
		message:  'Error: <%= error.message %>',
		sound:    'Beep'
	})(err);

    //this.emit('end');
};

const plumbErrors = () => plumber({errorHandler: handleError});

const find = (base, dir, re) => {
	if(!fs.existsSync(dir)) return [];
	return fs.readdirSync(dir)
				.reduce(function(files, file){
					if(/node_modules/.test(file)) return files;
					if(fs.statSync(path.resolve(__dirname, path.join(dir, file))).isDirectory()) return files.concat(find(base, path.join(dir, file), re));
					if(re.test(path.join(dir, file))) files.push(`${base}/${path.join(dir, file).split('custom-components')[1]}`);
					return files;
				}, []);
};

const walker = (base, dir) => {
    const baseDir = path.join(base, dir);
    const walk = (dir, filelist = []) => {
        fs.readdirSync(dir).forEach(file => {
            filelist = fs.statSync(path.join(dir, file)).isDirectory()
            ? walk(path.join(dir, file), filelist)
            : filelist.concat({ name: file, path: dir.split(baseDir)[1]});
        });
        return filelist;
    };
    return walk(path.join(base, dir));
};

module.exports = { plumbErrors, find, walker };