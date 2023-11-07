import {Response, Request, Router} from "express";
import {BlogsMainType} from "../types/blogs/blogs-main-type";
import {HTTP_STATUSES} from "../data/HTTP_STATUSES";
import {InputValidBlogs, InputValidPosts} from "../middleware/arrays_of_input_validation";
import {blogsServices} from "../domain/blogs-services";
import {blogsRepository} from "../repositories/blogs-rep";
import {PostsMainType} from "../types/posts/posts-main-type";
import {getBlogsPagination, getDefaultPagination} from "../helpers/pagination.helper";
import {postsServices} from "../domain/posts-services";
import {ObjectId} from "mongodb";
import {errorsCheckingForStatus400} from "../middleware/errors_checking";
import {uriBlogIdPostsChecking} from "../middleware/input_valid/input_posts";
import {authBasic} from "../middleware/auth/auth_basic";
import {Paginated} from "../types/pagination.type";
import {reqIdValidation} from "../middleware/req_id/id_valid";

export const BlogsRouter = Router()

BlogsRouter.get('/', async (req: Request, res: Response) => {
    const pagination = getBlogsPagination(req.query)
    const blogs = await blogsRepository.findBlogs(pagination)

    return res.send(blogs)
})
BlogsRouter.get('/:id',reqIdValidation.id, errorsCheckingForStatus400, errorsCheckingForStatus400, async (req: Request<{ id: string }>, res: Response) => {

    const blog: BlogsMainType | null = await blogsRepository.findBlogById(req.params.id)

    if (!blog)
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    else
        res.send(blog)

})
BlogsRouter.get('/:id/posts',reqIdValidation.id, errorsCheckingForStatus400, uriBlogIdPostsChecking, errorsCheckingForStatus400, async (req: Request<{
    id: string
}>, res: Response) => {


    const pagination = getDefaultPagination(req.query)
    const posts: Paginated<PostsMainType> = await blogsRepository.findPostsForBlogsById(req.params.id, pagination)
    return res.status(HTTP_STATUSES.OK_200).send(posts)

})
BlogsRouter.post('/', authBasic, InputValidBlogs.post, errorsCheckingForStatus400, async (req: Request<{}, {}, {
    id: string,
    name: string,
    description: string,
    websiteUrl: string
}>, res: Response) => {

    const new_blog: BlogsMainType = await blogsServices.createBlog({
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    })

    return res.status(HTTP_STATUSES.CREATED_201).send(new_blog)
})
BlogsRouter.post('/:id/posts', authBasic, reqIdValidation.id, errorsCheckingForStatus400, InputValidPosts.postWithUriBlogId, errorsCheckingForStatus400, async (req: Request<{
    id: string
}, {}, {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}>, res: Response) => {


    const new_post: PostsMainType = await postsServices.createPost({
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: new ObjectId(req.params.id),
    })

    return res.status(HTTP_STATUSES.CREATED_201).send(new_post)


})
BlogsRouter.put('/:id', authBasic, InputValidBlogs.put, errorsCheckingForStatus400, async (req: Request<{
    id: string
}, {}, { id: string, name: string, description: string, websiteUrl: string }>, res: Response) => {

    const new_blog: BlogsMainType | null = await blogsRepository.findBlogById(req.params.id)

    if (!new_blog) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

    const result: BlogsMainType | null = await blogsServices.updateBlog(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    })
    return res.status(HTTP_STATUSES.NO_CONTENT_204).send(result)


})
BlogsRouter.delete('/:id', reqIdValidation.id, errorsCheckingForStatus400, authBasic, async (req: Request<{ id: string }>, res: Response) => {

    const del: boolean = await blogsServices.deleteBlog(req.params.id)

    if (!del) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)


})

