import {BlogsRepository} from "../../repositories/blogs-rep";
import {QueryBlogsRepository} from "../../repositories/query/query-blogs-rep";
import {BlogsServices} from "../../application/blogs-services";
import {QueryPostsRepository} from "../../repositories/query/query-posts-rep";
import {PostsServices} from "../../application/posts-services";
import {Request, Response} from "express";
import {getBlogsPagination, getDefaultPagination} from "../../helpers/pagination.helper";
import {Paginated} from "../../types/pagination.type";
import {BlogsMainType, BlogsViewType} from "../../types/blogs-types";
import {HTTP_STATUSES} from "../../data/HTTP_STATUSES";
import {PostsViewType} from "../../types/posts-types";
import {ObjectId} from "mongodb";
import "reflect-metadata"
import {injectable} from "inversify";
@injectable()
export class BlogsControllerInstance {

    constructor(protected blogsRepository: BlogsRepository,
                protected queryBlogsRepository: QueryBlogsRepository,
                protected blogsServices: BlogsServices,
                protected queryPostsRepository: QueryPostsRepository,
                protected postsServices: PostsServices) {

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

        const newPost: PostsViewType | null = await this.queryPostsRepository.queryFindPostById(new_postId, req.userId)

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