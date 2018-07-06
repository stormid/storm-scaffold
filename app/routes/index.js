const autoRoute = require('./lib/auto-router');
const navigation = require('./lib/navigation');

const routes = (app) => {

	//Set local and secondary navigation state
	//Navigation 
	navigation(app);
	
    //add app manifest
    require('./lib/manifest')(app);
	
	//Home
	app.get('/', (req, res) => {
		res.render('views/index', {
			title: 'Home',
		});
	});
	
	// autoRoute(app)('/resources');

	//Prevent SE indexing
	require('./lib/hide')(app);

	//Error handling
	require('./lib/errors')(app);

};

module.exports = routes;