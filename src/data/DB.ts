
import {MongoClient} from "mongodb";
import dotenv from 'dotenv'
import {BlogsMainType} from "../types/blogs/blogs-main-type";
import {PostsMainType} from "../types/posts/posts-main-type";

// export const DB: DBType = {
//     blogs: [{
//         id: "any_id",
//         name: "any_name",
//         description: "any_description",
//         websiteUrl: "any_websiteUrl"
//     }],
//     posts: [{
//         id: 'string',
//         title: 'string',
//         shortDescription: 'string',
//         content: 'string',
//         blogId: 'any_id',
//         blogName: 'any_name'
//     }]
// }


dotenv.config()


const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'

if(!mongoURI)
    throw new Error("!err url")
const client = new MongoClient(mongoURI)

const db= client.db()
export const blogs_db = db.collection<BlogsMainType>("blogs")
export const posts_db = db.collection<PostsMainType>("posts")

export async function RunDb() {

    try {
        await client.connect()
        await client.db().command({ping:1})

    } catch (err) {
        console.log("its error")
        await client.close()

    }
}