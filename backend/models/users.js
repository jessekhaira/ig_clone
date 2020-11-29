var mongoose = require('mongoose');
var bcrypt = require('bcrypt'); 

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
    profile_picture: {binData: Buffer, default: 0},
    // store the _ids of all the users that follow this user
    followers: [
      {
          type: Schema.Types.ObjectId,
          ref: 'User'
      }  
    ],
    // store the _ids of all the users that this user follows 
    following: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    photos: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Photo' 
        }
    ] 
}); 

// want to automatically hash the password before it's saved to the database
// so we will use some Mongoose middleware to make that happen! Register a pre hook
// so that 

// define some helper methods for verifying password and for hashing password 
userSchema.methods = {
    hashPassword: plain_text_pw => bcrypt.hash(plain_text_pw),
    verifyPassword: async function (pw_to_verify) {
        return await bcrypt.compare(pw_to_verify, this.password); 
    }
}

userSchema.pre(
    'save', async function (next) {
        let user = this;
        const password = user.password;
        const hashedPassword = await user.hashPassword(password);
        user.password = hashedPassword;
        next(); 
    }
); 


exports.userModel = mongoose.model('User', userSchema); 