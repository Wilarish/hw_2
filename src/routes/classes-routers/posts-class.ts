import {PostsRepository} from "../../repositories/posts-rep";
import {PostsServices} from "../../application/posts-services";
import {QueryPostsRepository} from "../../repositories/query/query-posts-rep";
import {QueryCommentsRepository} from "../../repositories/query/query-comments-rep";
import {CommentsServices} from "../../application/comments-services";
import {LikesServices} from "../../application/likes-services";
import {Request, Response} from "express";
import {DefaultPaginationType, Paginated} from "../../types/pagination.type";
import {getDefaultPagination} from "../../helpers/pagination.helper";
import {PostsMainType, PostsViewType} from "../../types/posts-types";
import {HTTP_STATUSES} from "../../data/HTTP_STATUSES";
import {CommentsCreateUpdate, CommentsViewType} from "../../types/comments-types";
import {ObjectId} from "mongodb";
import {likeTypes} from "../../types/likes-types";
import "reflect-metadata"
import {injectable} from "inversify";
@injectable()
export class PostsControllerInstance {

    constructor(protected postsRepository: PostsRepository,
                protected postsServices: PostsServices,
                protected queryPostsRepository: QueryPostsRepository,
                protected queryCommentsRepository: QueryCommentsRepository,
                protected commentsServices: CommentsServices,
                protected likesServices: LikesServices) {
    }

    async getPosts(req: Request, res: Response) {
        const pagination: DefaultPaginationType = getDefaultPagination(req.query)
        const posts: Paginated<PostsViewType> = await this.queryPostsRepository.queryFindPaginatedPosts(pagination, req.userId)

        return res.send(posts)
    }

    async getPostById(req: Request<{
        id: string
    }>, res: Response) {

        const post: PostsViewType | null = await this.queryPostsRepository.queryFindPostById(req.params.id, req.userId)

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

        const newPost: PostsViewType | null = await this.queryPostsRepository.queryFindPostById(new_postId, undefined)

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

        const post: PostsViewType | null = await this.queryPostsRepository.queryFindPostById(resultId, undefined)

        return res.status(HTTP_STATUSES.NO_CONTENT_204).send(post)


    }

    async ratePost(req: Request<{ id: string }, {}, {
        likeStatus: string
    }>, res: Response) {
        const result: boolean = await this.likesServices.rateCommentOrPost(req.params.id, req.body.likeStatus, req.userId.toString(), likeTypes[likeTypes.Post])

        if (!result) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
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