// import mongoose, { Document, Schema } from "mongoose";

// export interface Post {
//     title: string,
//     tags: string[],
//     description: string,
//     image: string
//     filePath: string
//     created_at: Date,
//     updated_at: Date,
// }

// export interface PostModel extends Post, Document { }

// const PostSchema: Schema = new Schema({
//     title: { type: String, required: true },
//     image: { type: String, required: false },
//     filePath: { type: String, required: false },
//     tags: [{ type: String, required: false }],
//     description: { type: String, required: false },
// }, {
//     timestamps: true,
// })

// export default mongoose.model<PostModel>('Post', PostSchema);