import {ObjectId} from "mongodb";
import e from "express";

export type CommentsMainType= {
    "id": ObjectId,
    "content": string,
    "commentatorInfo": commentatorInfo,
    "createdAt": string,
    "postId":string
}
export type commentatorInfo = {
    "userId": ObjectId,
    "userLogin": string
}