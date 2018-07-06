const composeNavState = (section, urlParts) => {
	const urlToMatch = urlParts.join('/');
	return section.map(item => Object.assign({}, item, {
			isActive: item.title.toLowerCase() === urlParts[2],
			links: item.links.map(link =>  Object.assign({}, link, {
				isActive: (link.href === urlToMatch)
			}))
		})
	);
};

module.exports = app => {
	app.get('*', (req, res, next) => {
		const urlParts = req.path.split('/');
		const section = urlParts[1];
		const subsection = urlParts[2];

		//share req path with front end
		app.locals.reqPath = req.path;

		//local header navigation
		app.locals.headerConfig.localHeader.navigation = app.locals.headerConfig.localHeader.navigation.map(item => Object.assign({}, item, {
			isActive: item.href.split('/')[1] === section
		}));

		//secondary navigation
		// if(!app.locals.secondaryNavConfig[section]) return;
		app.locals.secondaryNavModel = {};

		Object.keys(app.locals.secondaryNavConfig).forEach(navSection => {
			app.locals.secondaryNavModel[navSection] = app.locals.secondaryNavConfig[navSection].map(item => Object.assign({}, item, {
					isActive: item.title && item.title.toLowerCase() === urlParts[2],
					links: item.links.map(link =>  Object.assign({}, link, {
						isActive: (link.href === req.path)
					}))
				})
			);
		});
		next();
	});
}