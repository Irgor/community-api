import { firbaseConfig } from '@config/firebase';
import { ErrorMessages } from '@utils/errorMessages';
import { NextFunction, Request, Response } from 'express';
import axios from "axios";
import { asyncHandler } from "@middlewares/errorHandler"
import { defaultCathError } from '@utils/requestHandling';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;

    if (!auth) {
        defaultCathError(ErrorMessages.TOKEN_NOT_PROVIDED, new Error(), 401);
    }

    const body = {
        idToken: auth
    }

    const url = `${firbaseConfig.apiUsersUrl}/accounts:lookup?key=${process.env.FIREBASE_API_KEY}`;
    await axios.post(url, body).catch(err => {
        defaultCathError(err.response.data.error.message);
    });

    next();
};

export const auth = asyncHandler(authMiddleware) 