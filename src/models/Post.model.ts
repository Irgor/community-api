import mongoose, { Document, Mongoose, Schema } from "mongoose";

export interface Post {
    title: string,
    tags: string[],
    description: string,
    image: string
    created_at: Date,
    updated_at: Date,
}

export interface PostModel extends Post, Document { }

const PostSchema: Schema = new Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    tags: [{ type: String, required: false }],
    description: { type: String, required: false },
})

export default mongoose.model<PostModel>('Post', PostSchema);