import {ObjectId} from "mongodb";

export enum likeStatuses {
    "Like" = "Like",
    "Dislike" = "Dislike",
    "None" = "None"
}

export class LikeInfoView{
    constructor(public likesCount: number,
                public dislikesCount: number,
                public myStatus: likeStatuses) {
    }
}
export class LikesMainType{
    constructor(
        public commentOrPostId: ObjectId,
        public userId: ObjectId,
        public createdAt: string,
        public rate: string
    ) {
    }
}
