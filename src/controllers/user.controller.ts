import { NextFunction, Request, Response } from "express";
import { defaultCathError } from "../utils/requestHandling";
import { firbaseConfig } from "../config/firebase";
import axios from "axios";
import { errorWrapper } from "../middlewares/errorHandlerWrapper ";
import Profile from "../models/Profile.model";
import { ErrorMessages } from "../utils/errorMessages";
import Post from "../models/Post.model";
import { post } from "@routes/user.routes";

const signup = async (req: Request, res: Response, next: NextFunction) => {
    const {
        email,
        password,
        name,
        nickname,
        phone,
        bio,
        banner,
        picture,
    } = req.body;

    const body = {
        email,
        password,
        returnSecureToken: true
    }

    const url = `${firbaseConfig.apiUsersUrl}/accounts:signUp?key=${process.env.FIREBASE_API_KEY}`;
    const userCreated = await axios.post(url, body).catch(err => {
        defaultCathError(err.response.data.error.message, err);
    });

    const userData = userCreated!.data;

    const profile = new Profile({
        email,
        name,
        nickname,
        phone,
        bio,
        banner,
        picture,
    })

    const createdProfile = await profile.save().catch(error => {
        defaultCathError(ErrorMessages.CREATE_USER_ERROR, error)
    });

    return res.status(200).send({ ...userData, user: createdProfile });
}

const signin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const body = {
        email,
        password
    }

    const url = `${firbaseConfig.apiUsersUrl}/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`;
    const userLogged = await axios.post(url, body).catch(err => {
        defaultCathError(err.response.data.error.message, err);
    })

    const userData = userLogged!.data;

    const user = await Profile.find({ email }).exec();

    return res.status(200).send({ ...userData, user: user[0] });
}

const refresh = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.body.refreshToken;

    const body = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    }

    const url = `${firbaseConfig.apiTokenUrl}/token?key=${process.env.FIREBASE_API_KEY}`;
    const tokenRefreshed = await axios.post(url, body).catch(err => {
        defaultCathError(err.response.data.error.message, err);
    });

    return res.status(200).send(tokenRefreshed!.data);
}

const update = async (req: Request, res: Response) => {
    const { id,
        name,
        nickname,
        phone,
        bio,
        banner,
        picture,
    } = req.body;

    const profile = await Profile.findById(id)

    if (!profile) {
        return res.status(404).send({ message: ErrorMessages.USER_NOT_FOUND });
    }

    profile.set({
        name,
        nickname,
        phone,
        bio,
        banner,
        picture
    })

    const updatedProfile = await profile.save().catch((error: any) => {
        defaultCathError(ErrorMessages.UPDATE_USER_ERROR, error);
    })

    return res.status(200).send(updatedProfile)
}

const destroy = async (req: Request, res: Response) => {
    const id = req.params.id;

    const { email } = req.body;

    await Profile.findByIdAndDelete(id).catch(error => {
        defaultCathError(ErrorMessages.DELETE_USER_ERROR, error);
    });

    const posts = await Post.find({ email, isBuyed: false });

    if (posts) {
        for(let post of posts) {
            await post.delete();
        }
    }

    return res.status(200).send({ deleted: true });
}

export const userController = errorWrapper(signup, signin, refresh, update, destroy)
