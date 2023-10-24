import {CommentsCreateUpdate} from "../types/comments/comments-create-update";
import {commentsRepository} from "../repositories/comments-rep";

export const commentsServises = {
    async updateComment (data:CommentsCreateUpdate, userid:string){

        return commentsRepository.updateComment(data, userid)
    },
    async deleteComment(id:string){
        return commentsRepository.deleteComment(id)
    }

}