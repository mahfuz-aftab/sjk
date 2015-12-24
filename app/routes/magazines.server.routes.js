'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var magazines = require('../../app/controllers/magazines.server.controller');

	// Magazines Routes
	app.route('/magazines')
		.get(magazines.list)
		.post(users.requiresLogin, magazines.create);

	app.route('/magazines/:magazineId')
		.get(magazines.read)
		.put(users.requiresLogin, magazines.hasAuthorization, magazines.update)
		.delete(users.requiresLogin, magazines.hasAuthorization, magazines.delete);
		
	// Finish by binding the Magazine middleware
	app.param('magazineId', magazines.magazineByID);
};
