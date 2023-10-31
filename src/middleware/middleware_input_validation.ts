import {Response, Request, NextFunction} from "express";
import {body, ValidationError, validationResult} from "express-validator";
import {HTTP_statuses} from "../data/HTTP_statuses";
import {blogs_db} from "../data/DB";
import {blogsRepository} from "../repositories/blogs-rep";
import {jwtServises} from "../application/jwt-servises";
import {ObjectId} from "mongodb";



export const paramsCheckingBlogsBody = {
    name: body('name').isString().trim().isLength({min: 1, max: 15}),
    description: body('description').isString().trim().isLength({min: 1, max: 500}),
    websiteUrl: body('websiteUrl').isString().trim().isURL().isLength({min: 1, max: 100}),
}
export const blogIdPostsChecking = async (req:Request<{id:string}>, res:Response, next:NextFunction) => {
    const blog = await blogsRepository.findBlogById(req.params.id)
    if(!blog) return  res.sendStatus(HTTP_statuses.NOT_FOUND_404)
     return next()
}


export const paramsCheckingPostsBody = {
    title: body('title').isString().trim().isLength({min: 1, max: 30}),
    shortDescription: body('shortDescription').isString().trim().isLength({min: 1, max: 100}),
    content: body('content').isString().trim().isLength({min: 1, max: 1000}),
    blogId: body('blogId').custom(async (value) => {

        const blog = await blogs_db.findOne({id:new ObjectId(value) })

        if (!blog)
            throw new Error("error blogID")

        return true

    })
}
export const paramsCheckingUsersBody = {
    email: body('email').isString().trim().isEmail().isLength({min:1, max:20}),
    login: body('login').isString().trim().isLength({min:3, max:10}),
    password: body('password').isString().trim().isLength({min:6, max: 20})
}

export const paramsCheckingLogin ={
    loginOrEmail: body('loginOrEmail').isString().trim().isLength({min:1,max:20}),
    password: body('password').isString().trim().isLength({min:6, max: 20})
}

export const paramsCheckingCommentsBody ={
    content: body('content').isString().trim().isLength({min:20,max:300})

}
export const paramsCheckingAuth={
    code: body('code').isString().trim().isLength({min:1}),
    email: body('email').isString().trim().isEmail().isLength({min:1, max:20}),
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

export const authBearer = async (req: Request, res: Response, next: NextFunction)=>{
    const authorization = req.headers.authorization //'Bearer fdgnodfgn.gfgsgfsdgfsdg.ggsdsdgsd     // it`s jwt

    if (!authorization) return res.sendStatus(HTTP_statuses.UNAUTHORIZED_401)

    const token = authorization.split(' ')[1]
    const userId = await jwtServises.findUserByToken(token)
    if(!userId){
        return  res.sendStatus(HTTP_statuses.UNAUTHORIZED_401)
    }
    req.userId = userId

    return next()

}