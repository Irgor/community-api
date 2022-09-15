import { NextFunction, Request, Response } from "express";
import { defaultCathError } from "@utils/requestHandling";
import { firbaseConfig } from "@config/firebase";
import axios from "axios";
import { errorWrapper } from "@middlewares/errorHandlerWrapper ";

const signup = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const body = {
        email,
        password,
        returnSecureToken: true
    }

    const url = `${firbaseConfig.apiUsersUrl}/accounts:signUp?key=${process.env.FIREBASE_API_KEY}`;
    const userCreated = await axios.post(url, body).catch(err => {
        defaultCathError(err.response.data.error.message, err);
    });

    if (userCreated?.data) {
        return res.status(200).json(userCreated.data);
    }

    return res.status(204);
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

    if (userLogged?.data) {
        return res.status(200).json(userLogged.data);
    }

    return res.status(204);
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

    return res.status(200).json(tokenRefreshed!.data);
}

export const userController = errorWrapper(signup, signin, refresh)
