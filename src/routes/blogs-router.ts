import {Response, Request, Router} from "express";
import {BlogsMainType} from "../types/blogs/blogs-main-type";
import {HTTP_statuses} from "../data/HTTP_statuses";
import {authBasic, errorsChecking} from "../middleware/middleware_input_validation";
import {blogsRepository} from "../repositories/blogs-rep";
import {InputValidBlogs} from "../middleware/arrays_of_input_validation";

export const BlogsRouter = Router()

BlogsRouter.get('/', async(req: Request, res: Response) => {
    const blogs =await blogsRepository.findBlogs()

    return res.send(blogs)
})
BlogsRouter.get('/:id', errorsChecking, async (req: Request<{ id: string }>, res: Response) => {

    const blog: BlogsMainType | null = await blogsRepository.findBlogById(req.params.id)

    if (!blog)
        res.sendStatus(HTTP_statuses.NOT_FOUND_404)
    else
        res.send(blog)

})
BlogsRouter.post('/', authBasic, InputValidBlogs.post, errorsChecking, async (req: Request<{}, {}, { id: string, name: string, description: string, websiteUrl: string }>, res: Response) => {

    const new_blog: BlogsMainType = await blogsRepository.createBlog({
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    })

    res.status(HTTP_statuses.CREATED_201).send(new_blog)
})
BlogsRouter.put('/:id', authBasic, InputValidBlogs.put, errorsChecking, async (req: Request<{
    id: string
}, {}, { id: string, name: string, description: string, websiteUrl: string }>, res: Response) => {

    const new_blog: BlogsMainType | null = await blogsRepository.findBlogById(req.params.id)

    if (new_blog) {
        const result: BlogsMainType | null = await blogsRepository.updateBlog(req.params.id, {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl
        })
        res.status(HTTP_statuses.NO_CONTENT_204).send(result)
    } else
        res.sendStatus(HTTP_statuses.NOT_FOUND_404)


})
BlogsRouter.delete('/:id', authBasic, async (req: Request<{ id: string }>, res: Response) => {

    const del:boolean = await blogsRepository.deleteBlog(req.params.id)

    if (!del) {
        res.sendStatus(HTTP_statuses.NOT_FOUND_404)
    } else {
        res.sendStatus(HTTP_statuses.NO_CONTENT_204)
    }

})

