import {Response,Request, Router} from "express";
import {commentsServises} from "../domain/comments-servises";
import {authBearer} from "../middleware/middleware_input_validation";
import {HTTP_statuses} from "../data/HTTP_statuses";
import {commentsRepository} from "../repositories/comments-rep";
import {CommentsCreateUpdate} from "../types/comments/comments-create-update";
import {UsersMainType} from "../types/users/users-main-type";
import {usersRepository} from "../repositories/users-rep";
import {CommentsMainType} from "../types/comments/comments-main-type";
import {postsServises} from "../domain/posts-servises";

export const commentsRouter = Router({})


commentsRouter.get('/:id',async (req:Request<{id:string}>, res:Response)=>{
    const comment: CommentsMainType|null  = await commentsRepository.findCommentById(req.params.id)

    if(!comment) return res.sendStatus(HTTP_statuses.NOT_FOUND_404)
    return res.status(HTTP_statuses.OK_200).send(comment)
})
commentsRouter.put('/:id',  authBearer, async (req:Request<{id:string}>, res:Response)=>{

    const comment: CommentsMainType|null = await commentsRepository.findCommentById(req.params.id)
    if(!comment) return  res.sendStatus(HTTP_statuses.NOT_FOUND_404)

    //@ts-ignore
    if(req.userId !== comment.commentatorInfo.userId) return res.sendStatus(HTTP_statuses.FORBIDDEN_403)

    const data: CommentsCreateUpdate = {content:req.body.content}


    //@ts-ignore
    const result = await commentsServises.updateComment(data, req.params.id)
    return res.status(HTTP_statuses.OK_200).send(result)
})
commentsRouter.delete('/:id',  authBearer, async (req:Request<{id:string}>, res:Response)=>{
    const comment: CommentsMainType|null = await commentsRepository.findCommentById(req.params.id)
    if(!comment) return  res.sendStatus(HTTP_statuses.NOT_FOUND_404)

    //@ts-ignore
    if(req.userId !== comment.commentatorInfo.userId) return res.sendStatus(HTTP_statuses.FORBIDDEN_403)

    const del: boolean = await commentsServises.deleteComment(req.params.id)

    if (!del) {
        return  res.sendStatus(HTTP_statuses.NOT_FOUND_404)
    }
    return  res.sendStatus(HTTP_statuses.NO_CONTENT_204)


})