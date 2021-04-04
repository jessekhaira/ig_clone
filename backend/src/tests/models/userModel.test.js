const setupLocalDatabase = require('../database_setup').setupLocalDatabase; 
const User = require('../../models/users').userModel; 
setupLocalDatabase(`testUserModel`); 

describe("test user mongoose model", () => {

  test("test followers and following", async function () {
    const user1 = await User.findOne({ username: "testUser1" });
    const user2 = await User.findOne({ username: "testUser2" });
    const user3 = await User.findOne({ username: "testUser3" });

    user3.followers.push(user1);
    user3.followers.push(user2);

    user1.following.push(user3);
    user2.following.push(user3);

    await user3.save();
    await user1.save();
    await user2.save(); 

    const user3_fromDB = await User.findOne({ username: "testUser3" });
    const user2_fromDB = await User.findOne({ username: "testUser2" });
    const user1_fromDB = await User.findOne({ username: "testUser1" });

    expect(user3_fromDB.followers.length).toEqual(2);
    expect(user2_fromDB.following.length).toEqual(1);
    expect(user1_fromDB.following.length).toEqual(1);
  });

  test("test password hash -- incorrect password entered should return false", async function () {
    const user_practice = await User.findOne({ username: "testUser3" });
    const verify_pw = await user_practice.verifyPassword("123__practice");
    expect(verify_pw).toEqual(false);
  });

  test("test password hash -- correct password entered should return true", async function () {
    const user_practice = await User.findOne({ username: "testUser3" });
    const verify_pw = await user_practice.verifyPassword("123456");
    expect(verify_pw).toEqual(true);
  });

});