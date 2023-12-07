import {PostsMainType, PostsViewType} from "../../types/posts-types";
import {ObjectId} from "mongodb";
import {DefaultPaginationType, Paginated} from "../../types/pagination.type";
import {PostsModel} from "../../domain/models/models";
import {RateHelpPosts, RateHelpPostsArr} from "../../helpers/rates-helper";
import {ExtendedLikesPostsView, LikeInfoView} from "../../types/likes-types";

export class QueryPostsRepository {
    async queryFindPaginatedPosts(pagination: DefaultPaginationType, userId:string|undefined): Promise<Paginated<PostsViewType>> {

        const [itemsDb, totalCount] = await Promise.all([
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

        const items:PostsViewType[] = await RateHelpPostsArr(itemsDb,userId)

        return {
            pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount,
            items
        }
    }

    async queryFindPostById(id: string, userId:string|undefined): Promise<PostsViewType | null> {

        const post: PostsMainType|null = await PostsModel.findOne({id: new ObjectId(id)}).select({ _id: 0, __v:0}).lean()
        if(!post) return null

        const extendedLikesInfo:ExtendedLikesPostsView = await RateHelpPosts(id,userId)

        return new PostsViewType(
            post.id,
            post.title,
            post.shortDescription,
            post.content,
            post.blogId,
            post.blogName,
            post.createdAt,
            extendedLikesInfo
        )

    }
}
