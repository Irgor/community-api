import { NextFunction, Request, Response } from "express";
import Post from "../models/Post.model";
import Profile from "../models/Profile.model";
import { ErrorMessages } from "../utils/errorMessages";
import { defaultCathError } from "../utils/requestHandling";
import { firbaseConfig } from "../config/firebase";
import { UploadedFile } from "express-fileupload";
import { errorWrapper } from "../middlewares/errorHandlerWrapper ";
import { schedulePost } from "../schedulers/post.scheduler";

const bucket = firbaseConfig.bucket;

const LIKES_TO_BUY_POST = 2;

const create = async (req: Request, res: Response, next: NextFunction) => {
    const { title, tags, description, email, isPublic, date } = req.body;

    const post = new Post({
        title,
        tags,
        description,
        email,
        isPublic,
        isPurchasable: false,
        isBuyed: false,
        isPublished: date ? false : true,
        likes: 0,
        likers: []
    })

    const createdPost = await post.save().catch(error => {
        defaultCathError(ErrorMessages.CREATE_POST_ERROR, error)
    });

    if (date) {
        schedulePost(new Date(date), post.id)
    }

    return res.status(201).send(createdPost);
};

const createImage = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const file = req.files!.image as UploadedFile;
    if (!file) {
        return res.status(400).send({ message: ErrorMessages.POST_IMAGE_WITHOUT_FILE });
    }

    const post = await Post.findById(id).catch(error => {
        defaultCathError(ErrorMessages.GET_POST_ERROR, error);
    });

    if (!post) {
        return res.status(404).send({ message: ErrorMessages.POST_NOT_FOUND });
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

    res.status(200).send(updatedPost);
}

const show = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const post = await Post.findById(id).catch(error => {
        defaultCathError(ErrorMessages.GET_POST_ERROR, error);
    });

    if (!post) {
        return res.status(404).send({ message: ErrorMessages.POST_NOT_FOUND });
    }

    const owner = await Profile.find({ email: post.email }).exec();

    return res.status(200).send({ ...post.toJSON(), owner: owner[0] });
};

const get = async (req: Request, res: Response, next: NextFunction) => {
    const query = Post.find();

    if (req.query.tags && typeof req.query.tags == 'string') {
        const tagsArray = req.query.tags.split(',');
        query.find({ tags: { $in: tagsArray } });
    }

    if (req.query.email) {
        const email = req.query.email;
        query.find({ email });
    }

    if (!req.query.email) {
        query.find({ isPublished: true })
    }

    const skip = req.query.skip ? +req.query.skip : 0;
    const limit = req.query.limit ? +req.query.limit : 20;

    query.skip(skip);
    query.limit(limit);

    const posts = await query.exec()

    if (!posts) {
        return res.status(201).send({ message: ErrorMessages.GET_POSTS_NOT_FOUND });
    }

    return res.status(200).send(posts);
};

const tags = async (req: Request, res: Response, next: NextFunction) => {
    const tags = await Post.find({ isPublished: true }).select('tags -_id').exec();

    const uniqueTags = [...new Set(tags.map(tag => tag.tags).flat())];

    return res.status(200).send(uniqueTags);
}

const likes = async (req: Request, res: Response) => {
    const id = req.params.id;

    const { userId } = req.body;

    const post = await Post.findById(id).catch(error => {
        defaultCathError(ErrorMessages.GET_POST_ERROR, error);
    });

    if (!post) {
        return res.status(404).send({ message: ErrorMessages.POST_NOT_FOUND });
    }

    const alredyLiked = post.likers.filter(liker => liker == userId).length;

    if (!alredyLiked) {
        post.likes += 1;
        post.likers = [...post.likers, userId];
    } else {
        post.likes -= 1;
        post.likers = post.likers.filter(liker => liker != userId);
    }

    post.isPurchasable = post.likes >= LIKES_TO_BUY_POST;

    post.set(post)

    const updatedPost = await post.save().catch(error => {
        defaultCathError(ErrorMessages.UPDATE_POST_ERROR, error);
    })

    return res.status(200).send(updatedPost)
}

const purchasables = async (req: Request, res: Response) => {
    const posts = await Post.find({ isPurchasable: true }).exec();

    if (!posts) {
        return res.status(201).send({ message: ErrorMessages.GET_POSTS_NOT_FOUND });
    }

    return res.status(200).send(posts);
}

const purchase = async (req: Request, res: Response) => {
    const id = req.params.id;

    const post = await Post.findById(id).catch(error => {
        defaultCathError(ErrorMessages.GET_POST_ERROR, error);
    });

    if (!post) {
        return res.status(404).send({ message: ErrorMessages.POST_NOT_FOUND });
    }

    post.isBuyed = true;

    post.set(post)

    const updatedPost = await post.save().catch(error => {
        defaultCathError(ErrorMessages.UPDATE_POST_ERROR, error);
    })

    return res.status(200).send(updatedPost)
}

const our = async (req: Request, res: Response) => {
    const posts = await Post.find({ isBuyed: true }).exec();

    if (!posts) {
        return res.status(201).send({ message: ErrorMessages.GET_POSTS_NOT_FOUND });
    }

    return res.status(200).send(posts);
}

const update = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const post = await Post.findById(id).catch(error => {
        defaultCathError(ErrorMessages.GET_POST_ERROR, error);
    });

    if (!post) {
        return res.status(404).send({ message: ErrorMessages.POST_NOT_FOUND });
    }

    post.set(req.body)

    const updatedPost = await post.save().catch(error => {
        defaultCathError(ErrorMessages.UPDATE_POST_ERROR, error);
    })

    return res.status(200).send(updatedPost)
};

const destroy = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    await Post.findByIdAndDelete(id).catch(error => {
        defaultCathError(ErrorMessages.DELETE_POST_ERROR, error);
    });

    return res.status(200).send({ deleted: true });
};

export const postController = errorWrapper(create, createImage, show, get, update, destroy, tags, likes, purchasables, purchase, our);
