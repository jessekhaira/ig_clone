var mongoose = require('mongoose');
var User = require('../models/users').userModel;
require('dotenv').config({path: '../.env'});
var fs = require('fs'); 
const path = require('path'); 
const util = require('util');
const { use } = require('../app');
const { default: expectCt } = require('helmet/dist/middlewares/expect-ct');
const readFile = util.promisify(fs.readFile);

// establish db connection
var mongoDB = process.env.MONGO_URL; 
console.log(process.env.MONGO_URL);
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

describe('test user mongoose model', () => {
    test('test overall functionality of user mongoose model', async function test_overall_functionality_of_users() {
        // make sure passwords are being hashed properly
        // make sure we can verify passwords approriately
        // verifies db connection is proper 
        const profile_picture_buffer = await readFile(path.resolve('tests/batman16.png'));
        const testUser = new User({
            email: "practice1@gmail.com", 
            full_name: "practice user", 
            username: "practice123",
            password: "123_practice",
            date_of_birth: "2002-09-15",
            profile_picture: profile_picture_buffer
        });
    
        await User.deleteMany({username: 'practice123'});
    
        await testUser.save(); 
    
        const user_found = await User.findOne({username: 'practice123'});
        // verify this is false 
        const false_pw = await user_found.verifyPassword('practice');
        // verify this is true 
        const true_pw = await user_found.verifyPassword('123_practice');

        expect(false_pw).toEqual(false);
        expect(true_pw).toEqual(true);
        expect(user_found.profile_picture).toEqual(profile_picture_buffer);
        }
    )}
)

