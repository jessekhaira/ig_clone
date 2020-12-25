var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * Schema for photos stored in the MongoDB database
 * @constructor photos 
 */
const photosSchema = new Schema({
    data_photo: {type: Buffer, default: 0},
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'likes'
        }  
    ],
    comments:[
        {
            type: Schema.Types.ObjectId,
            ref: 'comments'
        }  
    ],
}); 

let photos = mongoose.model('photos', photosSchema); 
exports.photosModel = photos; 