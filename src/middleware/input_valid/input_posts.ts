import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../../data/HTTP_STATUSES";
import {body} from "express-validator";
import {BlogsRepository} from "../../repositories/blogs-rep";


export const uriBlogIdPostsChecking = async (req:Request<{id:string}>, res:Response, next:NextFunction) => {
    const blogsRepository = new BlogsRepository()

    const blog = await blogsRepository.findBlogById(req.params.id)
    if(!blog) return  res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    return next()
}


export const paramsCheckingPostsBody = {
    title: body('title').isString().trim().isLength({min: 1, max: 30}),
    shortDescription: body('shortDescription').isString().trim().isLength({min: 1, max: 100}),
    content: body('content').isString().trim().isLength({min: 1, max: 1000}),
    blogId: body('blogId').isString().trim().isLength({min:1}).custom(async (id) => {

        const blogsRepository = new BlogsRepository()

        const blog = await blogsRepository.findBlogById(id)

        if (!blog) throw new Error("error blogID")

        return true

    })
}