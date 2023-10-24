import {Request, Response, Router} from "express";
import {authBasic, authBearer, errorsChecking} from "../middleware/middleware_input_validation";
import {HTTP_statuses} from "../data/HTTP_statuses";
import {PostsMainType} from "../types/posts/posts-main-type";
import {postsRepository} from "../repositories/posts-rep";
import {InputValidPosts} from "../middleware/arrays_of_input_validation";
import {body} from "express-validator";
import {getDefaultPagination} from "../helpers/pagination.helper";
import {DefaultPaginationType, Paginated} from "../types/pagination.type";
import {blogsRepository} from "../repositories/blogs-rep";
import {postsServises} from "../domain/posts-servises";
import {CommentsCreateUpdate} from "../types/comments/comments-create-update";
import {CommentsMainType} from "../types/comments/comments-main-type";
import {commentsRepository} from "../repositories/comments-rep";


export const PostsRouter = Router()

PostsRouter.get('/', async (req: Request, res: Response) => {
    const pagination: DefaultPaginationType = getDefaultPagination(req.query)
    const posts: Paginated<PostsMainType> = await postsRepository.findPosts(pagination)

    return res.send(posts)
})
PostsRouter.get('/:id', errorsChecking, async (req: Request<{ id: string }>, res: Response) => {

    const post: PostsMainType | null = await postsRepository.findPostById(req.params.id)

    if (!post)
        return res.sendStatus(HTTP_statuses.NOT_FOUND_404)


    return res.send(post)

})
PostsRouter.get('/:id/comments', async (req: Request<{id:string}>, res: Response) => {

    const pagination: DefaultPaginationType = getDefaultPagination(req.query)
    const comments: Paginated<CommentsMainType> | null = await commentsRepository.findComments(pagination, req.params.id)

    if(!comments) return res.sendStatus(HTTP_statuses.NOT_FOUND_404)
    return res.status(HTTP_statuses.OK_200).send(comments)
})
PostsRouter.post('/:id/comments', authBearer, async (req: Request<{id:string}, {}, { content: string }>, res: Response) => {

    const data: CommentsCreateUpdate = {content: req.body.content}
    //@ts-ignore

    const new_comment: CommentsMainType | null = await postsServises.createCommentForPost(req.userId, req.params.id, data)

    if(!new_comment) return res.sendStatus(HTTP_statuses.NOT_FOUND_404)
    return  res.status(HTTP_statuses.CREATED_201).send(new_comment)

})
PostsRouter.post('/', authBasic, InputValidPosts.post, errorsChecking, async (req: Request<{}, {}, { title: string, shortDescription: string, content: string, blogId: string, blogName: string }>, res: Response) => {


    const new_post: PostsMainType = await postsServises.createPost({

        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId
    })


    return res.status(HTTP_statuses.CREATED_201).send(new_post)
})
PostsRouter.put('/:id', authBasic, InputValidPosts.put, errorsChecking, async (req: Request<{ id: string }, {}, { id: string, title: string, shortDescription: string, content: string, blogId: string, blogName: string }>, res: Response) => {

    const new_post: PostsMainType | null | undefined = await postsRepository.findPostById(req.params.id)

    if (new_post) {
        const result: PostsMainType | null = await postsServises.updatePost(req.params.id, {

            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId

        })
        res.status(HTTP_statuses.NO_CONTENT_204).send(result)
    } else
        res.sendStatus(HTTP_statuses.NOT_FOUND_404)


})
PostsRouter.delete('/:id', authBasic, async (req: Request<{ id: string }>, res: Response) => {

    const del: boolean = await postsServises.deletePost(req.params.id)

    if (!del) {
        return  res.sendStatus(HTTP_statuses.NOT_FOUND_404)
    }
    return  res.sendStatus(HTTP_statuses.NO_CONTENT_204)


})
