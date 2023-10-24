import {ObjectId} from "mongodb";

export type PostsCreateUpdate= {
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId,

}