import {Request, Response, Router} from "express";
import {DB} from "../data/DB";
import {authBasic, errorsChecking, paramsCheckingPosts} from "../middleware/middleware_input_validation";
import {HTTP_statuses} from "../data/HTTP_statuses";
import {PostsMainType} from "../types/posts/posts-main-type";


export const PostsRouter = Router()

PostsRouter.get('/', (req:Request, res:Response)=>{
    res.send(DB.posts)
})
PostsRouter.get('/:id', errorsChecking ,(req:Request<{id:string}>, res:Response)=>{
    const post = DB.posts.find(b => b.id === req.params.id)
    if(!post)
        res.sendStatus(HTTP_statuses.NOT_FOUND_404)
    else
        res.send(post)

})
PostsRouter.post('/',  authBasic,  paramsCheckingPosts.title,  paramsCheckingPosts.shortDescription,  paramsCheckingPosts.content,  paramsCheckingPosts.blogId,  errorsChecking,  (req:Request<{},{},{id: string, title: string, shortDescription: string, content: string, blogId: string, blogName: string }>, res:Response)=>{

    const find_blog = DB.blogs.find(b => b.id === req.body.blogId)

    const new_post:PostsMainType ={
        id: new Date().toISOString(),
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
        blogName: find_blog ? find_blog.name : 'nope'
    }
    DB.posts.push(new_post)
    res.status(HTTP_statuses.CREATED_201).send(new_post)
})
PostsRouter.put('/:id',  authBasic,  paramsCheckingPosts.title,  paramsCheckingPosts.shortDescription,  paramsCheckingPosts.content,  paramsCheckingPosts.blogId,  errorsChecking,  (req:Request<{id:string},{},{id: string, title: string, shortDescription: string, content: string, blogId: string, blogName: string }>, res:Response)=>{

    const new_post = DB.posts.find(b => b.id === req.params.id)

    const find_blog = DB.blogs.find(b => b.id === req.body.blogId)

    if (new_post){
        new_post.title =req.body.title
        new_post.shortDescription =req.body.shortDescription
        new_post.content= req.body.content
        new_post.blogId = req.body.blogId
        new_post.blogName = find_blog ? find_blog.id : 'nope'
        res.status(HTTP_statuses.NO_CONTENT_204).send(new_post)
    }
    else
        res.sendStatus(HTTP_statuses.NOT_FOUND_404)


})
PostsRouter.delete('/:id',  authBasic,  errorsChecking,  (req:Request<{id:string}>, res:Response)=>{
    const post: any = DB.posts.find(p => p.id === req.params.id)
    if(!post){
        res.sendStatus(HTTP_statuses.NOT_FOUND_404)
    }
    else{
        DB.blogs.splice(DB.blogs.indexOf(post), 1)
        res.sendStatus(HTTP_statuses.NO_CONTENT_204)
    }

})
