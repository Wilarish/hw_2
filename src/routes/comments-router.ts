import {Router} from "express";
import {InputValidationComments} from "../middleware/arrays_of_input_validation";
import {authBearer, authBearerWithout401} from "../middleware/auth/auth_bearer";
import {errorsCheckingForStatus400} from "../middleware/errors_checking";
import {reqIdValidation} from "../middleware/req_id/id_valid";
import {commentsId} from "../middleware/404/comments-id";
import {container} from "../composition-root";
import {CommentsControllerInstance} from "./classes-routers/comments-class";

const commentsController = container.resolve(CommentsControllerInstance)
export const CommentsRouter = Router({})


CommentsRouter.get('/:id', authBearerWithout401, reqIdValidation.id, errorsCheckingForStatus400, commentsController.getCommentById.bind(commentsController))
CommentsRouter.put('/:id/like-status', authBearer, commentsId, InputValidationComments.putRateCommentOrPost, errorsCheckingForStatus400, commentsController.rateComment.bind(commentsController))
CommentsRouter.put('/:id', authBearer, InputValidationComments.put, errorsCheckingForStatus400, commentsController.changeComment.bind(commentsController))
CommentsRouter.delete('/:id', reqIdValidation.id, errorsCheckingForStatus400, authBearer, commentsController.deleteComment.bind(commentsController))