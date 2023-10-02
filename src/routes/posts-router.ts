import {raw, Request, Response, Router} from "express";
import {posts_db} from "../data/DB";
import {authBasic, errorsChecking} from "../middleware/middleware_input_validation";
import {HTTP_statuses} from "../data/HTTP_statuses";
import {PostsMainType} from "../types/posts/posts-main-type";
import {postsRepository} from "../repositories/posts-rep";
import {InputValidPosts} from "../middleware/arrays_of_input_validation";


export const PostsRouter = Router()

PostsRouter.get('/', async (req:Request, res:Response)=>{
    const posts = await posts_db.find({},{ projection: {  _id: 0 } }).toArray()

    res.send(posts)
})
PostsRouter.get('/:id', errorsChecking ,async (req: Request<{ id: string }>, res: Response) => {

    const post: PostsMainType | null = await postsRepository.findPost(req.params.id)

    if (!post)
        res.sendStatus(HTTP_statuses.NOT_FOUND_404)

    else
        res.send(post)

})
PostsRouter.post('/',  authBasic,  InputValidPosts.post,  errorsChecking, async  (req:Request<{},{},{id: string, title: string, shortDescription: string, content: string, blogId: string, blogName: string }>, res:Response)=>{

    const  new_post:PostsMainType =  await postsRepository.createPost({

            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId
    })


    res.status(HTTP_statuses.CREATED_201).send(new_post)
})
PostsRouter.put('/:id',  authBasic,  InputValidPosts.put,  errorsChecking, async  (req:Request<{id:string},{},{id: string, title: string, shortDescription: string, content: string, blogId: string, blogName: string }>, res:Response)=>{

    const new_post:PostsMainType| null|undefined = await postsRepository.findPost(req.params.id)

    if (new_post) {
        const result: PostsMainType| null = await postsRepository.updatePost(req.params.id, {

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
PostsRouter.delete('/:id',  authBasic,  async (req: Request<{ id: string }>, res: Response) => {

    const del: boolean = await postsRepository.deletePost(req.params.id)

    if (!del) {
        res.sendStatus(HTTP_statuses.NOT_FOUND_404)
    } else {
        res.sendStatus(HTTP_statuses.NO_CONTENT_204)
    }

})
