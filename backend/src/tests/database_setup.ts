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
    const saved_users = [];
    for (const [i, userObj] of userSeed.entries()) {
        const new_user = new User(userObj);
        for (const buffer_data_photo of photoSeed) {
            const new_photo = new photos({
                data_photo: buffer_data_photo,
                photo_posted_by: new_user,
            });
            new_user.photos.push(new_photo);
            await new_user.save();
            await new_photo.save();
        }
        if (i % 2 == 0) {
            saved_users.push(new_user);
        } else if (i == 19) {
            for (const userToFollow of saved_users) {
                new_user.following.push(userToFollow);
                userToFollow.followers.push(new_user);
                await userToFollow.save();
            }
            await new_user.save();
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
