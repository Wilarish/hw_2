import {Response, Request, Router} from "express";
import {BlogsMainType, BlogsViewType} from "../types/blogs-types";
import {HTTP_STATUSES} from "../data/HTTP_STATUSES";
import {InputValidBlogs, InputValidPosts} from "../middleware/arrays_of_input_validation";
import {PostsViewType} from "../types/posts-types";
import {getBlogsPagination, getDefaultPagination} from "../helpers/pagination.helper";
import {ObjectId} from "mongodb";
import {errorsCheckingForStatus400} from "../middleware/errors_checking";
import {uriBlogIdPostsChecking} from "../middleware/input_valid/input_posts";
import {authBasic} from "../middleware/auth/auth_basic";
import {Paginated} from "../types/pagination.type";
import {reqIdValidation} from "../middleware/req_id/id_valid";
import {BlogsRepository} from "../repositories/blogs-rep";
import {QueryBlogsRepository} from "../repositories/query/query-blogs-rep";
import {BlogsServices} from "../application/blogs-services";
import {PostsServices} from "../application/posts-services";
import {QueryPostsRepository} from "../repositories/query/query-posts-rep";
import {authBearerWithout401} from "../middleware/auth/auth_bearer";


class BlogsControllerInstance {
    private blogsRepository: BlogsRepository;
    private queryBlogsRepository: QueryBlogsRepository;
    private blogsServices: BlogsServices;
    private queryPostsRepository: QueryPostsRepository;
    private postsServices: PostsServices;
    constructor() {
        this.blogsRepository = new BlogsRepository()
        this.queryBlogsRepository = new QueryBlogsRepository()
        this.blogsServices = new BlogsServices()
        this.postsServices = new PostsServices()
        this.queryPostsRepository = new QueryPostsRepository()
    }
    async getBlogs(req: Request, res: Response) {
        const pagination = getBlogsPagination(req.query)
        const blogs: Paginated<BlogsViewType> = await this.queryBlogsRepository.queryFindPaginatedBlogs(pagination)

        return res.send(blogs)
    }

    async getBlogById(req: Request<{
        id: string
    }>, res: Response) {

        const blog: BlogsViewType | null = await this.queryBlogsRepository.queryFindBlogById(req.params.id)

        if (!blog)
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        else
            res.send(blog)

    }

    async getPostsForBlog(req: Request<{
        id: string
    }>, res: Response) {


        const pagination = getDefaultPagination(req.query)
        const posts: Paginated<PostsViewType> = await this.queryBlogsRepository.queryFindPaginatedPostsForBlogsById(req.params.id, pagination, req.userId)
        return res.status(HTTP_STATUSES.OK_200).send(posts)

    }

    async createBlog(req: Request<{}, {}, {
        id: string,
        name: string,
        description: string,
        websiteUrl: string
    }>, res: Response) {

        const idOfCreatedBlog: string = await this.blogsServices.createBlog({
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl
        })
        if (!idOfCreatedBlog) return res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)

        const blog: BlogsViewType | null = await this.queryBlogsRepository.queryFindBlogById(idOfCreatedBlog)

        return res.status(HTTP_STATUSES.CREATED_201).send(blog)
    }

    async createPostForBlog(req: Request<{
        id: string
    }, {}, {
        title: string,
        shortDescription: string,
        content: string,
        blogId: string,
        blogName: string
    }>, res: Response) {

        const new_postId: string | null = await this.postsServices.createPost({
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: new ObjectId(req.params.id),
        })
        if (!new_postId) return res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)

        const newPost: PostsViewType | null = await this.queryPostsRepository.queryFindPostById(new_postId,req.userId)

        return res.status(HTTP_STATUSES.CREATED_201).send(newPost)
    }

    async changeBlog(req: Request<{
        id: string
    }, {}, { id: string, name: string, description: string, websiteUrl: string }>, res: Response) {

        const new_blog: BlogsMainType | null = await this.blogsRepository.findBlogById(req.params.id)

        if (!new_blog) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

        const result: boolean = await this.blogsServices.updateBlog(req.params.id, {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl
        })
        if (!result) return res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)

        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async deleteBlog(req: Request<{
        id: string
    }>, res: Response) {

        const del: boolean = await this.blogsServices.deleteBlog(req.params.id)

        if (!del) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}

export const BlogsRouter = Router()
const blogsController = new BlogsControllerInstance()

BlogsRouter.get('/', blogsController.getBlogs.bind(blogsController))
BlogsRouter.get('/:id', reqIdValidation.id, errorsCheckingForStatus400, errorsCheckingForStatus400, blogsController.getBlogById.bind(blogsController))
BlogsRouter.get('/:id/posts',authBearerWithout401, reqIdValidation.id, errorsCheckingForStatus400, uriBlogIdPostsChecking, errorsCheckingForStatus400, blogsController.getPostsForBlog.bind(blogsController))
BlogsRouter.post('/', authBasic, InputValidBlogs.post, errorsCheckingForStatus400, blogsController.createBlog.bind(blogsController))
BlogsRouter.post('/:id/posts',authBearerWithout401, authBasic, reqIdValidation.id, errorsCheckingForStatus400, InputValidPosts.postWithUriBlogId, errorsCheckingForStatus400, blogsController.createPostForBlog.bind(blogsController))
BlogsRouter.put('/:id', authBasic, InputValidBlogs.put, errorsCheckingForStatus400, blogsController.changeBlog.bind(blogsController))
BlogsRouter.delete('/:id', reqIdValidation.id, errorsCheckingForStatus400, authBasic, blogsController.deleteBlog.bind(blogsController))

