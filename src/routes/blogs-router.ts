import {Response, Request, Router} from "express";
import {BlogsMainType, BlogsViewType} from "../types/blogs-types";
import {HTTP_STATUSES} from "../data/HTTP_STATUSES";
import {InputValidBlogs, InputValidPosts} from "../middleware/arrays_of_input_validation";
import {blogsServices} from "../domain/blogs-services";
import {blogsRepository} from "../repositories/blogs-rep";
import {PostsViewType} from "../types/posts-types";
import {getBlogsPagination, getDefaultPagination} from "../helpers/pagination.helper";
import {postsServices} from "../domain/posts-services";
import {ObjectId} from "mongodb";
import {errorsCheckingForStatus400} from "../middleware/errors_checking";
import {uriBlogIdPostsChecking} from "../middleware/input_valid/input_posts";
import {authBasic} from "../middleware/auth/auth_basic";
import {Paginated} from "../types/pagination.type";
import {reqIdValidation} from "../middleware/req_id/id_valid";
import {queryBlogsRepository} from "../repositories/query/query-blogs-rep";
import {queryPostsRepository} from "../repositories/query/query-posts-rep";


export const BlogsRouter = Router()

BlogsRouter.get('/', async (req: Request, res: Response) => {
    const pagination = getBlogsPagination(req.query)
    const blogs: Paginated<BlogsViewType> = await queryBlogsRepository.queryFindPaginatedBlogs(pagination)

    return res.send(blogs)
})
BlogsRouter.get('/:id', reqIdValidation.id, errorsCheckingForStatus400, errorsCheckingForStatus400, async (req: Request<{
    id: string
}>, res: Response) => {

    const blog: BlogsViewType | null = await queryBlogsRepository.queryFindBlogById(req.params.id)

    if (!blog)
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    else
        res.send(blog)

})
BlogsRouter.get('/:id/posts', reqIdValidation.id, errorsCheckingForStatus400, uriBlogIdPostsChecking, errorsCheckingForStatus400, async (req: Request<{
    id: string
}>, res: Response) => {


    const pagination = getDefaultPagination(req.query)
    const posts: Paginated<PostsViewType> = await queryBlogsRepository.queryFindPaginatedPostsForBlogsById(req.params.id, pagination)
    return res.status(HTTP_STATUSES.OK_200).send(posts)

})
BlogsRouter.post('/', authBasic, InputValidBlogs.post, errorsCheckingForStatus400, async (req: Request<{}, {}, {
    id: string,
    name: string,
    description: string,
    websiteUrl: string
}>, res: Response) => {

    const idOfCreatedBlog: string = await blogsServices.createBlog({
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    })
    if (!idOfCreatedBlog) return res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)

    const blog: BlogsViewType | null = await queryBlogsRepository.queryFindBlogById(idOfCreatedBlog)

    return res.status(HTTP_STATUSES.CREATED_201).send(blog)
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


    const new_postId: string | null = await postsServices.createPost({
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: new ObjectId(req.params.id),
    })
    if (!new_postId) return res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)

    const newPost: PostsViewType | null = await queryPostsRepository.queryFindPostById(new_postId)

    return res.status(HTTP_STATUSES.CREATED_201).send(newPost)


})
BlogsRouter.put('/:id', authBasic, InputValidBlogs.put, errorsCheckingForStatus400, async (req: Request<{
    id: string
}, {}, { id: string, name: string, description: string, websiteUrl: string }>, res: Response) => {

    const new_blog: BlogsMainType | null = await blogsRepository.findBlogById(req.params.id)

    if (!new_blog) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

    const result: boolean = await blogsServices.updateBlog(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    })
    if (!result) return res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)


})
BlogsRouter.delete('/:id', reqIdValidation.id, errorsCheckingForStatus400, authBasic, async (req: Request<{
    id: string
}>, res: Response) => {

    const del: boolean = await blogsServices.deleteBlog(req.params.id)

    if (!del) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)


})

