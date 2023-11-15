import {Response,Request, Router} from "express";
import {commentsServices} from "../domain/comments-services";
import {HTTP_STATUSES} from "../data/HTTP_STATUSES";
import {commentsRepository} from "../repositories/comments-rep";
import {CommentsCreateUpdate, CommentsMainType, CommentsViewType} from "../types/comments-types";
import {InputValidationComments} from "../middleware/arrays_of_input_validation";
import {authBearer} from "../middleware/auth/auth_bearer";
import {errorsCheckingForStatus400} from "../middleware/errors_checking";
import {reqIdValidation} from "../middleware/req_id/id_valid";
import {queryCommentsRepository} from "../repositories/query/query-comments-rep";


export const CommentsRouter = Router({})


CommentsRouter.get('/:id',reqIdValidation.id, errorsCheckingForStatus400 ,async (req:Request<{id:string}>, res:Response)=>{
    const comment: CommentsViewType|null  = await queryCommentsRepository.findCommentById(req.params.id)

    if(!comment) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    return res.status(HTTP_STATUSES.OK_200).send(comment)
})
CommentsRouter.put('/:id',  authBearer, InputValidationComments.put, errorsCheckingForStatus400, async (req:Request<{id:string}>, res:Response)=>{

    const comment: CommentsMainType|null = await commentsRepository.findCommentById(req.params.id)
    if(!comment) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)


    if(req.userId !== comment.commentatorInfo.userId.toString()) return res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)

    const data: CommentsCreateUpdate = {content:req.body.content}



    const resultId:string|null = await commentsServices.updateComment(data, req.params.id)
    if(!resultId) return res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)

    const changeComment:CommentsViewType|null = await queryCommentsRepository.findCommentById(resultId)

    return res.status(HTTP_STATUSES.NO_CONTENT_204).send(changeComment)
})
CommentsRouter.delete('/:id',reqIdValidation.id, errorsCheckingForStatus400,  authBearer, async (req:Request<{id:string}>, res:Response)=>{
    const comment: CommentsMainType|null = await commentsRepository.findCommentById(req.params.id)
    if(!comment) return  res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)


    if(req.userId !== comment.commentatorInfo.userId.toString()) return res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)

    const del: boolean = await commentsServices.deleteComment(req.params.id)

    if (!del) {
        return  res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    return  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)


})