var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * Schema for photos stored in the MongoDB database
 * @constructor photos 
 */
const photosSchema = new Schema({
    data_photo: {type: Buffer, default: 0, required: true},
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
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