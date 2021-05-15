const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Schema for comments stored in the MongoDB database
 * @constructor User
 */
const commentsSchema = new Schema({});

const Comments = mongoose.model('comments', commentsSchema);
exports.commentsModel = Comments;
