import {BlogsMainType, BlogsViewType} from "../../types/blogs-types";
import {blogs_db, posts_db} from "../../data/DB";
import {Filter, ObjectId} from "mongodb";
import {BlogsPaginationType, DefaultPaginationType, Paginated} from "../../types/pagination.type";
import {PostsMainType, PostsViewType} from "../../types/posts-types";

export const queryBlogsRepository ={

    async queryFindPaginatedPostsForBlogsById(id: string, pagination: DefaultPaginationType): Promise<Paginated<PostsViewType>> {
        const filter: Filter<PostsMainType> = {blogId: new ObjectId(id) }

        const [items, totalCount] = await Promise.all([
            posts_db
                .find(filter, {projection: {_id: 0}})
                .sort({[pagination.sortBy]: pagination.sortDirection})
                .skip(pagination.skip)
                .limit(pagination.pageSize)
                .toArray(),

            posts_db.countDocuments(filter)
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

    async queryFindPaginatedBlogs(pagination: BlogsPaginationType): Promise<Paginated<BlogsViewType>> {
        const filter: Filter<BlogsMainType> = {name: {$regex: pagination.searchNameTerm, $options: 'i'}}

        const [items, totalCount] = await Promise.all([
            blogs_db
                .find(filter, {projection: {_id: 0}})
                .sort({[pagination.sortBy]: pagination.sortDirection})
                .skip(pagination.skip)
                .limit(pagination.pageSize)
                .toArray(),

            blogs_db.countDocuments(filter)
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

    async queryFindBlogById(id: string): Promise<BlogsViewType | null> {

        const blogDb: BlogsMainType | null = await blogs_db.findOne({id: new ObjectId(id)}, {projection: {_id: 0}})

        if(!blogDb) return null

        return {
            id: blogDb?.id,
            name: blogDb?.name,
            description: blogDb?.description,
            websiteUrl: blogDb?.websiteUrl,
            createdAt: blogDb?.createdAt,
            isMembership: blogDb?.isMembership
        }
    },
}