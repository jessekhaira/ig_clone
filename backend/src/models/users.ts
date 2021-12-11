import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';

const beautifyUnique = require('mongoose-beautiful-unique-validation');

/**
 * Schema for users
 * @constructor User
 */
const userSchema: Schema<IUser> = new Schema({
    // values provided through POST request from frontend
    email: {
        type: String,
        required: true,
        unique: 'This email is already registered to an user',
    },
    full_name: { type: String, required: true },
    username: {
        type: String,
        required: true,
        unique: 'This username is already registered to an user',
    },
    password: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    // values for the users profile
    profile_description: { type: String, default: null },
    profile_picture: { type: Buffer, default: 0 },
    // store the _ids of all the users that follow this user
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    // store the _ids of all the users that this user follows
    following: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    // store the _ids of all the photos this user posts
    photos: [
        {
            type: Schema.Types.ObjectId,
            ref: 'photos',
        },
    ],
    refreshToken: { type: String, default: null },
});

userSchema.plugin(beautifyUnique);

interface IUser extends Document {
    email: string;
    full_name: string;
    username: string;
    password: string;
    date_of_birth: Date;
    profile_description: string;
    profile_picture: Buffer;
    refreshToken: string;
    followers: Array<Types.ObjectId>;
    following: Array<Types.ObjectId>;
    photos: Array<Types.ObjectId>;
    hashPassword(pw_to_verify: string): Promise<string>;
    verifyPassword(pw_to_verify: string): Promise<boolean>;
}

/**
 * @alias User.prototype.hashPassword Generates an encrypted password hash for this user given the plain text password
 * @alias User.prototype.verifyPassword Verifies whether a plain text password matches the encrypted password stored
 */
userSchema.methods = {
    hashPassword: (plain_text_pw: string) => bcrypt.hash(plain_text_pw, 10),
    async verifyPassword(pw_to_verify: string) {
        const isValid = await bcrypt.compare(pw_to_verify, this.password);
        return isValid;
    },
};

/**
 * Register a callback function that will run every time that a user document is saved with a pre hook.
 */
userSchema.pre<IUser>(
    // only want this to run if the password has changed -- ie we can update followers and followibng
    // but pw wont change
    'save',

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    async function save() {
        if (!this.isModified('password')) return;
        this.password = await this.hashPassword(this.password);
    },
);

const User = mongoose.model<IUser>('User', userSchema);
exports.userModel = User;
export { IUser, User };
