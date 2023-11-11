import {ObjectId} from "mongodb";



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
