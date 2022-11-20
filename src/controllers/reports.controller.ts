import { NextFunction, Request, Response } from "express";
import Post from "@models/Post.model";
import { errorWrapper } from "@middlewares/errorHandlerWrapper ";
import * as XLSX from 'xlsx';
import { post } from "@routes/user.routes";

const all = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.query.email;

    const query = Post.find();
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

    return res.status(200).send(entries);
};

export const reportsController = errorWrapper(all);
