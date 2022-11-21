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

    let tags;
    if (req.query.tags && typeof req.query.tags == 'string') {
        tags = req.query.tags.split(',');
    } else {
        tags = posts.map(post => post.tags);
    }

    const uniqueTags = [...new Set(tags.flat())];

    const likeByTags = new Map();
    uniqueTags.forEach(tag => likeByTags.set(tag, 0));

    for (let post of posts) {
        for (let tag of post.tags) {
            if (uniqueTags.includes(tag)) {
                likeByTags.set(tag, likeByTags.get(tag) + post.likes);
            }
        }
    }

    const entries = [['tag', 'likes'], ...Object.entries(Object.fromEntries(likeByTags))];

    return res.status(200).send(entries);
};

const count = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.query.email;

    const query = Post.find({ isPublic: true });
    if (email) {
        query.find({ email });
    }
    const posts = await query.exec();

    const tags = posts.map(post => post.tags);
    const uniqueTags = [...new Set(tags.flat())];

    const postsBytag = new Map();
    uniqueTags.forEach(tag => postsBytag.set(tag, 0));

    for (let post of posts) {
        for (let tag of post.tags) {
            if (post.tags.includes(tag)) {
                postsBytag.set(tag, postsBytag.get(tag) + 1);
            }
        }
    }

    const entries = [['tag', 'numero de posts'], ...Object.entries(Object.fromEntries(postsBytag))];

    return res.status(200).send(entries);
}

const emails = async (req: Request, res: Response, next: NextFunction) => {
    const result = await Profile.find().select('email -_id').exec();

    const emails = [...new Set(result.map(email => email.email))];

    return res.status(200).send(emails.sort());
}

const infos = async (req: Request, res: Response) => {
    const accounts = await Profile.count().exec();

    const posts = await Post.find({ isPublic: true }).exec();

    const buyedPosts = posts.filter(post => post.isBuyed).length;

    const profit = buyedPosts * 90;

    const tags: any = posts.map(post => post.tags);

    const uniqueTags = [...new Set(tags.flat())];

    return res.status(200).send({ accounts, posts: posts.length, profit, tags: uniqueTags.length, buyedPosts });
}

export const reportsController = errorWrapper(all, emails, infos, count);
