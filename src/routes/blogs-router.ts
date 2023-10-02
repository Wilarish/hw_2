import {Response, Request, Router} from "express";
import {blogs_db} from "../data/DB";
import {BlogsMainType} from "../types/blogs/blogs-main-type";
import {HTTP_statuses} from "../data/HTTP_statuses";
import {authBasic, errorsChecking, paramsCheckingBlogs} from "../middleware/middleware_input_validation";
import {blogsRepository} from "../repositories/blogs-rep";
import {InputValidBlogs} from "../middleware/arrays_of_input_validation";

export const BlogsRouter = Router()

BlogsRouter.get('/', async(req: Request, res: Response) => {
    const blogs = await blogs_db.find({}, {projection: {_id: 0}}).toArray();

    return res.status(200).send(blogs)
})
BlogsRouter.get('/:id', errorsChecking, async (req: Request<{ id: string }>, res: Response) => {

    const blog: BlogsMainType | null = await blogsRepository.findBlog(req.params.id)

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

    const new_blog: BlogsMainType | null = await blogsRepository.findBlog(req.params.id)

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

