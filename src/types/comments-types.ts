import {ObjectId} from "mongodb";
import e from "express";
import mongoose from "mongoose";

export type CommentsViewType = {
    id: ObjectId,
    content: string,
    commentatorInfo: commentatorInfo,
    createdAt: string,
}

export type CommentsMainType = {
    id: ObjectId,
    content: string,
    commentatorInfo: commentatorInfo,
    createdAt: string,
    postId: string
}
export type commentatorInfo = {
    userId: ObjectId,
    userLogin: string
}

export type CommentsCreateUpdate = {
    content: string
}

export const CommentsSchema = new mongoose.Schema<CommentsMainType>({
    id: ObjectId,
    content: String,
    commentatorInfo: {
        userId: ObjectId,
        userLogin: String
    },
    createdAt: String,
    postId: String
})