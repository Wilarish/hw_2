import {CommentsCreateUpdate} from "../types/comments/comments-create-update";
import {DefaultPaginationType, Paginated} from "../types/pagination.type";
import {PostsMainType} from "../types/posts/posts-main-type";
import {comments_db, posts_db} from "../data/DB";
import {CommentsMainType} from "../types/comments/comments-main-type";
import {commentsRepository} from "../repositories/comments-rep";
import {usersRepository} from "../repositories/users-rep";
import {UsersMainType} from "../types/users/users-main-type";

export const commentsServises = {
    async updateComment (data:CommentsCreateUpdate, userid:string){

        return commentsRepository.updateComment(data, userid)
    },
    async deleteComment(id:string){
        return commentsRepository.deleteComment(id)
    }

}