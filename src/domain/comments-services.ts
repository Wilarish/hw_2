import {commentsRepository} from "../repositories/comments-rep";
import {CommentsCreateUpdate, CommentsMainType} from "../types/comments-types";
import {UsersMainType} from "../types/users-types";
import {usersRepository} from "../repositories/users-rep";
import {PostsMainType} from "../types/posts-types";
import {postsRepository} from "../repositories/posts-rep";
import {ObjectId} from "mongodb";

export const commentsServices = {
    async createCommentForPost(userId:string, postId:string, data:CommentsCreateUpdate):Promise<string|null>{

        const user:UsersMainType| null = await usersRepository.findUserById(userId)
        const post:PostsMainType| null = await postsRepository.findPostById(postId)

        if(!post) return null

        if(user){

            const new_comment: CommentsMainType = {
                id: new ObjectId(),
                content: data.content,
                commentatorInfo: {
                    userId: new ObjectId(userId) ,
                    userLogin: user.login
                },
                createdAt: new Date().toISOString(),
                postId:postId
            }
            return await commentsRepository.createComment(new_comment)
        }
        return null



    },
    async updateComment (data:CommentsCreateUpdate, userid:string):Promise<string|null>{

        return commentsRepository.updateComment(data, userid)
    },
    async deleteComment(id:string):Promise<boolean>{
        return commentsRepository.deleteComment(id)
    }

}