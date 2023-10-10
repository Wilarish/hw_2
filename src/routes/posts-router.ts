import {Request, Response, Router} from "express";
import {authBasic, errorsChecking} from "../middleware/middleware_input_validation";
import {HTTP_statuses} from "../data/HTTP_statuses";
import {PostsMainType} from "../types/posts/posts-main-type";
import {postsRepository} from "../repositories/posts-rep";
import {InputValidPosts} from "../middleware/arrays_of_input_validation";
import {body} from "express-validator";
import {getDefaultPagination} from "../helpers/pagination.helper";
import {DefaultPaginationType, Paginated} from "../types/pagination.type";
import {blogsRepository} from "../repositories/blogs-rep";
import {postsServises} from "../domain/posts-servises";


export const PostsRouter = Router()

PostsRouter.get('/', async (req:Request, res:Response)=>{
    const pagination:DefaultPaginationType = getDefaultPagination(req.query)
    const posts:Paginated<PostsMainType> = await postsRepository.findPosts(pagination)

    res.send(posts)
})
PostsRouter.get('/:id', errorsChecking ,async (req: Request<{ id: string }>, res: Response) => {

    const post: PostsMainType | null = await postsRepository.findPostById(req.params.id)

    if (!post)
        res.sendStatus(HTTP_statuses.NOT_FOUND_404)

    else
        res.send(post)

})
PostsRouter.post('/',  authBasic,  InputValidPosts.post,  errorsChecking, async  (req:Request<{},{},{ title: string, shortDescription: string, content: string, blogId: string, blogName: string }>, res:Response)=>{


    const  new_post:PostsMainType =  await postsServises.createPost({

            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId
    })


    res.status(HTTP_statuses.CREATED_201).send(new_post)
})
PostsRouter.put('/:id',  authBasic,  InputValidPosts.put,  errorsChecking, async  (req:Request<{id:string},{},{id: string, title: string, shortDescription: string, content: string, blogId: string, blogName: string }>, res:Response)=>{

    const new_post:PostsMainType| null|undefined = await postsRepository.findPostById(req.params.id)

    if (new_post) {
        const result: PostsMainType| null = await postsServises.updatePost(req.params.id, {

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

    const del: boolean = await postsServises.deletePost(req.params.id)

    if (!del) {
        res.sendStatus(HTTP_statuses.NOT_FOUND_404)
    } else {
        res.sendStatus(HTTP_statuses.NO_CONTENT_204)
    }

})
