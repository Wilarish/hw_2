import {Response, Request, Router} from "express";
import {HTTP_STATUSES} from "../data/HTTP_STATUSES";
import {CommentsCreateUpdate, CommentsMainType, CommentsViewType} from "../types/comments-types";
import {InputValidationComments} from "../middleware/arrays_of_input_validation";
import {authBearer, authBearerWithout401} from "../middleware/auth/auth_bearer";
import {errorsCheckingForStatus400} from "../middleware/errors_checking";
import {reqIdValidation} from "../middleware/req_id/id_valid";
import {CheckJwtToken} from "../middleware/auth/refresh_token";
import {CommentsRepository} from "../repositories/comments-rep";
import {QueryCommentsRepository} from "../repositories/query/query-comments-rep";
import {CommentsServices} from "../application/comments-services";
import {commentsId} from "../middleware/404/comments-id";

class CommentsControllerInstance {
    private commentsRepository: CommentsRepository;
    private queryCommentsRepository: QueryCommentsRepository;
    private commentsServices: CommentsServices;
    constructor() {
        this.commentsRepository = new CommentsRepository()
        this.queryCommentsRepository = new QueryCommentsRepository()
        this.commentsServices = new CommentsServices()
    }
    async getCommentById(req: Request<{ id: string }>, res: Response) {
        const comment: CommentsViewType | null = await this.queryCommentsRepository.findCommentById(req.params.id, req.userId)

        if (!comment) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return res.status(HTTP_STATUSES.OK_200).send(comment)
    }

    async rateComment(req: Request<{ id: string }, {}, {
        likeStatus: string
    }>, res: Response) {
        const result = this.commentsServices.rateComment(req.params.id, req.body.likeStatus, req.userId.toString())

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


export const CommentsRouter = Router({})
const commentsController = new CommentsControllerInstance()


CommentsRouter.get('/:id', authBearerWithout401, reqIdValidation.id, errorsCheckingForStatus400,  commentsController.getCommentById.bind(commentsController))
CommentsRouter.put('/:id/like-status',commentsId, CheckJwtToken.rT,InputValidationComments.putRateComment,errorsCheckingForStatus400, commentsController.rateComment.bind(commentsController))
CommentsRouter.put('/:id', authBearer, InputValidationComments.put, errorsCheckingForStatus400, commentsController.changeComment.bind(commentsController))
CommentsRouter.delete('/:id', reqIdValidation.id, errorsCheckingForStatus400, authBearer, commentsController.deleteComment.bind(commentsController))