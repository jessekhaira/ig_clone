var mongoose = require('mongoose');
var User = require('../models/users').userModel;
var fs = require('fs'); 
const path = require('path'); 
const util = require('util');
const { default: expectCt } = require('helmet/dist/middlewares/expect-ct');
const { verify } = require('crypto');
require('dotenv').config({path: path.resolve('.env')});
const readFile = util.promisify(fs.readFile);
var mongoDB = process.env.MONGO_URL; 
console.log(process.env.MONGO_URL);

var db = mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});


describe('test user mongoose model', () => {
    test('test overall model -- make sure users can be saved to database', async function test_overall_functionality_of_users() {
        // // make sure passwords are being hashed properly
        // // make sure we can verify passwords approriately
        // // verifies db connection is proper 
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
    })

    test('test password hash -- incorrect password entered should return false', async function () {
        const user_practice = await User.findOne({username: 'practice123'});
        const verify_pw = await user_practice.verifyPassword('123__practice');
        expect(verify_pw).toEqual(false);
    })

    test('test password hash -- correct password entered should return true', async function () {
        const user_practice = await User.findOne({username: 'practice123'});
        const verify_pw = await user_practice.verifyPassword('123_practice');
        expect(verify_pw).toEqual(true);
    })

    test('test profile pictuer image storage -- data buffers should match', async function() {
        const data_buffer1 = await readFile(path.resolve('tests/batman16.png'));
        const user_practice = await User.findOne({username: 'practice123'});
        expect(data_buffer1).toEqual(user_practice.profile_picture);
        (await db).disconnect();
    })
});


