var mongoose = require('mongoose');
var bcrypt = require('bcrypt'); 
const beautifyUnique = require('mongoose-beautiful-unique-validation');

var Schema = mongoose.Schema;

/**
 * Schema for users
 * @constructor User 
 */
const userSchema = new Schema({
    // values provided through POST request from frontend
    email: {type: String, required: true, unique: "This email is already registered to an user"}, 
    full_name: {type: String, required: true}, 
    username: {type: String, required: true, unique: "This username is already registered to an user"},
    password: {type: String, required: true},
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
    // store the _ids of all the photos this user posts 
    photos: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Photo' 
        }
    ],
    requestToken: {type:String, default: null} 
}); 

userSchema.plugin(beautifyUnique);



/**
 * @alias User.prototype.hashPassword Generates an encrypted password hash for this user given the plain text password
 * @alias User.prototype.verifyPassword Verifies whether a plain text password matches the encrypted password stored
 */
userSchema.methods = {
    hashPassword: plain_text_pw => bcrypt.hash(plain_text_pw, 10),
    verifyPassword: async function (pw_to_verify) {
        return await bcrypt.compare(pw_to_verify, this.password); 
    }
}

/**
 * Register a callback function that will run every time that a user document is saved with a pre hook. 
 */
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


let User = mongoose.model('User', userSchema); 
exports.userModel = User; 