import {ObjectId} from "mongodb";
import e from "express";
import mongoose from "mongoose";
import {LikeInfoDb, LikeInfoView, likeStatuses} from "./likes-types";

export class CommentsViewType  {
    constructor(public id: ObjectId,
                public content: string,
                public commentatorInfo: commentatorInfo,
                public createdAt: string,
                public likesInfo:LikeInfoView){

    }
}

export class CommentsMainType{
    constructor(public id: ObjectId,
                public content: string,
                public commentatorInfo: commentatorInfo,
                public createdAt: string,
                public postId: string,
                public likesInfo:LikeInfoDb) {
    }
}




class commentatorInfo {
    constructor(public userId: ObjectId,
                public userLogin: string) {
    }
}

export class CommentsCreateUpdate  {
    constructor(public content: string) {
    }
}

