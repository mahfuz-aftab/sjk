'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Magazine = mongoose.model('Magazine'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, magazine;

/**
 * Magazine routes tests
 */
describe('Magazine CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Magazine
		user.save(function() {
			magazine = {
				name: 'Magazine Name'
			};

			done();
		});
	});

	it('should be able to save Magazine instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Magazine
				agent.post('/magazines')
					.send(magazine)
					.expect(200)
					.end(function(magazineSaveErr, magazineSaveRes) {
						// Handle Magazine save error
						if (magazineSaveErr) done(magazineSaveErr);

						// Get a list of Magazines
						agent.get('/magazines')
							.end(function(magazinesGetErr, magazinesGetRes) {
								// Handle Magazine save error
								if (magazinesGetErr) done(magazinesGetErr);

								// Get Magazines list
								var magazines = magazinesGetRes.body;

								// Set assertions
								(magazines[0].user._id).should.equal(userId);
								(magazines[0].name).should.match('Magazine Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Magazine instance if not logged in', function(done) {
		agent.post('/magazines')
			.send(magazine)
			.expect(401)
			.end(function(magazineSaveErr, magazineSaveRes) {
				// Call the assertion callback
				done(magazineSaveErr);
			});
	});

	it('should not be able to save Magazine instance if no name is provided', function(done) {
		// Invalidate name field
		magazine.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Magazine
				agent.post('/magazines')
					.send(magazine)
					.expect(400)
					.end(function(magazineSaveErr, magazineSaveRes) {
						// Set message assertion
						(magazineSaveRes.body.message).should.match('Please fill Magazine name');
						
						// Handle Magazine save error
						done(magazineSaveErr);
					});
			});
	});

	it('should be able to update Magazine instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Magazine
				agent.post('/magazines')
					.send(magazine)
					.expect(200)
					.end(function(magazineSaveErr, magazineSaveRes) {
						// Handle Magazine save error
						if (magazineSaveErr) done(magazineSaveErr);

						// Update Magazine name
						magazine.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Magazine
						agent.put('/magazines/' + magazineSaveRes.body._id)
							.send(magazine)
							.expect(200)
							.end(function(magazineUpdateErr, magazineUpdateRes) {
								// Handle Magazine update error
								if (magazineUpdateErr) done(magazineUpdateErr);

								// Set assertions
								(magazineUpdateRes.body._id).should.equal(magazineSaveRes.body._id);
								(magazineUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Magazines if not signed in', function(done) {
		// Create new Magazine model instance
		var magazineObj = new Magazine(magazine);

		// Save the Magazine
		magazineObj.save(function() {
			// Request Magazines
			request(app).get('/magazines')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Magazine if not signed in', function(done) {
		// Create new Magazine model instance
		var magazineObj = new Magazine(magazine);

		// Save the Magazine
		magazineObj.save(function() {
			request(app).get('/magazines/' + magazineObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', magazine.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Magazine instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Magazine
				agent.post('/magazines')
					.send(magazine)
					.expect(200)
					.end(function(magazineSaveErr, magazineSaveRes) {
						// Handle Magazine save error
						if (magazineSaveErr) done(magazineSaveErr);

						// Delete existing Magazine
						agent.delete('/magazines/' + magazineSaveRes.body._id)
							.send(magazine)
							.expect(200)
							.end(function(magazineDeleteErr, magazineDeleteRes) {
								// Handle Magazine error error
								if (magazineDeleteErr) done(magazineDeleteErr);

								// Set assertions
								(magazineDeleteRes.body._id).should.equal(magazineSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Magazine instance if not signed in', function(done) {
		// Set Magazine user 
		magazine.user = user;

		// Create new Magazine model instance
		var magazineObj = new Magazine(magazine);

		// Save the Magazine
		magazineObj.save(function() {
			// Try deleting Magazine
			request(app).delete('/magazines/' + magazineObj._id)
			.expect(401)
			.end(function(magazineDeleteErr, magazineDeleteRes) {
				// Set message assertion
				(magazineDeleteRes.body.message).should.match('User is not logged in');

				// Handle Magazine error error
				done(magazineDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Magazine.remove().exec();
		done();
	});
});