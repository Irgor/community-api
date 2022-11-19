import mongoose, { Document, Schema } from "mongoose";

export interface Post {
    title: string,
    tags: string[],
    description: string,
    image: string,
    email: string,
    likes: number,
    likers: string[],
    filePath: string,
    isPublic: boolean,
    isPurchasable: boolean,
    isBuyed: boolean,
    created_at: Date,
    updated_at: Date,
}

export interface PostModel extends Post, Document { }

const PostSchema: Schema = new Schema({
    title: { type: String, required: true },
    image: { type: String, required: false },
    email: { type: String, required: false },
    filePath: { type: String, required: false },
    tags: [{ type: String, required: false }],
    description: { type: String, required: false },
    isPublic: { type: Boolean, required: false, default: true },
    isBuyed: { type: Boolean, required: false, default: false },
    isPurchasable: { type: Boolean, required: false, default: false },
    likes: { type: Number, required: false, default: 0 },
    likers: [{ type: String, required: false, default: [] }],
}, {
    timestamps: true,
})

export default mongoose.model<PostModel>('Post', PostSchema);