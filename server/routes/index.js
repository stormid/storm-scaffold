const autoRouter = require('../lib/router/auto');
// const navigation = require('./lib/navigation');

module.exports = app => {

	//Set local and secondary navigation state
	//Navigation 
	// navigation(app);
	
    //app manifest
    require('./lib/manifest')(app);
	
	//Home
	app.get('/', (req, res) => {
		res.render('views/index', {
			title: 'Home',
		});
	});
	
	// autoRoute(app)('/');

};