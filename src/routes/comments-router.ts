import {Response,Request, Router} from "express";
import {commentsServices} from "../domain/comments-services";
import {HTTP_STATUSES} from "../data/HTTP_STATUSES";
import {commentsRepository} from "../repositories/comments-rep";
import {CommentsCreateUpdate} from "../types/comments/comments-create-update";
import {CommentsMainType} from "../types/comments/comments-main-type";
import {InputValidationComments} from "../middleware/arrays_of_input_validation";
import {authBearer} from "../middleware/auth/auth_bearer";
import {errorsChecking} from "../middleware/errors_checking";
import {reqIdValidation} from "../middleware/req_id/id_valid";


export const commentsRouter = Router({})


commentsRouter.get('/:id',reqIdValidation.id, errorsChecking ,async (req:Request<{id:string}>, res:Response)=>{
    const comment: CommentsMainType|null  = await commentsRepository.findCommentById(req.params.id)

    if(!comment) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    return res.status(HTTP_STATUSES.OK_200).send(comment)
})
commentsRouter.put('/:id',  authBearer, InputValidationComments.put, errorsChecking, async (req:Request<{id:string}>, res:Response)=>{

    const comment: CommentsMainType|null = await commentsRepository.findCommentById(req.params.id)
    if(!comment) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)


    if(req.userId !== comment.commentatorInfo.userId.toString()) return res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)

    const data: CommentsCreateUpdate = {content:req.body.content}



    const result:CommentsMainType|null = await commentsServices.updateComment(data, req.params.id)
    return res.status(HTTP_STATUSES.NO_CONTENT_204).send(result)
})
commentsRouter.delete('/:id',reqIdValidation.id, errorsChecking,  authBearer, async (req:Request<{id:string}>, res:Response)=>{
    const comment: CommentsMainType|null = await commentsRepository.findCommentById(req.params.id)
    if(!comment) return  res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)


    if(req.userId !== comment.commentatorInfo.userId.toString()) return res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)

    const del: boolean = await commentsServices.deleteComment(req.params.id)

    if (!del) {
        return  res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    return  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)


})