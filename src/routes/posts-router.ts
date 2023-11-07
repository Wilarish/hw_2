import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../data/HTTP_STATUSES";
import {PostsMainType} from "../types/posts/posts-main-type";
import {postsRepository} from "../repositories/posts-rep";
import {InputValidationComments, InputValidPosts} from "../middleware/arrays_of_input_validation";
import {getDefaultPagination} from "../helpers/pagination.helper";
import {DefaultPaginationType, Paginated} from "../types/pagination.type";
import {postsServices} from "../domain/posts-services";
import {CommentsCreateUpdate} from "../types/comments/comments-create-update";
import {CommentsMainType} from "../types/comments/comments-main-type";
import {commentsRepository} from "../repositories/comments-rep";
import {ObjectId} from "mongodb";
import {errorsCheckingForStatus400} from "../middleware/errors_checking";
import {authBearer} from "../middleware/auth/auth_bearer";
import {authBasic} from "../middleware/auth/auth_basic";
import {reqIdValidation} from "../middleware/req_id/id_valid";


export const PostsRouter = Router()

PostsRouter.get('/', async (req: Request, res: Response) => {
    const pagination: DefaultPaginationType = getDefaultPagination(req.query)
    const posts: Paginated<PostsMainType> = await postsRepository.findPosts(pagination)

    return res.send(posts)
})
PostsRouter.get('/:id',reqIdValidation.id,  errorsCheckingForStatus400, async (req: Request<{ id: string }>, res: Response) => {

    const post: PostsMainType | null = await postsRepository.findPostById(req.params.id)

    if (!post) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

    return res.send(post)

})
PostsRouter.get('/:id/comments', async (req: Request<{ id: string }>, res: Response) => {

    const pagination: DefaultPaginationType = getDefaultPagination(req.query)
    const comments: Paginated<CommentsMainType> | null = await commentsRepository.findComments(pagination, req.params.id)

    if (!comments) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    return res.status(HTTP_STATUSES.OK_200).send(comments)
})
PostsRouter.post('/:id/comments', authBearer,reqIdValidation.id, InputValidationComments.post, errorsCheckingForStatus400, async (req: Request<{
    id: string
}, {}, { content: string }>, res: Response) => {

    const data: CommentsCreateUpdate = {content: req.body.content}


    const new_comment: CommentsMainType | null = await postsServices.createCommentForPost(req.userId, req.params.id, data)

    if (!new_comment) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    return res.status(HTTP_STATUSES.CREATED_201).send(new_comment)

})
PostsRouter.post('/', authBasic, InputValidPosts.post, errorsCheckingForStatus400, async (req: Request<{}, {}, {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}>, res: Response) => {


    const new_post: PostsMainType = await postsServices.createPost({

        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: new ObjectId(req.body.blogId)
    })


    return res.status(HTTP_STATUSES.CREATED_201).send(new_post)
})
PostsRouter.put('/:id', authBasic, InputValidPosts.put, errorsCheckingForStatus400, async (req: Request<{ id: string }, {}, {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}>, res: Response) => {

    const new_post: PostsMainType | null | undefined = await postsRepository.findPostById(req.params.id)

    if (!new_post) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    const result: PostsMainType | null = await postsServices.updatePost(req.params.id, {

        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: new ObjectId(req.body.blogId)

    })
    return res.status(HTTP_STATUSES.NO_CONTENT_204).send(result)


})
PostsRouter.delete('/:id', authBasic,reqIdValidation.id, errorsCheckingForStatus400, async (req: Request<{ id: string }>, res: Response) => {

    const del: boolean = await postsServices.deletePost(req.params.id)

    if (!del) {
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)


})
