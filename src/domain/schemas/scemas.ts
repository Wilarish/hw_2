import mongoose from "mongoose";
import {BlogsMainType} from "../../types/blogs-types";
import {DeviceMainType} from "../../types/devices-types";
import {PostsMainType} from "../../types/posts-types";
import {RateLimitType} from "../../types/rateLimit-types";
import { UsersMainType} from "../../types/users-types";

export const BlogsSchema = new mongoose.Schema<BlogsMainType>({
    id: {type: mongoose.Schema.Types.ObjectId, required: true,},
    name: {required: true, type: String, minlength: 1, maxlength: 100},
    description: {required: true, type: String, minlength: 1, maxlength: 1000},
    websiteUrl: {required: true, type: String, minlength: 1, maxlength: 1000},
    createdAt: {required: true, type: String, minlength: 1, maxlength: 50},
    isMembership: {required: true, type: Boolean}
 })


export const DevicesSchema = new mongoose.Schema<DeviceMainType>({
    ip: {required: true, type: String, minlength: 1, maxlength: 300},
    title: {required: true, type: String, minlength: 1, maxlength: 300},
    lastActiveDate: {required: true, type: String, minlength: 1, maxlength: 50},
    deviceId: {required: true, type: String, minlength: 1, maxlength: 200},
    userId: {type: mongoose.Schema.Types.ObjectId, required: true}
})

export const PostsSchema = new mongoose.Schema<PostsMainType>({
    id: {type: mongoose.Schema.Types.ObjectId, required: true},
    title: {required: true, type: String, minlength: 1, maxlength: 100},
    shortDescription: {required: true, type: String, minlength: 1, maxlength: 200},
    content: {required: true, type: String, minlength: 1, maxlength: 500},
    blogId: {type: mongoose.Schema.Types.ObjectId, required: true},
    blogName: {required: true, type: String, minlength: 1, maxlength: 100},
    createdAt: {required: true, type: String, minlength: 1, maxlength: 50}
})

export const RateLimitSchema = new mongoose.Schema<RateLimitType>({
    IP: {required: true, type: String, minlength: 1, maxlength: 100},
    URL: {required: true, type: String, minlength: 1, maxlength: 300},
    date: {required: true, type: Date, minlength: 1, maxlength: 100}
})

export const UsersSchema = new mongoose.Schema<UsersMainType>({
    id: {type: mongoose.Schema.Types.ObjectId, required: true},
    login: {required: true, type: String, minlength: 1, maxlength: 100},
    email: {required: true, type: String, minlength: 1, maxlength: 100},
    passwordSalt: {required: true, type: String, minlength: 1, maxlength: 500},
    passwordHash: {required: true, type: String, minlength: 1, maxlength: 500},
    createdAt: {required: true, type: String, minlength: 1, maxlength: 50},
    emailConfirmation: {
        confirmationCode: {required: true, type: String, minlength: 1, maxlength: 500},
        expirationDate: {required: true, type: String, minlength: 1, maxlength: 500},
        isConfirmed: {required: true, type: Boolean}
    }
})