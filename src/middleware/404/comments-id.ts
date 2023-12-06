import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../../data/HTTP_STATUSES";
import {CommentsRepository} from "../../repositories/comments-rep";
import {CommentsMainType} from "../../types/comments-types";

export const commentsId = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {

    const commentRep = new CommentsRepository()

    const comment:CommentsMainType|null = await commentRep.findCommentById(req.params.id)

    if (!comment) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

    return next()

}