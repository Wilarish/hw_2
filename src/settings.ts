import express, {Request, Response} from "express"
import {BlogsRouter} from "./routes/blogs-router";
import {HTTP_statuses} from "./data/HTTP_statuses";
import {PostsRouter} from "./routes/posts-router";
import {blogs_db, posts_db} from "./data/DB";
import {postsRepository} from "./repositories/posts-rep";
import {blogsRepository} from "./repositories/blogs-rep";
import {UsersRouter} from "./routes/users-router";


export const app = express()

app.use(express.json())

export const RouterPath = {
    blogs:'/blogs',
    posts:'/posts',
    users:'/users'
}
app.use(RouterPath.blogs, BlogsRouter)
app.use(RouterPath.posts, PostsRouter)
app.use(RouterPath.users, UsersRouter)



app.get('/', (req:Request, res:Response) => {
    res.send('Hello World!)***(')
})
app.delete('/testing/all-data',  async (req:Request, res:Response)=>{
    await postsRepository.deleteAllPosts()
    await blogsRepository.deleteAllBlogs()
    res.sendStatus(HTTP_statuses.NO_CONTENT_204)
})