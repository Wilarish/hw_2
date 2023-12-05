import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../data/HTTP_STATUSES";
import {PostsMainType, PostsViewType} from "../types/posts-types";
import {InputValidationComments, InputValidPosts} from "../middleware/arrays_of_input_validation";
import {getDefaultPagination} from "../helpers/pagination.helper";
import {DefaultPaginationType, Paginated} from "../types/pagination.type";
import {PostsServices} from "../application/posts-services";
import {CommentsCreateUpdate, CommentsViewType} from "../types/comments-types";
import {ObjectId} from "mongodb";
import {errorsCheckingForStatus400} from "../middleware/errors_checking";
import {authBearer, authBearerWithout401} from "../middleware/auth/auth_bearer";
import {authBasic} from "../middleware/auth/auth_basic";
import {reqIdValidation} from "../middleware/req_id/id_valid";
import {QueryPostsRepository } from "../repositories/query/query-posts-rep";
import {QueryCommentsRepository } from "../repositories/query/query-comments-rep";
import {CommentsServices } from "../application/comments-services";
import {PostsRepository} from "../repositories/posts-rep";

class PostsControllerInstance {
    private postsRepository: PostsRepository;
    private postsServices: PostsServices;
    private queryPostsRepository: QueryPostsRepository;
    private queryCommentsRepository: QueryCommentsRepository;
    private commentsServices: CommentsServices;
    constructor() {
        this.postsRepository = new PostsRepository()
        this.postsServices = new PostsServices()
        this.queryPostsRepository = new QueryPostsRepository()
        this.queryCommentsRepository = new QueryCommentsRepository()
        this.commentsServices = new CommentsServices()

    }
    async getPosts(req: Request, res: Response) {
        const pagination: DefaultPaginationType = getDefaultPagination(req.query)
        const posts: Paginated<PostsViewType> = await this.queryPostsRepository.queryFindPaginatedPosts(pagination)

        return res.send(posts)
    }

    async getPostById(req: Request<{
        id: string
    }>, res: Response) {

        const post: PostsViewType | null = await this.queryPostsRepository.queryFindPostById(req.params.id)

        if (!post) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

        return res.send(post)

    }

    async getCommentsForPost(req: Request<{ id: string }>, res: Response) {

        const pagination: DefaultPaginationType = getDefaultPagination(req.query)
        const comments: Paginated<CommentsViewType> | null = await this.queryCommentsRepository.queryFindPaginatedComments(pagination, req.params.id, req.userId)

        if (!comments) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return res.status(HTTP_STATUSES.OK_200).send(comments)
    }

    async createCommentForPost(req: Request<{
        id: string
    }, {}, { content: string }>, res: Response) {

        const data: CommentsCreateUpdate = {content: req.body.content}


        const newCommentId: string | null = await this.commentsServices.createCommentForPost(req.userId, req.params.id, data)

        if (!newCommentId) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

        const comment: CommentsViewType | null = await this.queryCommentsRepository.findCommentById(newCommentId, req.userId)

        if (!newCommentId) return res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)

        return res.status(HTTP_STATUSES.CREATED_201).send(comment)

    }

    async createPost(req: Request<{}, {}, {
        title: string,
        shortDescription: string,
        content: string,
        blogId: string,
        blogName: string
    }>, res: Response) {

        const new_postId: string = await this.postsServices.createPost({

            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: new ObjectId(req.body.blogId)
        })
        if (!new_postId) return res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)

        const newPost: PostsViewType | null = await this.queryPostsRepository.queryFindPostById(new_postId)

        return res.status(HTTP_STATUSES.CREATED_201).send(newPost)
    }

    async changePost(req: Request<{
        id: string
    }, {}, {
        title: string,
        shortDescription: string,
        content: string,
        blogId: string,
    }>, res: Response) {

        const new_post: PostsMainType | null | undefined = await this.postsRepository.findPostById(req.params.id)

        if (!new_post) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

        const resultId: string | null = await this.postsServices.updatePost(req.params.id, {

            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: new ObjectId(req.body.blogId)

        })
        if (!resultId) return res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)

        const post: PostsViewType | null = await this.queryPostsRepository.queryFindPostById(resultId)

        return res.status(HTTP_STATUSES.NO_CONTENT_204).send(post)


    }

    async deletePost(req: Request<{
        id: string
    }>, res: Response) {

        const del: boolean = await this.postsServices.deletePost(req.params.id)

        if (!del) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)


    }
}

export const PostsRouter = Router()
const postsController = new PostsControllerInstance()

PostsRouter.get('/', postsController.getPosts.bind(postsController))
PostsRouter.get('/:id', reqIdValidation.id, errorsCheckingForStatus400, postsController.getPostById.bind(postsController))
PostsRouter.get('/:id/comments',authBearerWithout401, postsController.getCommentsForPost.bind(postsController))
PostsRouter.post('/:id/comments', authBearer, reqIdValidation.id, InputValidationComments.post, errorsCheckingForStatus400, postsController.createCommentForPost.bind(postsController))
PostsRouter.post('/', authBasic, InputValidPosts.post, errorsCheckingForStatus400, postsController.createPost.bind(postsController))
PostsRouter.put('/:id', authBasic, InputValidPosts.put, errorsCheckingForStatus400, postsController.changePost.bind(postsController))
PostsRouter.delete('/:id', authBasic, reqIdValidation.id, errorsCheckingForStatus400, postsController.deletePost.bind(postsController))
