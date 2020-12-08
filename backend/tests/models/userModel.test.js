var mongoose = require("mongoose");
var User = require("../../models/users").userModel;
var fs = require("fs");
const path = require("path");
const util = require("util");
const { default: expectCt } = require("helmet/dist/middlewares/expect-ct");
const { verify } = require("crypto");
require("dotenv").config({ path: path.resolve(".env") });
const readFile = util.promisify(fs.readFile);
var mongoDB = process.env.MONGO_URL;

var db = mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

describe("test user mongoose model", () => {
  test("make sure users can be saved to database", async function test_overall_functionality_of_users() {
    // // make sure passwords are being hashed properly
    // // make sure we can verify passwords approriately
    // // verifies db connection is proper
    const profile_picture_buffer = await readFile(
      path.resolve("tests/models/batman16.png")
    );
    const testUser1 = new User({
      email: "practice1@gmail.com",
      full_name: "practice user",
      username: "practice123",
      password: "123_practice",
      date_of_birth: "2002-09-15",
      profile_picture: profile_picture_buffer,
    });

    const testUser2 = new User({
      email: "practice2@gmail.com",
      full_name: "practice user",
      username: "test_2",
      password: "123_practice",
      date_of_birth: "2000-09-15",
      profile_picture: profile_picture_buffer,
    });

    const testUser3 = new User({
      email: "practice3@gmail.com",
      full_name: "practice user",
      username: "test_3",
      password: "123_practice",
      date_of_birth: "2000-09-15",
      profile_picture: profile_picture_buffer,
    });

    await User.deleteOne({ username: "practice123" });
    await User.deleteOne({ username: "test_2" });
    await User.deleteOne({ username: "test_3" });
    await User.deleteMany({ email: "practice252@gmail.com" });
    await User.deleteMany({ email: "practice251@gmail.com" });
    await User.deleteMany({ email: "practice20@gmail.com" });
    await User.deleteMany({ email: "practice24@gmail.com" });
    await User.deleteMany({ email: "practice21@gmail.com" });
    await User.deleteMany({email:"lol@pz.com"}); 
    await User.deleteMany({email:"123123@x.com"}); 
    await testUser1.save();
    await testUser2.save();
    await testUser3.save();
  });

  test("test followers and following", async function () {
    const test2 = await User.findOne({ username: "test_2" });
    const test3 = await User.findOne({ username: "test_3" });
    const user_prac = await User.findOne({ username: "practice123" });

    user_prac.followers.push(test2);
    user_prac.followers.push(test3);
    await user_prac.save();

    const test_get = await User.findOne({ username: "practice123" });

    expect(test_get.followers.length).toEqual(2);
  });

  test("test password hash -- incorrect password entered should return false", async function () {
    const user_practice = await User.findOne({ username: "practice123" });
    const verify_pw = await user_practice.verifyPassword("123__practice");
    expect(verify_pw).toEqual(false);
  });

  test("test password hash -- correct password entered should return true", async function () {
    const user_practice = await User.findOne({ username: "practice123" });
    const verify_pw = await user_practice.verifyPassword("123_practice");
    expect(verify_pw).toEqual(true);
  });

  test("test profile pictuer image storage -- data buffers should match", async function () {
    const data_buffer1 = await readFile(path.resolve("tests/models/batman16.png"));
    const user_practice = await User.findOne({ username: "practice123" });
    expect(data_buffer1).toEqual(user_practice.profile_picture);
    (await db).disconnect();
  });
});