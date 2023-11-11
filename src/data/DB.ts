import {MongoClient} from "mongodb";
import dotenv from 'dotenv'
import {BlogsMainType} from "../types/blogs-types";
import {PostsMainType} from "../types/posts-types";
import {UsersMainType} from "../types/users-types";
import {CommentsMainType} from "../types/comments-types";
import {RefreshTokenDBType} from "../types/refresh-token-DB-type";

dotenv.config()


const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017/Posts_Blogs_HW2'

if (!mongoURI)
    throw new Error("!err url")
const client = new MongoClient(mongoURI)

const db = client.db()
export const blogs_db = db.collection<BlogsMainType>("blogs")
export const posts_db = db.collection<PostsMainType>("posts")
export const users_db = db.collection<UsersMainType>("users")
export const comments_db = db.collection<CommentsMainType>("comments")
export const blackList_db = db.collection<RefreshTokenDBType>("blackList")

export async function RunDb() {

    try {
        await client.connect()
        await client.db().command({ping: 1})
        console.log('Db connect')

    } catch (err) {
        console.log("its error", err)
        await client.close()

    }
}