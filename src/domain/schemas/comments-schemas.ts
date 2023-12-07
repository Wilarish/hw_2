import mongoose from "mongoose";
import {CommentsMainType} from "../../types/comments-types";
import {LikesMainType, likeStatuses, likeTypes} from "../../types/likes-types";
import {PostsMainType} from "../../types/posts-types";


export const LikesSchema = new mongoose.Schema<LikesMainType>({
    commentOrPostId:{type: mongoose.Schema.Types.ObjectId, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, required: true},
    rate: {type: String, enum: likeStatuses, required: true},
    createdAt:{type: String, required:true},
    likeType:{type:String, enum:likeTypes, required:true},
    login:{type: String, required:true},
})
export const CommentsSchema = new mongoose.Schema<CommentsMainType>({
    id: {type: mongoose.Schema.Types.ObjectId, required: true},
    content: {required: true, type: String, minlength: 1, maxlength: 1000},
    commentatorInfo: {
        userId: {type: mongoose.Schema.Types.ObjectId, required: true},
        userLogin: {required: true, type: String, minlength: 1, maxlength: 1000}
    },
    createdAt: {required: true, type: String, minlength: 1, maxlength: 50},
    postId: {required: true, type: String, minlength: 24, maxlength: 24},
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


