import {PostsViewType} from "../../types/posts-types";
import {ObjectId} from "mongodb";
import {DefaultPaginationType, Paginated} from "../../types/pagination.type";
import {PostsModel} from "../../domain/models/models";

export class QueryPostsRepository {
    async queryFindPaginatedPosts(pagination: DefaultPaginationType): Promise<Paginated<PostsViewType>> {

        const [items, totalCount] = await Promise.all([
            PostsModel
                .find({})
                .select({ _id: 0, __v:0})
                .sort({[pagination.sortBy]: pagination.sortDirection})
                .skip(pagination.skip)
                .limit(pagination.pageSize)
                .lean(),

            PostsModel.countDocuments()
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

    async queryFindPostById(id: string): Promise<PostsViewType | null> {

        return  PostsModel.findOne({id: new ObjectId(id)}).select({ _id: 0, __v:0}).lean()

    }
}
