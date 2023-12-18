import {CommentsRepository} from "../../repositories/comments-rep";
import {QueryCommentsRepository} from "../../repositories/query/query-comments-rep";
import {CommentsServices} from "../../application/comments-services";
import {LikesServices} from "../../application/likes-services";
import {Request, Response} from "express";
import {CommentsCreateUpdate, CommentsMainType, CommentsViewType} from "../../types/comments-types";
import {HTTP_STATUSES} from "../../data/HTTP_STATUSES";

export class CommentsControllerInstance {

    constructor(protected commentsRepository: CommentsRepository,
                protected queryCommentsRepository: QueryCommentsRepository,
                protected commentsServices: CommentsServices,
                protected likesServices: LikesServices) {

    }

    async getCommentById(req: Request<{ id: string }>, res: Response) {
        const comment: CommentsViewType | null = await this.queryCommentsRepository.findCommentById(req.params.id, req.userId)

        if (!comment) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return res.status(HTTP_STATUSES.OK_200).send(comment)
    }

    async rateComment(req: Request<{ id: string }, {}, {
        likeStatus: string
    }>, res: Response) {
        const result: boolean = await this.likesServices.rateCommentOrPost(req.params.id, req.body.likeStatus, req.userId.toString(), 'Comment')

        if (!result) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

    }

    async changeComment(req: Request<{
        id: string
    }>, res: Response) {

        const comment: CommentsMainType | null = await this.commentsRepository.findCommentById(req.params.id)
        if (!comment) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

        if (req.userId !== comment.commentatorInfo.userId.toString()) return res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)

        const data: CommentsCreateUpdate = {content: req.body.content}

        const resultId: string | null = await this.commentsServices.updateComment(data, req.params.id)
        if (!resultId) return res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)

        const changeComment: CommentsViewType | null = await this.queryCommentsRepository.findCommentById(resultId, req.userId)

        return res.status(HTTP_STATUSES.NO_CONTENT_204).send(changeComment)
    }

    async deleteComment(req: Request<{
        id: string
    }>, res: Response) {
        const comment: CommentsMainType | null = await this.commentsRepository.findCommentById(req.params.id)
        if (!comment) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)


        if (req.userId !== comment.commentatorInfo.userId.toString()) return res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)

        const del: boolean = await this.commentsServices.deleteComment(req.params.id)

        if (!del) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}