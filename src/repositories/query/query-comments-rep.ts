import {DefaultPaginationType, Paginated} from "../../types/pagination.type";
import {CommentsMainType, CommentsViewType} from "../../types/comments-types";
import {PostsMainType} from "../../types/posts-types";
import {postsRepository} from "../posts-rep";
import {ObjectId} from "mongodb";
import {CommentsModel} from "../../data/DB";

export const queryCommentsRepository = {
    async queryFindPaginatedComments(pagination: DefaultPaginationType, postId: string): Promise<Paginated<CommentsViewType> | null> {

        const post: PostsMainType | null = await postsRepository.findPostById(postId)

        if (!post) return null

        const filter = {postId: postId}

        const [items, totalCount] = await Promise.all([
            CommentsModel
                .find(filter, {projection: {_id: 0, postId: 0}})
                .sort({[pagination.sortBy]: pagination.sortDirection})
                .skip(pagination.skip)
                .limit(pagination.pageSize)
                .lean(),

            CommentsModel.countDocuments(filter)
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
    async findCommentById(id: string):Promise<CommentsViewType|null> {
        const comment: CommentsMainType | null = await CommentsModel.findOne({id: new ObjectId(id)}, {
            projection: {
                _id: 0,
                postId: 0
            }
        })
        if (!comment) return null

        return {
            id: comment.id,
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt,
        }

    },
}