import {BlogsMainType, BlogsViewType} from "../../types/blogs-types";
import {BlogsModel, PostsModel,} from "../../data/DB";
import {ObjectId} from "mongodb";
import {BlogsPaginationType, DefaultPaginationType, Paginated} from "../../types/pagination.type";
import {PostsViewType} from "../../types/posts-types";

export const queryBlogsRepository ={

    async queryFindPaginatedPostsForBlogsById(id: string, pagination: DefaultPaginationType): Promise<Paginated<PostsViewType>> {
        const filter= {blogId: new ObjectId(id) }

        const [items, totalCount] = await Promise.all([
            PostsModel
                .find(filter, {projection: {_id: 0}})
                .sort({[pagination.sortBy]: pagination.sortDirection})
                .skip(pagination.skip)
                .limit(pagination.pageSize)
                .lean(),

            PostsModel.countDocuments(filter)
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
        const filter = {name: {$regex: pagination.searchNameTerm, $options: 'i'}}

        const [items, totalCount] = await Promise.all([
            BlogsModel
                .find(filter)
                .select({ _id: 0, __v:0})
                .sort({[pagination.sortBy]: pagination.sortDirection})
                .skip(pagination.skip)
                .limit(pagination.pageSize)
                .lean(),

            BlogsModel.countDocuments(filter)
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

        const blogDb: BlogsMainType | null = await BlogsModel.findOne({id: new ObjectId(id)}).select({ _id: 0, __v:0}).lean()

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