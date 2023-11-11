import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../data/HTTP_STATUSES";
import {PostsMainType, PostsViewType} from "../types/posts-types";
import {postsRepository} from "../repositories/posts-rep";
import {InputValidationComments, InputValidPosts} from "../middleware/arrays_of_input_validation";
import {getDefaultPagination} from "../helpers/pagination.helper";
import {DefaultPaginationType, Paginated} from "../types/pagination.type";
import {postsServices} from "../domain/posts-services";
import {CommentsCreateUpdate, CommentsMainType, CommentsViewType} from "../types/comments-types";
import {ObjectId} from "mongodb";
import {errorsCheckingForStatus400} from "../middleware/errors_checking";
import {authBearer} from "../middleware/auth/auth_bearer";
import {authBasic} from "../middleware/auth/auth_basic";
import {reqIdValidation} from "../middleware/req_id/id_valid";
import {queryPostsRepository} from "../repositories/query/query-posts-rep";
import {queryCommentsRepository} from "../repositories/query/query-comments-rep";


export const PostsRouter = Router()

PostsRouter.get('/', async (req: Request, res: Response) => {
    const pagination: DefaultPaginationType = getDefaultPagination(req.query)
    const posts: Paginated<PostsViewType> = await queryPostsRepository.queryFindPaginatedPosts(pagination)

    return res.send(posts)
})
PostsRouter.get('/:id', reqIdValidation.id, errorsCheckingForStatus400, async (req: Request<{
    id: string
}>, res: Response) => {

    const post: PostsViewType | null = await queryPostsRepository.queryFindPostById(req.params.id)

    if (!post) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

    return res.send(post)

})
PostsRouter.get('/:id/comments', async (req: Request<{ id: string }>, res: Response) => {

    const pagination: DefaultPaginationType = getDefaultPagination(req.query)
    const comments: Paginated<CommentsViewType> | null = await queryCommentsRepository.queryFindPaginatedComments(pagination, req.params.id)

    if (!comments) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    return res.status(HTTP_STATUSES.OK_200).send(comments)
})
PostsRouter.post('/:id/comments', authBearer, reqIdValidation.id, InputValidationComments.post, errorsCheckingForStatus400, async (req: Request<{
    id: string
}, {}, { content: string }>, res: Response) => {

    const data: CommentsCreateUpdate = {content: req.body.content}


    const newCommentId: string|null = await postsServices.createCommentForPost(req.userId, req.params.id, data)

    if (!newCommentId) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

    const comment:CommentsViewType|null = await queryCommentsRepository.findCommentById(newCommentId)

    if (!newCommentId) return res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)

    return res.status(HTTP_STATUSES.CREATED_201).send(comment)

})
PostsRouter.post('/', authBasic, InputValidPosts.post, errorsCheckingForStatus400, async (req: Request<{}, {}, {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}>, res: Response) => {


    const new_postId: string = await postsServices.createPost({

        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: new ObjectId(req.body.blogId)
    })
    if(!new_postId) return  res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)

    const newPost:PostsViewType|null = await queryPostsRepository.queryFindPostById(new_postId)

    return res.status(HTTP_STATUSES.CREATED_201).send(newPost)
})
PostsRouter.put('/:id', authBasic, InputValidPosts.put, errorsCheckingForStatus400, async (req: Request<{
    id: string
}, {}, {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}>, res: Response) => {

    const new_post: PostsMainType | null | undefined = await postsRepository.findPostById(req.params.id)

    if (!new_post) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

    const resultId: string | null = await postsServices.updatePost(req.params.id, {

        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: new ObjectId(req.body.blogId)

    })
    if (!resultId) return res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)

    const post: PostsViewType | null = await queryPostsRepository.queryFindPostById(resultId)

    return res.status(HTTP_STATUSES.NO_CONTENT_204).send(post)


})
PostsRouter.delete('/:id', authBasic, reqIdValidation.id, errorsCheckingForStatus400, async (req: Request<{
    id: string
}>, res: Response) => {

    const del: boolean = await postsServices.deletePost(req.params.id)

    if (!del) {
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)


})
