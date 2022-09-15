import { ErrorMessages } from "@utils/errorMessages";
import logger from "@utils/logger";

export function defaultCathError(message: ErrorMessages, error?: Error, status = 500): any {
    logger.error(message);
    if (error) logger.error(error);
    throw { message: message, status };
}