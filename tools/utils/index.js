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

module.exports = { plumbErrors, find };