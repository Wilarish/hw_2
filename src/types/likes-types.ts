import {ObjectId} from "mongodb";

export enum likeStatuses {
    "None",
    "Like",
    "Dislike"
}

export class LikeInfoView{
    constructor(public likesCount: number,
                public dislikesCount: number,
                public myStatus: likeStatuses) {
    }
}
export class LikeInfoDb{
    constructor(public likesList: LikesListDb[],
                public likesCount: number,
                public dislikesCount: number ){
    }
}
export class LikesListDb{
    constructor(public userId: ObjectId,
                public createdAt: string,
                public rate: string ){
    }
}