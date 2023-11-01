import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../../data/HTTP_STATUSES";

export const authBasic = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization //'Basic gfdhgdhfmjhghj' -> 'admin:qwerty' next()||401 (Unauthorized)

    if (!authorization) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)

    let decode;

    const token = authorization?.split(' ');
    const type = token[0];
    const encoded = token[1];

    try {
        decode = atob(encoded)
    } catch (err) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    if (type !== 'Basic' || decode !== 'admin:qwerty') {
        return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    }

    return next()
}