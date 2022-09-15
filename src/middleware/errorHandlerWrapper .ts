import { asyncHandler } from "./errorHandler"

const errorWrapper = (...args: Function[]) => {
    const obj: any = {}
    for (let fn of args) {
        obj[fn.name] = asyncHandler(fn);
    }

    return obj;
}

export { errorWrapper }