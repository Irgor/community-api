import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Post, { PostModel } from "@models/Post.model";
import { ErrorMessages } from "@utils/errorMessages";
import { defaultCathError } from "@utils/requestHandling";

const create = async (req: Request, res: Response, next: NextFunction) => {
    const { title, tags, description, image } = req.body;

    const post = new Post({
        _id: new mongoose.Types.ObjectId(),
        title,
        tags,
        description,
        image,
    })

    const createdPost = await post.save().catch(error => {
        return defaultCathError(res, ErrorMessages.CREATE_POST_ERROR, error)
    });

    return res.status(201).json({ post: createdPost });
};

const show = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const post = await Post.findById(id).catch(error => {
        return defaultCathError(res, ErrorMessages.GET_POST_ERROR, error);
    });

    if (!post) {
        return res.status(404).json({ message: ErrorMessages.POST_NOT_FOUND });
    }

    return res.status(200).json({ post });
};

const get = async (req: Request, res: Response, next: NextFunction) => {
    const posts = await Post.find();

    if (!posts) {
        return res.status(201).json({ message: ErrorMessages.GET_POSTS_NOT_FOUND });
    }

    return res.status(200).json({ posts });
};

const update = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const post: PostModel = await Post.findById(id).catch(error => {
        return defaultCathError(res, ErrorMessages.GET_POST_ERROR, error);
    });

    if (!post) {
        return res.status(404).json({ message: ErrorMessages.POST_NOT_FOUND });
    }

    post.set(req.body)

    const updatedPost = await post.save().catch(error => {
        return defaultCathError(res, ErrorMessages.UPDATE_POST_ERROR, error);
    })

    return res.status(200).json({ post: updatedPost })
};

const destroy = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    await Post.findByIdAndDelete(id).catch(error => {
        return defaultCathError(res, ErrorMessages.DELETE_POST_ERROR, error);
    });

    return res.status(200).json({ deleted: true });
};


export default { create, show, get, update, destroy };
