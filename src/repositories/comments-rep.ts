import {CommentsMainType} from "../types/comments/comments-main-type";
import {comments_db} from "../data/DB";
import {DefaultPaginationType, Paginated} from "../types/pagination.type";
import {PostsMainType} from "../types/posts/posts-main-type";
import {Filter} from "mongodb";
import {postsRepository} from "./posts-rep";
import {CommentsCreateUpdate} from "../types/comments/comments-create-update";


export const commentsRepository = {
    async createComment(comment:CommentsMainType){
        await comments_db.insertOne({...comment})
        return this.findCommentById(comment.id)
    },
    async findCommentById(id:string){
        const comment: CommentsMainType|null = await comments_db.findOne({id:id},{ projection: {  _id: 0, postId:0 } })
        if (!comment) {
            return null
        } else {
            return comment
        }
    },
    async findComments(pagination: DefaultPaginationType, postId:string): Promise<Paginated<CommentsMainType> | null> {

        const post:PostsMainType| null = await postsRepository.findPostById(postId)

        if(!post) return null

        const filter: Filter<CommentsMainType> = {postId: postId}

        const [items, totalCount] = await Promise.all([
            comments_db
                .find(filter, {projection: {_id: 0, postId:0}})
                .sort({[pagination.sortBy]: pagination.sortDirection})
                .skip(pagination.skip)
                .limit(pagination.pageSize)
                .toArray(),

            comments_db.countDocuments(filter)
        ])

        const pagesCount = Math.ceil(totalCount / pagination.pageSize)

        return {
            pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount,
            items
        }
    },
    async updateComment(data: CommentsCreateUpdate, id:string){

        const result = await comments_db.updateOne({id:id}, {$set:{
            content:data.content
            }})

        if(result.matchedCount === 1)
            return commentsRepository.findCommentById(id)
        else
            return null
    },
    async deleteComment(id:string): Promise<boolean>{
        const result = await comments_db.deleteOne({id:id})

        return result.deletedCount === 1
    }

}