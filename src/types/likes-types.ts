import {ObjectId} from "mongodb";

export enum likeStatuses {
    "Like" = "Like",
    "Dislike" = "Dislike",
    "None" = "None"
}

export enum likeTypes {
    "Comment" = "Comment",
    "Post" = "Post"
}

export class LikeInfoView {
    constructor(public likesCount: number,
                public dislikesCount: number,
                public myStatus: likeStatuses) {
    }
}

export class LikesMainType {
    constructor(
        public likeType: likeTypes,
        public commentOrPostId: ObjectId,
        public userId: ObjectId,
        public login:string,
        public createdAt: string,
        public rate: string
    ) {
    }
}


export class NewestPostLikes {
    constructor(
        public addedAt: string,
        public userId: ObjectId,
        public login: string
    ) {
    }
}
export class ExtendedLikesPostsView{
    constructor(
        public likesCount: number,
        public dislikesCount: number,
        public myStatus: likeStatuses,
        public newestLikes:NewestPostLikes[]
    ) {
    }
}
