import {PostsMainType, PostsViewType} from "../../types/posts-types";
import {posts_db} from "../../data/DB";
import {ObjectId} from "mongodb";
import {DefaultPaginationType, Paginated} from "../../types/pagination.type";

export const queryPostsRepository ={
    async queryFindPaginatedPosts(pagination: DefaultPaginationType): Promise<Paginated<PostsViewType>> {

        const [items, totalCount] = await Promise.all([
            posts_db
                .find({}, {projection: {_id: 0}})
                .sort({[pagination.sortBy]: pagination.sortDirection})
                .skip(pagination.skip)
                .limit(pagination.pageSize)
                .toArray(),

            posts_db.countDocuments()
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

    async queryFindPostById(id: string): Promise<PostsViewType | null> {


        const post: PostsMainType | null = await posts_db.findOne({id: new ObjectId(id)}, {projection: {_id: 0}})
        if (!post) return null

        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt:post.createdAt
        }

    },
}