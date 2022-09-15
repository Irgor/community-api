import { NextFunction, Request, Response } from "express";
import { ErrorMessages } from "@utils/errorMessages";
import { defaultCathError } from "@utils/requestHandling";
import { firbaseConfig } from "@config/firebase";
import axios from "axios";

const signup = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const url = `${firbaseConfig.apiUrl}/accounts:signUp?key=${process.env.FIREBASE_API_KEY}`;
    const userCreated = await axios.post(url, {email, password, returnSecureToken: true});

    res.status(200).json(userCreated);
}

const signin = async (req: Request, res: Response, next: NextFunction) => {

}