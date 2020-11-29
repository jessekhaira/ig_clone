var mongoose = require('mongoose');
var bcrypt = require('bcrypt'); 

var Schema = mongoose.Schema;


const userSchema = new Schema({
    // values provided through POST request from frontend
    email: {type: String, maxlength: 100, required: true, index: {unique: true}}, 
    full_name: {type: String, maxlength: 100, required: true}, 
    username: {type: String, maxlength: 100, required: true, index: {unique: true}},
    password: {type: String, required: true, maxlength:120},
    date_of_birth: {type: Date, required: true}, 
    // values for the users profile 
    profile_description: {type:String, default:null}, 
    number_of_posts: {type: Number, default: 0},
    profile_picture: {type: Buffer, default: 0},
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
    hashPassword: plain_text_pw => bcrypt.hash(plain_text_pw, 10),
    verifyPassword: async function (pw_to_verify) {
        return await bcrypt.compare(pw_to_verify, this.password); 
    }
}

userSchema.pre(
    // only want this to run if the password has changed -- ie we can update followers and following
    // but pw wont change
    'save', async function (next) {
        if (!this.isModified('password')) {
            return next(); 
        }

        let user = this;
        const password = user.password;
        const hashedPassword = await user.hashPassword(password);
        user.password = hashedPassword;
        next(); 
    }
); 


exports.userModel = mongoose.model('User', userSchema); 