import express, {Request, Response} from "express"
import {BlogsRouter} from "./routes/blogs-router";
import {HTTP_statuses} from "./data/HTTP_statuses";
import {PostsRouter} from "./routes/posts-router";
import {blogs_db, posts_db} from "./data/DB";


export const app = express()

app.use(express.json())

export const RouterPath = {
    blogs:'/blogs',
    posts:'/posts'
}
app.use(RouterPath.blogs, BlogsRouter)
app.use(RouterPath.posts, PostsRouter)



app.get('/', (req:Request, res:Response) => {
    res.send('Hello World!)***(')
})
app.delete('/testing/all-data',  async (req:Request, res:Response)=>{
    await posts_db.deleteMany({})
    await blogs_db.deleteMany({})
    res.sendStatus(HTTP_statuses.NO_CONTENT_204)
})