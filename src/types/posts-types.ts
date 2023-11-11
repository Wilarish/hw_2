import {ObjectId} from "mongodb";

export type PostsViewType={
    id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId,
    blogName: string,
    createdAt:string
}

export type PostsMainType ={
    id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId,
    blogName: string,
    createdAt:string
}

export type PostsCreateUpdate= {
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId,

}