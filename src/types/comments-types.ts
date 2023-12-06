import {ObjectId} from "mongodb";
import {LikeInfoView} from "./likes-types";

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
                public postId: string) {
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

