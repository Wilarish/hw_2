import {DefaultPaginationType, Paginated} from "../../types/pagination.type";
import {CommentsViewType} from "../../types/comments-types";
import {PostsMainType} from "../../types/posts-types";
import {ObjectId} from "mongodb";
import {CommentsModel} from "../../domain/models/models";
import {LikeInfoView} from "../../types/likes-types";
import {PostsRepository} from "../posts-rep";
import {RateHelp, RateHelpArr} from "../../helpers/rates-helper";

export class QueryCommentsRepository {
    private postsRepository: PostsRepository;

    constructor() {
        this.postsRepository = new PostsRepository()
    }

    async queryFindPaginatedComments(pagination: DefaultPaginationType, postId: string, userId: string|undefined): Promise<Paginated<CommentsViewType> | null> {

        const post: PostsMainType | null = await this.postsRepository.findPostById(postId)

        if (!post) return null

        const filter = {postId: postId}

        const [itemsDb, totalCount] = await Promise.all([
            CommentsModel
                .find(filter)
                .select({_id: 0, __v: 0, postId: 0})
                .sort({[pagination.sortBy]: pagination.sortDirection})
                .skip(pagination.skip)
                .limit(pagination.pageSize)
                .lean(),

            CommentsModel.countDocuments(filter)
        ])

        const pagesCount = Math.ceil(totalCount / pagination.pageSize)
        const items = await RateHelpArr(itemsDb,userId)

        console.log(items)
        return {
            pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount,
            items
        }
    }

    async findCommentById(id: string, userId: string | undefined): Promise<CommentsViewType | null> {

        const commentDb = await CommentsModel.findOne({id: new ObjectId(id)}).select({_id: 0, __v: 0, postId: 0}).lean()
        if (!commentDb) return null

        const likesInfo:LikeInfoView = await RateHelp(id,userId)

        return new CommentsViewType(
            commentDb.id,
            commentDb.content,
            commentDb.commentatorInfo,
            commentDb.createdAt,
            likesInfo
        )
    }
}
