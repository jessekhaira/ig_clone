import mongoose from 'mongoose';
import { userSeed, photoSeed } from './testDBSeed';
import { User, IUser } from '../models/users';
import { photos, IPhotos } from '../models/photos';

/**
 * This function sets up a local database connection with MongoDB with the name given in the input
 * to use for testing purposes.
 * @param {String} localDatabaseName Name representing the name of the local database
 * @returns {undefined}
 */
async function setupDatabaseConnection(
    localDatabaseName: string,
): Promise<void> {
    await mongoose.connect(
        `mongodb://127.0.0.1/${localDatabaseName}`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        (err: Error) => {
            if (err) {
                console.log(err);
            }
            console.log(`connected to mongo database ${localDatabaseName}`);
        },
    );
}

async function seedDatabaseUsingModel() {
    const savedUsers: Array<IUser> = [];
    for (const [i, userObj] of userSeed.entries()) {
        const newUser = new User(userObj);
        for (const bufferDataPhoto of photoSeed) {
            const newPhoto = new photos({
                data_photo: bufferDataPhoto,
                photo_posted_by: newUser,
            });
            newUser.photos.push(newPhoto._id);
            await newUser.save();
            await newPhoto.save();
        }
        if (i % 2 == 0) {
            savedUsers.push(newUser);
        } else if (i == 19) {
            for (const userToFollow of savedUsers) {
                newUser.following.push(userToFollow._id);
                userToFollow.followers.push(newUser._id);
                await userToFollow.save();
            }
            await newUser.save();
        }
    }
}

async function deleteCollectionsFromDatabase() {
    const collections = Object.keys(mongoose.connection.collections);
    for (const objDrop of collections) {
        try {
            await mongoose.connection.collections[objDrop].drop();
        } catch (error) {
            if (error.message === 'ns not found') return;
            // This error occurs when you use it.todo. You can
            // safely ignore this error too
            if (
                error.message.includes(
                    'a background operation is currently running',
                )
            )
                return;
            console.log(error.message);
        }
    }
}

function setupLocalDatabase(localDatabaseName: string) {
    beforeAll(async (done) => {
        await setupDatabaseConnection(localDatabaseName);
        await seedDatabaseUsingModel();
        done();
    });

    afterAll(async (done) => {
        await deleteCollectionsFromDatabase();
        await mongoose.connection.close();
        done();
    });
}

module.exports = {
    setupLocalDatabase,
};
export { setupLocalDatabase };
