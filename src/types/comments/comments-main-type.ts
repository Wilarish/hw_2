import {ObjectId} from "mongodb";

export type CommentsMainType= {
    "id": ObjectId,
    "content": string,
    "commentatorInfo": commentatorInfo,
    "createdAt": string,
    "postId":string
}
type commentatorInfo = {
    "userId": ObjectId,
    "userLogin": string
}