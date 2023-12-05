import {CommentsCreateUpdate, CommentsMainType} from "../types/comments-types";
import {ObjectId} from "mongodb";
import {CommentsModel} from "../domain/models/models";
import {LikeInfoDb} from "../types/likes-types";

export class CommentsRepository {
    async createComment(comment: CommentsMainType): Promise<string> {
        await CommentsModel.create(comment)
        return comment.id.toString()
    }
    async findCommentById(id: string) {
        const comment: CommentsMainType | null = await CommentsModel.findOne({id: new ObjectId(id)})
        if (!comment) {
            return null
        } else {
            return comment
        }
    }
    async findLikeInfoForQuery(commentId: string, userId:string){

    }

    async updateComment(data: CommentsCreateUpdate, id: string): Promise<string | null> {

        const result = await CommentsModel.updateOne({id: new ObjectId(id)}, {content: data.content})

        if (result.matchedCount === 1)
            return id
        else
            return null
    }
    async updateCommentLikes(comment:CommentsMainType){
        const result =await CommentsModel.updateOne({id:comment.id}, {likeInfo:comment.likeInfo})

        return result.modifiedCount === 1
    }
    async deleteComment(id: string): Promise<boolean> {
        const result = await CommentsModel.deleteOne({id: new ObjectId(id)})

        return result.deletedCount === 1
    }

}
