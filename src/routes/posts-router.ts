import {Router} from "express";
import {InputValidationComments, InputValidPosts} from "../middleware/arrays_of_input_validation";
import {errorsCheckingForStatus400} from "../middleware/errors_checking";
import {authBearer, authBearerWithout401} from "../middleware/auth/auth_bearer";
import {authBasic} from "../middleware/auth/auth_basic";
import {reqIdValidation} from "../middleware/req_id/id_valid";
import {container} from "../composition-root";
import {PostsControllerInstance} from "./classes-routers/posts-class";



const postsController = container.resolve(PostsControllerInstance)
export const PostsRouter = Router()

PostsRouter.get('/', authBearerWithout401, postsController.getPosts.bind(postsController))
PostsRouter.get('/:id', authBearerWithout401, reqIdValidation.id, errorsCheckingForStatus400, postsController.getPostById.bind(postsController))
PostsRouter.get('/:id/comments', authBearerWithout401, postsController.getCommentsForPost.bind(postsController))
PostsRouter.post('/:id/comments', authBearer, reqIdValidation.id, InputValidationComments.post, errorsCheckingForStatus400, postsController.createCommentForPost.bind(postsController))
PostsRouter.post('/', authBasic, InputValidPosts.post, errorsCheckingForStatus400, postsController.createPost.bind(postsController))
PostsRouter.put('/:id/like-status', authBearer, InputValidationComments.putRateCommentOrPost, errorsCheckingForStatus400, postsController.ratePost.bind(postsController))
PostsRouter.put('/:id', authBasic, InputValidPosts.put, errorsCheckingForStatus400, postsController.changePost.bind(postsController))
PostsRouter.delete('/:id', authBasic, reqIdValidation.id, errorsCheckingForStatus400, postsController.deletePost.bind(postsController))
