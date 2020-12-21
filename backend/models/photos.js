var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * Schema for photos stored in the MongoDB database
 * @constructor User 
 */
const photosSchema = new Schema({

}); 

let photos = mongoose.model('photos', photosSchema); 
exports.photosModel = photos; 