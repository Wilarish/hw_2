
import {MongoClient} from "mongodb";
import dotenv from 'dotenv'
import {BlogsMainType} from "../types/blogs/blogs-main-type";
import {PostsMainType} from "../types/posts/posts-main-type";
import {UsersMainType} from "../types/users/users-main-type";
import {CommentsMainType} from "../types/comments/comments-main-type";

dotenv.config()


const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017/Posts_Blogs_HW2'

if(!mongoURI)
    throw new Error("!err url")
const client = new MongoClient(mongoURI)

const db= client.db()
export const blogs_db = db.collection<BlogsMainType>("blogs")
export const posts_db = db.collection<PostsMainType>("posts")
export const users_db = db.collection<UsersMainType>("users")
export const comments_db = db.collection<CommentsMainType>("comments")

export async function RunDb() {

    try {
        await client.connect()
        await client.db().command({ping:1})
        console.log('Db connect')

    } catch (err) {
        console.log("its error", err)
        await client.close()

    }
}