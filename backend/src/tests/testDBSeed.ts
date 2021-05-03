import fs from 'fs';
import { IUser } from '../models/users';

const userSeed: Array<IUser> = [];
const photoSeed: Array<Buffer> = [];
for (let i = 0; i < 20; i += 1) {
    const currUserObj = {} as IUser;
    const email = `testUser${i}@gmail.com`;
    const username = `testUser${i}`;
    const fullName = `testUser`;
    const password = `123456`;
    const dateOfBirth = Date.now();
    currUserObj.email = email;
    currUserObj.username = username;
    currUserObj.full_name = fullName;
    currUserObj.password = password;
    currUserObj.date_of_birth = new Date(dateOfBirth);
    userSeed.push(currUserObj);
}

for (let i = 0; i < 3; i += 1) {
    const dummyPost = fs.readFileSync(
        `${__dirname}/../routes/generic_profile_pic.jpg`,
    );
    photoSeed.push(dummyPost);
}

export { userSeed, photoSeed };
