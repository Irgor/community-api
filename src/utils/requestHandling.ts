import { NextFunction, Request, Response } from "express";
import { ErrorMessages } from "./errorMessages";
import Logger from "./logger";

export function defaultCathError(res: Response, message: ErrorMessages, error?: Error): any {
    Logger.error(message);
    Logger.error(error);
    return res.status(500).json({ error: message });
}