const autoRoute = require('../../server/lib/routes/auto');
const navigation = require('./lib/navigation');

const routes = (app) => {

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
	
	autoRoute(app)('/');

};

module.exports = routes;