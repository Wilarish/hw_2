import express, {Request, Response} from "express"
import {BlogsRouter} from "./routes/blogs-router";
import {HTTP_STATUSES} from "./data/HTTP_STATUSES";
import {PostsRouter} from "./routes/posts-router";
import {UsersRouter} from "./routes/users-router";
import {AuthRouter} from "./routes/auth-router";
import {CommentsRouter} from "./routes/comments-router";
import cookieParser from "cookie-parser";
import {SecurityRouter} from "./routes/security-router";
import {PostsRepository} from "./repositories/posts-rep";
import {BlogsRepository} from "./repositories/blogs-rep";
import {UsersRepository} from "./repositories/users-rep";



export const RouterPath = {
    blogs:'/blogs',
    posts:'/posts',
    users:'/users',
    auth:'/auth',
    comments:'/comments',
    security:'/security'
}
export function InitApp() {

    const app = express()

    app.use(cookieParser())
    app.use(express.json())


    app.use(RouterPath.blogs, BlogsRouter)
    app.use(RouterPath.posts, PostsRouter)
    app.use(RouterPath.users, UsersRouter)
    app.use(RouterPath.auth, AuthRouter)
    app.use(RouterPath.comments, CommentsRouter)
    app.use(RouterPath.security, SecurityRouter)



    app.get('/', (req:Request, res:Response) => {
        res.send('Hello World!')
    })
    app.delete('/testing/all-data',  async (req:Request, res:Response)=>{
        const postsRepository =new PostsRepository()
        const blogsRepository =new BlogsRepository()
        const usersRepository =new UsersRepository()

        await postsRepository.deleteAllPosts()
        await blogsRepository.deleteAllBlogs()
        await usersRepository.deleteAllUsers()
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    return app
}
