import {ObjectId} from "mongodb";

export type BlogsMainType ={
    id: ObjectId,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}
