import {CommentsMainType} from "../types/comments-types";
import {LikesMainType} from "../types/likes-types";
import {LikesRepository} from "../repositories/likes-rep";
import {CommentsRepository} from "../repositories/comments-rep";
import {ObjectId} from "mongodb";

export class LikesServices{
    private likesRepository: LikesRepository;
    private commentsRepository: CommentsRepository;
    constructor() {
        this.likesRepository = new LikesRepository()
        this.commentsRepository = new CommentsRepository()
    }
    async rateComment(commentId: string, likeStatus: string, userId: string): Promise<boolean> {

        const comment:CommentsMainType|null = await this.commentsRepository.findCommentById(commentId)
        if(!comment) return false

        const rate:boolean = await this.likesRepository.tryFindAndUpdateRate(commentId,userId, likeStatus)

        if(!rate) return await this.likesRepository.addRate(new LikesMainType(new ObjectId(commentId) ,new ObjectId(userId), new Date().toISOString(), likeStatus))

        return true

    }
}