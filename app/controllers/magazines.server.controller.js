'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Magazine = mongoose.model('Magazine'),
	_ = require('lodash');

/**
 * Create a Magazine
 */
exports.create = function(req, res) {
	var magazine = new Magazine(req.body);
	magazine.user = req.user;

	magazine.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(magazine);
		}
	});
};

/**
 * Show the current Magazine
 */
exports.read = function(req, res) {
	res.jsonp(req.magazine);
};

/**
 * Update a Magazine
 */
exports.update = function(req, res) {
	var magazine = req.magazine ;

	magazine = _.extend(magazine , req.body);

	magazine.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(magazine);
		}
	});
};

/**
 * Delete an Magazine
 */
exports.delete = function(req, res) {
	var magazine = req.magazine ;

	magazine.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(magazine);
		}
	});
};

/**
 * List of Magazines
 */
exports.list = function(req, res) { 
	Magazine.find().sort('-created').populate('user', 'displayName').exec(function(err, magazines) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(magazines);
		}
	});
};

/**
 * Magazine middleware
 */
exports.magazineByID = function(req, res, next, id) { 
	Magazine.findById(id).populate('user', 'displayName').exec(function(err, magazine) {
		if (err) return next(err);
		if (! magazine) return next(new Error('Failed to load Magazine ' + id));
		req.magazine = magazine ;
		next();
	});
};

/**
 * Magazine authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.magazine.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
