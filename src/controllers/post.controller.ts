import { NextFunction, Request, Response } from "express";
import Post from "@models/Post.model";
import { ErrorMessages } from "@utils/errorMessages";
import { defaultCathError } from "@utils/requestHandling";
import { firbaseConfig } from "@config/firebase";
import { UploadedFile } from "express-fileupload";
import { errorWrapper } from "@middlewares/errorHandlerWrapper ";

const bucket = firbaseConfig.bucket;

const create = async (req: Request, res: Response, next: NextFunction) => {
    const { title, tags, description, email, isPosted, isPublic } = req.body;

    const post = new Post({
        title,
        tags,
        description,
        email,
        isPosted,
        isPublic
    })

    const createdPost = await post.save().catch(error => {
        defaultCathError(ErrorMessages.CREATE_POST_ERROR, error)
    });

    return res.status(201).json(createdPost);
};

const createImage = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const file = req.files!.image as UploadedFile;
    if (!file) {
        return res.status(400).json({ message: ErrorMessages.POST_IMAGE_WITHOUT_FILE });
    }

    const post = await Post.findById(id).catch(error => {
        defaultCathError(ErrorMessages.GET_POST_ERROR, error);
    });

    if (!post) {
        return res.status(404).json({ message: ErrorMessages.POST_NOT_FOUND });
    }

    const fileName = `${post.title}_${file.name}`;
    const filePath = `posts/${fileName}`;

    await bucket.file(filePath).save(file.data);
    await bucket.file(filePath).makePublic();
    const [metadata] = await bucket.file(filePath).getMetadata();

    post.set({ image: metadata.mediaLink, filePath });
    const updatedPost = await post.save().catch(error => {
        defaultCathError(ErrorMessages.UPDATE_POST_ERROR, error);
    })

    res.status(200).json(updatedPost);
}

const show = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const post = await Post.findById(id).catch(error => {
        defaultCathError(ErrorMessages.GET_POST_ERROR, error);
    });

    if (!post || !post.isPosted) {
        return res.status(404).json({ message: ErrorMessages.POST_NOT_FOUND });
    }

    return res.status(200).json(post);
};

const get = async (req: Request, res: Response, next: NextFunction) => {
    const query = Post.find({ isPosted: true })

    if (req.query.tags && typeof req.query.tags == 'string') {
        const tagsArray = req.query.tags.split(',');
        query.find({ tags: { $in: tagsArray } });
    }

    const posts = await query.exec()

    if (!posts) {
        return res.status(201).json({ message: ErrorMessages.GET_POSTS_NOT_FOUND });
    }

    return res.status(200).json(posts);
};

const tags = async (req: Request, res: Response, next: NextFunction) => {
    const tags = await Post.find().select('tags -_id').exec();

    const uniqueTags = [...new Set(tags.map(tag => tag.tags).flat())];

    return res.status(200).json(uniqueTags);
}

const like = async (req: Request, res: Response) => {
    
}

const update = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const post = await Post.findById(id).catch(error => {
        defaultCathError(ErrorMessages.GET_POST_ERROR, error);
    });

    if (!post) {
        return res.status(404).json({ message: ErrorMessages.POST_NOT_FOUND });
    }

    post.set(req.body)

    const updatedPost = await post.save().catch(error => {
        defaultCathError(ErrorMessages.UPDATE_POST_ERROR, error);
    })

    return res.status(200).json(updatedPost)
};

const destroy = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    await Post.findByIdAndDelete(id).catch(error => {
        defaultCathError(ErrorMessages.DELETE_POST_ERROR, error);
    });

    return res.status(200).json({ deleted: true });
};

export const postController = errorWrapper(create, createImage, show, get, update, destroy, tags);