import mongoose from "mongoose";
import {BlogsSchema, DevicesSchema, PostsSchema, RateLimitSchema, UsersSchema} from "../schemas/scemas";
import {CommentsSchema} from "../schemas/comments-schemas";


export const BlogsModel = mongoose.model('blogs', BlogsSchema)
export const PostsModel = mongoose.model('posts', PostsSchema)
export const UsersModel = mongoose.model('users', UsersSchema)
export const CommentsModel = mongoose.model('comments', CommentsSchema)
export const DevicesModel = mongoose.model('devices', DevicesSchema)
export const RateLimitModel = mongoose.model('rateLimit', RateLimitSchema)