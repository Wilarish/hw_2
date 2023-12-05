import {ObjectId} from "mongodb";
import mongoose from "mongoose";

export class PostsViewType{
    constructor(public id: ObjectId,
                public title: string,
                public shortDescription: string,
                public content: string,
                public blogId: ObjectId,
                public blogName: string,
                public createdAt:string) {
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

