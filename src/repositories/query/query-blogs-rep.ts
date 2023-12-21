import {BlogsMainType, BlogsViewType} from "../../types/blogs-types";
import {ObjectId} from "mongodb";
import {BlogsPaginationType, DefaultPaginationType, Paginated} from "../../types/pagination.type";
import {PostsViewType} from "../../types/posts-types";
import {BlogsModel, PostsModel} from "../../domain/models/models";
import {RateHelpPostsArr} from "../../helpers/rates-helper";
import "reflect-metadata"
import {injectable} from "inversify";
@injectable()
export class QueryBlogsRepository {
    async queryFindPaginatedPostsForBlogsById(id: string, pagination: DefaultPaginationType, userId:string|undefined): Promise<Paginated<PostsViewType>> {
        const filter= {blogId: new ObjectId(id) }

        const [itemsDb, totalCount] = await Promise.all([
            PostsModel
                .find(filter, {projection: {_id: 0}})
                .sort({[pagination.sortBy]: pagination.sortDirection})
                .skip(pagination.skip)
                .limit(pagination.pageSize)
                .lean(),

            PostsModel.countDocuments(filter)
        ])

        const pagesCount = Math.ceil(totalCount / pagination.pageSize)

        const items:PostsViewType[] = await RateHelpPostsArr(itemsDb,userId)

        return {
            pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount,
            items
        }
    }

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
    }

    async queryFindBlogById(id: string): Promise<BlogsViewType | null> {

        return BlogsModel.findOne({id: new ObjectId(id)}).select({_id: 0, __v:0}).lean()

    }
}
