import e, {Response, Request, NextFunction} from "express";
import {body, ValidationError, validationResult} from "express-validator";
import {HTTP_statuses} from "../data/HTTP_statuses";
import {DB} from "../data/DB";


export const paramsCheckingBlogs = {
    id: body('id').isString().trim().isLength({min: 1}),
    name: body('name').isString().trim().isLength({min: 1, max: 15}),
    description: body('description').isString().trim().isLength({min: 1, max: 500}),
    websiteUrl: body('websiteUrl').isString().trim().isURL().isLength({min: 1, max: 100})
}

export const paramsCheckingPosts = {
    id: body('id').isString().trim().isLength({min: 1}),
    title: body('title').isString().trim().isLength({min: 1, max: 30}),
    shortDescription: body('shortDescription').isString().trim().isLength({min: 1, max: 100}),
    content: body('content').isString().trim().isLength({min: 1, max: 1000}),
    blogId: body('blogId').custom(value => {

        const blog = DB.blogs.find(b => b.id === value)

        if (!blog)
            throw new Error("error blogID")

        return true

    })
}
const errorFormatter = (error: ValidationError) => {
    switch (error.type) {
        case "field":
            return  {
                message: error.msg,
                field: error.path,
            };
        default :
            return  {
                message: error.msg,
                field: 'Not found',
            };
    }

}


export const errorsChecking = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
        res.status(HTTP_statuses.BAD_REQUEST_400).send({errorsMessages: errors.array({onlyFirstError: true})});
    } else next();
}


export const authBasic = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization //'Basic gfdhgdhfmjhghj' -> 'admin:qwerty' next()||401 (Unauthorized)

    if (!authorization) return res.sendStatus(HTTP_statuses.UNAUTHORIZED_401)

    let decode;

    const token = authorization?.split(' ');
    const type = token[0];
    const encoded = token[1];

    try {
        decode = atob(encoded)
    } catch (err) {
        res.sendStatus(HTTP_statuses.UNAUTHORIZED_401)
        return
    }

    if (type !== 'Basic' || decode !== 'admin:qwerty') {
        return res.sendStatus(HTTP_statuses.UNAUTHORIZED_401)
    }

    return next()
}