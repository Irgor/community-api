import mongoose, { Document, Schema } from "mongoose";

export interface Profile {
    email: string
    name: string
    nickname: string
    phone: string
    bio: string
    banner: string
    following: string[]
    followers: string[]
    picture: string
    created_at: Date,
    updated_at: Date,
}

export interface ProfileModel extends Profile, Document { }

const ProfileSchema: Schema = new Schema({
    email: { type: String, required: false },
    name: { type: String, required: false },
    nickname: { type: String, required: false },
    phone: { type: String, required: false },
    bio: { type: String, required: false },
    banner: { type: String, required: false },
    following: [{ type: String, required: false }],
    followers: [{ type: String, required: false }],
    picture: { type: String, required: false },
}, {
    timestamps: true,
})

export default mongoose.model<ProfileModel>('Profile', ProfileSchema);