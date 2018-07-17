const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const fs = require('fs');

const handleError = err => {
	notify.onError({
		title:    'Gulp',
		subtitle: 'Failure!',
		message:  'Error: <%= error.message %>',
		sound:    'Beep'
	})(err);

    this.emit('end');
    //^??
};

const plumbErrors = () => plumber({errorHandler: handleError});

const find = (dir, re) => {
	if(!fs.existsSync(dir)) return [];
	return fs.readdirSync(dir)
				.reduce(function(files, file){
					if(fs.statSync(path.resolve(__dirname, path.join(dir, file))).isDirectory()) return files.concat(findModules(path.join(dir, file)));
					if(re.test(path.join(dir, file))) files.push(path.join(dir, file));
					return files;
				}, []);
};

module.exports = { plumbErrors, find };