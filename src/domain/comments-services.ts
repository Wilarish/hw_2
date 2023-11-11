import {commentsRepository} from "../repositories/comments-rep";
import {CommentsCreateUpdate} from "../types/comments-types";

export const commentsServices = {
    async updateComment (data:CommentsCreateUpdate, userid:string):Promise<string|null>{

        return commentsRepository.updateComment(data, userid)
    },
    async deleteComment(id:string):Promise<boolean>{
        return commentsRepository.deleteComment(id)
    }

}