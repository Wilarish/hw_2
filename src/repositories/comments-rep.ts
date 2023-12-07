import {CommentsCreateUpdate, CommentsMainType} from "../types/comments-types";
import {ObjectId} from "mongodb";
import {CommentsModel} from "../domain/models/models";

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

    async updateComment(data: CommentsCreateUpdate, id: string): Promise<string | null> {

        const result = await CommentsModel.updateOne({id: new ObjectId(id)}, {content: data.content})

        if (result.matchedCount === 1)
            return id
        else
            return null
    }
    async deleteComment(id: string): Promise<boolean> {
        const result = await CommentsModel.deleteOne({id: new ObjectId(id)})

        return result.deletedCount === 1
    }

    async deleteAllComments() {
        await  CommentsModel.deleteMany({})
    }
}
