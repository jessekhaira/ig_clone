var mongoose = require('mongoose');
var bycrypt = require('bcrypt'); 

var Schema = mongoose.Schema;


const userSchema = new Schema({
    // values provided through POST request from frontend
    email: {type: String, maxlength: 100, required: true, index: {unique: true}}, 
    full_name: {type: String, maxlength: 100, required: true}, 
    username: {type: String, maxlength: 100, required: true, index: {unique: true}},
    password: {type: String, required: true},
    date_of_birth: {type: Date, required: true}, 
    // values for the users profile 
    profile_description: {type:String, default:null}, 
    number_of_posts: {type: Number, default: 0},
    profile_picture: {binData: Buffer, default: null},
    // store the _ids of all the users that follow this user
    followers: [
      {
          type: Schema.Types.ObjectId,
          ref: 'Users'
      }  
    ],
    // store the _ids of all the users that this user follows 
    following: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Users'
        }
    ],
    photos: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Photos' 
        }
    ] 
}); 