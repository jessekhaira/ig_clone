var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * Schema for comments stored in the MongoDB database
 * @constructor User 
 */
const commentsSchema = new Schema({
}); 

let comments = mongoose.model('comments', commentsSchema); 
exports.commentsModel = comments; 