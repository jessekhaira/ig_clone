var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * Schema for likes stored in the MongoDB database
 * @constructor User 
 */
const likesSchema = new Schema({
}); 

let likes = mongoose.model('likes', likesSchema); 
exports.likesModel = likes; 