import { NextFunction, Request, Response } from "express";
import Post from "@models/Post.model";
import Profile from "@models/Profile.model";
import { errorWrapper } from "@middlewares/errorHandlerWrapper ";
import * as XLSX from 'xlsx';

const all = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.query.email;

    const query = Post.find({ isPublic: true });
    if (email) {
        query.find({ email });
    }
    const posts = await query.exec();

    const tags = posts.map(post => post.tags);

    const uniqueTags = [...new Set(tags.flat())];

    const likeByTags = new Map();
    uniqueTags.forEach(tag => likeByTags.set(tag, 0));

    for (let post of posts) {
        for (let tag of post.tags) {
            likeByTags.set(tag, likeByTags.get(tag) + post.likes);
        }
    }

    const entries = [['tag', 'likes'], ...Object.entries(Object.fromEntries(likeByTags))];

    // const workbook = XLSX.utils.book_new();
    // const worksheet = XLSX.utils.aoa_to_sheet(entries);
    // XLSX.utils.book_append_sheet(workbook, worksheet, 'likeByTags');

    return res.status(200).send(entries);
};

const emails = async (req: Request, res: Response, next: NextFunction) => {
    const result = await Profile.find().select('email -_id').exec();

    const emails = [...new Set(result.map(email => email.email))];

    return res.status(200).send(emails.sort());
}

export const reportsController = errorWrapper(all, emails);
