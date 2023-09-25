import {Request, Response, Router} from "express";
import {DB} from "../data/DB";
import {authBasic, errorsChecking, paramsCheckingPosts} from "../middleware/middleware_input_validation";
import {HTTP_statuses} from "../data/HTTP_statuses";
import {PostsMainType} from "../types/posts/posts-main-type";
import {postsRepository} from "../repositories/posts-rep";


export const PostsRouter = Router()

PostsRouter.get('/', (req:Request, res:Response)=>{
    res.send(DB.posts)
})
PostsRouter.get('/:id', errorsChecking ,(req:Request<{id:string}>, res:Response)=>{

    const post = postsRepository.findPost(req.params.id)

    if(!post)
        res.sendStatus(HTTP_statuses.NOT_FOUND_404)

    else
        res.send(post)

})
PostsRouter.post('/',  authBasic,  paramsCheckingPosts.title,  paramsCheckingPosts.shortDescription,  paramsCheckingPosts.content,  paramsCheckingPosts.blogId,  errorsChecking,  (req:Request<{},{},{id: string, title: string, shortDescription: string, content: string, blogId: string, blogName: string }>, res:Response)=>{

    const  new_post = postsRepository.createPost({

            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId
    })

    DB.posts.push(new_post)
    res.status(HTTP_statuses.CREATED_201).send(new_post)
})
PostsRouter.put('/:id',  authBasic,  paramsCheckingPosts.title,  paramsCheckingPosts.shortDescription,  paramsCheckingPosts.content,  paramsCheckingPosts.blogId,  errorsChecking,  (req:Request<{id:string},{},{id: string, title: string, shortDescription: string, content: string, blogId: string, blogName: string }>, res:Response)=>{

    const new_post = postsRepository.findPost(req.params.id)

    if (new_post) {
        const result = postsRepository.updatePost(new_post, {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId
        })
        res.status(HTTP_statuses.NO_CONTENT_204).send(result)
    }
    else
        res.sendStatus(HTTP_statuses.NOT_FOUND_404)


})
PostsRouter.delete('/:id',  authBasic,  (req:Request<{id:string}>, res:Response)=>{
    const del = postsRepository.deletePost(req.params.id)
    if(!del){
        res.sendStatus(HTTP_statuses.NOT_FOUND_404)
    }
    else{
        res.sendStatus(HTTP_statuses.NO_CONTENT_204)
    }

})
