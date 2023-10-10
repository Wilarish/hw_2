import  {Response, Request, Router} from "express";
import {BlogsMainType} from "../types/blogs/blogs-main-type";
import {HTTP_statuses} from "../data/HTTP_statuses";
import {authBasic, errorsChecking} from "../middleware/middleware_input_validation";
import {InputValidBlogs, InputValidPosts} from "../middleware/arrays_of_input_validation";
import {blogsServise} from "../domain/blogs-servise";
import {blogsRepository} from "../repositories/blogs-rep";
import {postsRepository} from "../repositories/posts-rep";
import {PostsMainType} from "../types/posts/posts-main-type";
import {getBlogsPagination, getDefaultPagination} from "../helpers/pagination.helper";

export const BlogsRouter = Router()

BlogsRouter.get('/', async(req: Request, res: Response) => {
    const pagination = getBlogsPagination(req.query)
    const blogs = await blogsRepository.findBlogs(pagination)

    return res.send(blogs)
})
BlogsRouter.get('/:id', errorsChecking, async (req: Request<{ id: string }>, res: Response) => {

    const blog: BlogsMainType | null = await blogsServise.findBlogById(req.params.id)

    if (!blog)
        res.sendStatus(HTTP_statuses.NOT_FOUND_404)
    else
        res.send(blog)

})
BlogsRouter.get('/:id/posts', errorsChecking, async (req: Request<{id: string}>, res:Response)=>{

    // const blog = await blogsRepository.findBlogById(req.params.id)
    // if(!blog) res.sendStatus(HTTP_statuses.NOT_FOUND_404)

    const pagination = getDefaultPagination(req.query)
    const posts =  await blogsRepository.findPostsForBlogsById(req.params.id, pagination)
    res.status(HTTP_statuses.OK_200).send(posts)

})
BlogsRouter.post('/', authBasic, InputValidBlogs.post, errorsChecking, async (req: Request<{}, {}, { id: string, name: string, description: string, websiteUrl: string }>, res: Response) => {

    const new_blog: BlogsMainType = await blogsServise.createBlog({
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    })

    res.status(HTTP_statuses.CREATED_201).send(new_blog)
})
BlogsRouter.post('/:id/posts', authBasic, InputValidPosts.post_NoBlogId, errorsChecking, async (req: Request<{
    id: string }, {}, { title: string, shortDescription: string, content: string, blogId: string, blogName: string }>, res: Response)=>{

    const blog = await blogsRepository.findBlogById(req.params.id)
    if(!blog) return res.sendStatus(HTTP_statuses.NOT_FOUND_404)

    const  new_post:PostsMainType =  await postsRepository.createPost({
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.params.id,
    })

    return res.status(HTTP_statuses.CREATED_201).send(new_post)


})
BlogsRouter.put('/:id', authBasic, InputValidBlogs.put, errorsChecking, async (req: Request<{
    id: string
}, {}, { id: string, name: string, description: string, websiteUrl: string }>, res: Response) => {

    const new_blog: BlogsMainType | null = await blogsServise.findBlogById(req.params.id)

    if (new_blog) {
        const result: BlogsMainType | null = await blogsServise.updateBlog(req.params.id, {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl
        })
        res.status(HTTP_statuses.NO_CONTENT_204).send(result)
    } else
        res.sendStatus(HTTP_statuses.NOT_FOUND_404)


})
BlogsRouter.delete('/:id', authBasic, async (req: Request<{ id: string }>, res: Response) => {

    const del:boolean = await blogsServise.deleteBlog(req.params.id)

    if (!del) {
        res.sendStatus(HTTP_statuses.NOT_FOUND_404)
    } else {
        res.sendStatus(HTTP_statuses.NO_CONTENT_204)
    }

})

