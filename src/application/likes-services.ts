import {CommentsMainType} from "../types/comments-types";
import {LikesMainType, likeStatuses, likeTypes} from "../types/likes-types";
import {LikesRepository} from "../repositories/likes-rep";
import {CommentsRepository} from "../repositories/comments-rep";
import {ObjectId} from "mongodb";
import {PostsMainType, PostsViewType} from "../types/posts-types";
import {PostsRepository} from "../repositories/posts-rep";
import {UsersRepository} from "../repositories/users-rep";
import {UsersMainType} from "../types/users-types";

export class LikesServices {


    constructor(protected likesRepository: LikesRepository,
                protected commentsRepository: CommentsRepository,
                protected postsRepository: PostsRepository,
                protected usersRepository: UsersRepository) {
    }

    async rateCommentOrPost(id: string, likeStatus: string, userId: string, likeType: string): Promise<boolean> {

        if (likeType === likeTypes[likeTypes.Comment]) {
            const comment: CommentsMainType | null = await this.commentsRepository.findCommentById(id)
            if (!comment) return false
        }
        if (likeType === likeTypes[likeTypes.Post]) {
            const post: PostsMainType | null = await this.postsRepository.findPostById(id)
            if (!post) return false
        }
        const user: UsersMainType | null = await this.usersRepository.findUserById(userId)
        if (!user) return false

        const rate: boolean = await this.likesRepository.tryFindAndUpdateRate(id, userId, likeStatus)

        if (!rate) return await this.likesRepository.addRate(new LikesMainType
        (
            likeTypes[likeType as keyof typeof likeTypes],
            new ObjectId(id),
            new ObjectId(userId),
            user.login,
            new Date().toISOString(),
            likeStatus
        ))

        return true

    }
}