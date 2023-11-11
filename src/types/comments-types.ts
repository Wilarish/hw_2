import {ObjectId} from "mongodb";
import e from "express";

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
    postId:string
}
export type commentatorInfo = {
    "userId": ObjectId,
    "userLogin": string
}

export type CommentsCreateUpdate = {
    content:string
}