import {Response,Request, Router} from "express";
import {commentsServises} from "../domain/comments-servises";
import {authBearer} from "../middleware/middleware_input_validation";
import {HTTP_statuses} from "../data/HTTP_statuses";

export const commentsRouter = Router({})

commentsRouter.post('/',  authBearer, async (req:Request, res:Response)=>{

    //@ts-ignore

    const newComment = commentsServises.updateComment(req.body, req.userId)
    return res.status(HTTP_statuses.OK_200).send(newComment)
})