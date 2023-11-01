import express, {Request, Response} from "express"
import {BlogsRouter} from "./routes/blogs-router";
import {HTTP_STATUSES} from "./data/HTTP_STATUSES";
import {PostsRouter} from "./routes/posts-router";
import {postsRepository} from "./repositories/posts-rep";
import {blogsRepository} from "./repositories/blogs-rep";
import {UsersRouter} from "./routes/users-router";
import {AuthRouter} from "./routes/auth-router";
import {usersRepository} from "./repositories/users-rep";
import {commentsRouter} from "./routes/comments-router";


export const app = express()

app.use(express.json())

export const RouterPath = {
    blogs:'/blogs',
    posts:'/posts',
    users:'/users',
    auth:'/auth',
    comments:'/comments'
}
app.use(RouterPath.blogs, BlogsRouter)
app.use(RouterPath.posts, PostsRouter)
app.use(RouterPath.users, UsersRouter)
app.use(RouterPath.auth, AuthRouter)
app.use(RouterPath.comments, commentsRouter)



app.get('/', (req:Request, res:Response) => {
    res.send('Hello World!)***(')
})
app.delete('/testing/all-data',  async (req:Request, res:Response)=>{
    await postsRepository.deleteAllPosts()
    await blogsRepository.deleteAllBlogs()
    await usersRepository.deleteAllUsers()
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})