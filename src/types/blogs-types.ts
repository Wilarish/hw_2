import {ObjectId} from "mongodb";
import mongoose from 'mongoose'


export type BlogsViewType ={
    id: ObjectId,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}


export type BlogsMainType ={
    id: ObjectId,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type BlogsCreateUpdate = {
    name: string,
    description: string,
    websiteUrl: string
}
export const BlogsSchema = new mongoose.Schema<BlogsMainType>({
    id: ObjectId,
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: String,
    isMembership: Boolean
})