import {MongoClient} from "mongodb";
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import {BlogsSchema} from "../types/blogs-types";
import {PostsMainType, PostsSchema} from "../types/posts-types";
import {UsersMainType, UsersSchema} from "../types/users-types";
import {CommentsMainType, CommentsSchema} from "../types/comments-types";
import {DeviceMainType, DevicesSchema} from "../types/devices-types";
import {RateLimitSchema, RateLimitType} from "../types/rateLimit-types";

dotenv.config()


const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017/Posts_Blogs_HW2'

if (!mongoURI)
    throw new Error("!err url")
//const client = new MongoClient(mongoURI)

//const db = client.db()
//export const blogs_db = db.collection<BlogsMainType>("blogs")
export const BlogsModel = mongoose.model('blogs', BlogsSchema)
//export const posts_db = db.collection<PostsMainType>("posts")
export const PostsModel = mongoose.model('posts', PostsSchema)
//export const users_db = db.collection<UsersMainType>("users")
export const UsersModel = mongoose.model('users', UsersSchema)
//export const comments_db = db.collection<CommentsMainType>("comments")
export const CommentsModel = mongoose.model('comments', CommentsSchema)
//export const devices_db = db.collection<DeviceMainType>("devices")
export const DevicesModel = mongoose.model('devices', DevicesSchema)
//export const rateLimit_db = db.collection<RateLimitType>('rateLimit')
export const RAteLimitModel = mongoose.model('rateLimit', RateLimitSchema)

export async function RunDb() {

    try {
        //await client.connect()
        await mongoose.connect(mongoURI)
        console.log('Db connect')

    } catch (err) {
        console.log("its error", err)
        //await client.close()
        await mongoose.disconnect()

    }
}

