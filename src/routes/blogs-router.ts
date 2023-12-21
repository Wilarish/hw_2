import {Router} from "express";
import {InputValidBlogs, InputValidPosts} from "../middleware/arrays_of_input_validation";
import {errorsCheckingForStatus400} from "../middleware/errors_checking";
import {uriBlogIdPostsChecking} from "../middleware/input_valid/input_posts";
import {authBasic} from "../middleware/auth/auth_basic";
import {reqIdValidation} from "../middleware/req_id/id_valid";
import {authBearerWithout401} from "../middleware/auth/auth_bearer";
import {container} from "../composition-root";
import {BlogsControllerInstance} from "./classes-routers/blogs-class";



const blogsController = container.resolve(BlogsControllerInstance)

export const BlogsRouter = Router()

BlogsRouter.get('/', blogsController.getBlogs.bind(blogsController))
BlogsRouter.get('/:id', reqIdValidation.id, errorsCheckingForStatus400, errorsCheckingForStatus400, blogsController.getBlogById.bind(blogsController))
BlogsRouter.get('/:id/posts', authBearerWithout401, reqIdValidation.id, errorsCheckingForStatus400, uriBlogIdPostsChecking, errorsCheckingForStatus400, blogsController.getPostsForBlog.bind(blogsController))
BlogsRouter.post('/', authBasic, InputValidBlogs.post, errorsCheckingForStatus400, blogsController.createBlog.bind(blogsController))
BlogsRouter.post('/:id/posts', authBearerWithout401, authBasic, reqIdValidation.id, errorsCheckingForStatus400, InputValidPosts.postWithUriBlogId, errorsCheckingForStatus400, blogsController.createPostForBlog.bind(blogsController))
BlogsRouter.put('/:id', authBasic, InputValidBlogs.put, errorsCheckingForStatus400, blogsController.changeBlog.bind(blogsController))
BlogsRouter.delete('/:id', reqIdValidation.id, errorsCheckingForStatus400, authBasic, blogsController.deleteBlog.bind(blogsController))

