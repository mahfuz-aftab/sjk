'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Magazine Schema
 */
var MagazineSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Magazine name',
		trim: true
	},
	summary: {
		type: String,
		default: '',
		required: 'Please fill Field diary summary',
		trim: true
	},

	imageURL: {
        type: String,
        default: ['https://s3-us-west-2.amazonaws.com/suc-web/default/default_img.png'],
        //required: 'Please Upload Article Image',
        trim: true
        },
        
    salePoints: {
         storeName: {
            type: String,
            default: '',
            trim: true
        },
        storeLocation: {
            type: String,
            default: '',
            trim: true
        }
        },
        
    yearNumber:{
    	type: String,
        default: '',
        trim: true
    },
    
    yearQuarter:{
    	type: String,
        default: '',
        trim: true
    },
    
  	publishDate:{
    	type: String,
        default: '',
        trim: true
    },
    
    price: {
        type: Number
       	//required : true
        },
        
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Magazine', MagazineSchema);