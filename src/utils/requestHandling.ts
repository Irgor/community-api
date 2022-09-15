import { Response } from "express";
import { ErrorMessages } from "./errorMessages";
import logger from "@utils/logger";

export function defaultCathError(res: Response, message: ErrorMessages, error?: Error): any {
    // logger.error(message);
    // logger.error(error);
    throw { message: message };
}