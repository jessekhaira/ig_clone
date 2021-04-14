import mongoose, { Document, Schema, Types } from 'mongoose';

/**
 * Schema for photos stored in the MongoDB database
 * @constructor photos
 */
const photosSchema: Schema<IPhotos> = new Schema(
    {
        data_photo: { type: Buffer, default: 0, required: true },
        photo_posted_by: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'comments',
            },
        ],
    },
    { timestamps: { createdAt: 'created_at' } },
);

interface IPhotos extends Document {
    data_photo: Buffer;
    photo_posted_by: Types.ObjectId;
    likes: Array<Types.ObjectId>;
    comments: Array<Types.ObjectId>;
    createdAt: Date;
    updatedAt: Date;
}

const photos = mongoose.model('photos', photosSchema);
exports.photosModel = photos;
export { IPhotos, photos };
