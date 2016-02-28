'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		required: 'Please fill Article title',
		trim: true
	},
	summary: {
		type: String,
		default: '',
		//required: 'Please fill Article summary',
		trim: true
	},
	category: {
		type: String,
		default: '',
		trim: true
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
/*	imageURL: {
		type: String,
		default: ['https://s3-us-west-2.amazonaws.com/suc-web/default/default_img.png'],
		//required: 'Please Upload Article Image',
		trim: true
	},*/
	
	rImageUrl: {
		type: String,
		default: '',
		//required: 'Please fill Image URL',
		trim: true
	},

	magazine: {
		type: Schema.ObjectId,
		ref: 'Magazine'
	},
	
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Article', ArticleSchema);