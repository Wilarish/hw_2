import {CommentsCreateUpdate, CommentsMainType} from "../types/comments-types";
import {UsersMainType} from "../types/users-types";
import {PostsMainType} from "../types/posts-types";
import {ObjectId} from "mongodb";
import {CommentsRepository} from "../repositories/comments-rep";
import {UsersRepository} from "../repositories/users-rep";
import {PostsRepository} from "../repositories/posts-rep";

export class CommentsServices {


    constructor(protected commentsRepository: CommentsRepository,
                protected usersRepository: UsersRepository,
                protected postsRepository: PostsRepository) {
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


}



