import mongoose from "mongoose";
import {CommentsMainType} from "../../types/comments-types";
import {LikesListDb, likeStatuses} from "../../types/likes-types";


export const LikesSchema = new mongoose.Schema<LikesListDb>({
    userId: {type: mongoose.Schema.Types.ObjectId, required: true},
    rate: {type: String, enum: likeStatuses, required: true},
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
    likesInfo: {type: [LikesSchema], required:true},


})



