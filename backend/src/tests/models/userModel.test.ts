import { User } from '../../models/users';
import { setupLocalDatabase } from '../database_setup';

setupLocalDatabase(`testUserModel`);

test('test followers and following', async function () {
    const user1 = await User.findOne({ username: 'testUser1' }).exec();
    const user2 = await User.findOne({ username: 'testUser2' }).exec();
    const user3 = await User.findOne({ username: 'testUser3' }).exec();

    user3.followers.push(user1._id);
    user3.followers.push(user2._id);

    user1.following.push(user3._id);
    user2.following.push(user3._id);

    await user3.save();
    await user1.save();
    await user2.save();

    const user3FromDB = await User.findOne({ username: 'testUser3' }).exec();
    const user2FromDB = await User.findOne({ username: 'testUser2' }).exec();
    const user1FromDB = await User.findOne({ username: 'testUser1' }).exec();

    expect(user3FromDB.followers.length).toEqual(2);
    expect(user2FromDB.following.length).toEqual(1);
    expect(user1FromDB.following.length).toEqual(1);
});

test('test password hash -- incorrect password entered should return false', async function () {
    const userPractice = await User.findOne({ username: 'testUser3' }).exec();
    const verifyPw = await userPractice.verifyPassword('123__practice');
    expect(verifyPw).toEqual(false);
});

test('test password hash -- correct password entered should return true', async function () {
    const userPractice = await User.findOne({ username: 'testUser3' }).exec();
    const verifyPw = await userPractice.verifyPassword('123456');
    expect(verifyPw).toEqual(true);
});
