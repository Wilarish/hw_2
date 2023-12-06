import {CommentsCreateUpdate, CommentsMainType} from "../types/comments-types";
import {UsersMainType} from "../types/users-types";
import {PostsMainType} from "../types/posts-types";
import {ObjectId} from "mongodb";
import {LikesListDb, likeStatuses} from "../types/likes-types";
import {CommentsRepository} from "../repositories/comments-rep";
import {UsersRepository} from "../repositories/users-rep";
import {PostsRepository} from "../repositories/posts-rep";

export class CommentsServices {
    private commentsRepository: CommentsRepository;
    private usersRepository: UsersRepository;
    private postsRepository: PostsRepository;

    constructor() {
        this.commentsRepository = new CommentsRepository()
        this.usersRepository = new UsersRepository()
        this.postsRepository = new PostsRepository()
    }

    async createCommentForPost(userId: string, postId: string, data: CommentsCreateUpdate): Promise<string | null> {

        const user: UsersMainType | null = await this.usersRepository.findUserById(userId)
        const post: PostsMainType | null = await this.postsRepository.findPostById(postId)

        if (!post) return null

        if (user) {

            const new_comment: CommentsMainType = new CommentsMainType(new ObjectId(),
                data.content,
                {
                    userId: new ObjectId(userId),
                    userLogin: user.login
                },
                new Date().toISOString(),
                postId,
                []
            )


            return await this.commentsRepository.createComment(new_comment)
        }
        return null


    }

    async updateComment(data: CommentsCreateUpdate, userid: string): Promise<string | null> {

        return this.commentsRepository.updateComment(data, userid)
    }

    async deleteComment(id: string): Promise<boolean> {
        return this.commentsRepository.deleteComment(id)
    }

    async rateComment(commentId: string, likeStatus: string, userId: string): Promise<boolean> {
        const comment: CommentsMainType | null = await this.commentsRepository.findCommentById(commentId)
        if (!comment) return false

        const userLikeInfo:LikesListDb|undefined = comment.likesInfo.find((elem) => userId === elem.userId.toString())

        if (!userLikeInfo) {
            comment.likesInfo.push(new LikesListDb(new ObjectId(userId), likeStatus))

            return this.commentsRepository.updateCommentLikes(comment)

        }

        // if (userLikeInfo.rate === likeStatus) {
        //     userLikeInfo!.rate = likeStatuses.None.toString()
        //
        //     await this.UpdateLikesDislikes(comment)
        //     return this.commentsRepository.updateCommentLikes(comment)
        // }


        userLikeInfo!.rate = likeStatus

        console.log(userLikeInfo)

        return this.commentsRepository.updateCommentLikes(comment)

    }

    UpdateLikesDislikes(comment: CommentsMainType) {

        const {likesCount, dislikesCount} = comment.likesInfo.reduce((ac, el)=> {
            if(el.rate === likeStatuses[likeStatuses.Like]){
                ac.likesCount++
            }
            if(el.rate === likeStatuses[likeStatuses.Dislike]){
                ac.dislikesCount++
            }
            return ac;
        }, {likesCount: 0, dislikesCount: 0})

        return{
            likesCount,
            dislikesCount
        }

        // comment.likesInfo.likesCount = comment.likesInfo.likesList.filter((value) => value.rate === likeStatuses[likeStatuses.Like]).length
        // comment.likesInfo.dislikesCount = comment.likesInfo.likesList.filter((value) => value.rate === likeStatuses[likeStatuses.Dislike]).length

        // comment.likesInfo.likesCount = likesCount;
        // comment.likesInfo.dislikesCount = dislikesCount;

        //return this.commentsRepository.updateCommentLikes(comment)
    }
}



