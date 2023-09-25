import express, {Request, Response} from "express"
import {BlogsRouter} from "./routes/blogs-router";
import {DB} from "./data/DB";
import {HTTP_statuses} from "./data/HTTP_statuses";
import {PostsRouter} from "./routes/posts-router";

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
app.delete('/testing/all-data',(req:Request, res:Response)=>{
    DB.blogs = []
    DB.posts = []
    res.sendStatus(HTTP_statuses.NO_CONTENT_204)
})