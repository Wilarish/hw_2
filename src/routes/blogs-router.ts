import {Response, Request, Router} from "express";
import {DB} from "../data/DB";
import {BlogsMainType} from "../types/blogs/blogs-main-type";
import {HTTP_statuses} from "../data/HTTP_statuses";
import {authBasic, errorsChecking, paramsCheckingBlogs} from "../middleware/middleware_input_validation";

export const BlogsRouter = Router()

BlogsRouter.get('/', (req:Request, res:Response)=>{
    res.send(DB.blogs)
})
BlogsRouter.get('/:id', errorsChecking ,(req:Request<{id:string}>, res:Response)=>{
    const blog = DB.blogs.find(b => b.id === req.params.id)
    if(!blog)
        res.sendStatus(HTTP_statuses.NOT_FOUND_404)
    else
        res.send(blog)

})
const postParams =[paramsCheckingBlogs.websiteUrl,  paramsCheckingBlogs.name,  paramsCheckingBlogs.description,]
BlogsRouter.post('/',  authBasic, postParams,    errorsChecking,  (req:Request<{},{},{id: string, name: string, description: string, websiteUrl: string}>, res:Response)=>{
    const new_blog:BlogsMainType ={
        id: new Date().toISOString(),
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    }
    DB.blogs.push(new_blog)
    res.status(HTTP_statuses.CREATED_201).send(new_blog)
})
BlogsRouter.put('/:id',  authBasic,   paramsCheckingBlogs.websiteUrl,  paramsCheckingBlogs.name,  paramsCheckingBlogs.description,  errorsChecking,  (req:Request<{id:string},{},{id: string, name: string, description: string, websiteUrl: string}>, res:Response)=>{

    const new_blog = DB.blogs.find(b => b.id === req.params.id)

    if (new_blog){
        new_blog.name = req.body.name
        new_blog.description =req.body.description
        new_blog.websiteUrl = req.body.websiteUrl
        res.status(HTTP_statuses.NO_CONTENT_204).send(new_blog)
    }
    else
        res.sendStatus(HTTP_statuses.NOT_FOUND_404)


})
BlogsRouter.delete('/:id',  authBasic, (req:Request<{id:string}>, res:Response)=>{
    const blog = DB.blogs.find(b => b.id === req.params.id)
    if(!blog){
        res.sendStatus(HTTP_statuses.NOT_FOUND_404)
    }
    else{
        DB.blogs.splice(DB.blogs.indexOf(<BlogsMainType>blog), 1)
        res.sendStatus(HTTP_statuses.NO_CONTENT_204)
    }

})

