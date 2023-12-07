import {ObjectId} from "mongodb";
import mongoose from "mongoose";
import {ExtendedLikesPostsView} from "./likes-types";

export class PostsViewType{
    constructor(public id: ObjectId,
                public title: string,
                public shortDescription: string,
                public content: string,
                public blogId: ObjectId,
                public blogName: string,
                public createdAt:string,
                public extendedLikesInfo:ExtendedLikesPostsView) {
    }
}

export class PostsMainType{
    constructor(public id: ObjectId,
                public title: string,
                public shortDescription: string,
                public content: string,
                public blogId: ObjectId,
                public blogName: string,
                public createdAt:string) {
    }
}

export class PostsCreateUpdate {
    constructor(public title: string,
            public shortDescription: string,
            public content: string,
            public blogId: ObjectId,) {
    }
}

