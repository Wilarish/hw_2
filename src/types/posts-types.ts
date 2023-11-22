import {ObjectId} from "mongodb";
import mongoose from "mongoose";

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

export const PostsSchema = new mongoose.Schema<PostsMainType>({
    id: ObjectId,
    title: String,
    shortDescription: String,
    content: String,
    blogId: ObjectId,
    blogName: String,
    createdAt:String
})