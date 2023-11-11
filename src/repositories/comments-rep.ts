import {CommentsCreateUpdate, CommentsMainType} from "../types/comments-types";
import {comments_db} from "../data/DB";
import {DefaultPaginationType, Paginated} from "../types/pagination.type";
import {PostsMainType} from "../types/posts-types";
import {Filter, ObjectId} from "mongodb";
import {postsRepository} from "./posts-rep";

export const commentsRepository = {
    async createComment(comment: CommentsMainType): Promise<string> {
        await comments_db.insertOne(comment)
        return comment.id.toString()
    },
    async findCommentById(id: string) {
        const comment: CommentsMainType | null = await comments_db.findOne({id: new ObjectId(id)})
        if (!comment) {
            return null
        } else {
            return comment
        }
    },

    async updateComment(data: CommentsCreateUpdate, id: string):Promise<string|null> {

        const result = await comments_db.updateOne({id: new ObjectId(id)}, {
            $set: {
                content: data.content
            }
        })

        if (result.matchedCount === 1)
            return id
        else
            return null
    },
    async deleteComment(id: string): Promise<boolean> {
        const result = await comments_db.deleteOne({id: new ObjectId(id)})

        return result.deletedCount === 1
    }

}