import {DefaultPaginationType, Paginated} from "../../types/pagination.type";
import {CommentsViewType} from "../../types/comments-types";
import {PostsMainType} from "../../types/posts-types";
import {ObjectId} from "mongodb";
import {CommentsModel} from "../../domain/models/models";
import {LikeInfoView, likeStatuses} from "../../types/likes-types";
import {PostsRepository} from "../posts-rep";
import {CommentsServices} from "../../application/comments-services";
import {th} from "date-fns/locale";

export class QueryCommentsRepository {
    private postsRepository: PostsRepository;
    private commentsServices: CommentsServices

    constructor() {
        this.postsRepository = new PostsRepository()
        this.commentsServices = new CommentsServices()
    }

    async queryFindPaginatedComments(pagination: DefaultPaginationType, postId: string, userId: string): Promise<Paginated<CommentsViewType> | null> {

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

        const itemsQuery: CommentsViewType[] = itemsDb.map((item) => {

            const ratesCount = this.commentsServices.UpdateLikesDislikes(item)

            let likeStatus: string

            if (!userId) {
                likeStatus = 'None'
            }

            const rateIsDefined = item.likesInfo.filter((rate) => {
                return rate.userId.toString() === userId
            })

            if (rateIsDefined.length === 0) {
                likeStatus = 'None'
            } else {
                likeStatus = rateIsDefined[0].rate
            }


            return new CommentsViewType(item.id,
                item.content,
                item.commentatorInfo,
                item.createdAt,
                new LikeInfoView(ratesCount.likesCount, ratesCount.dislikesCount, likeStatuses[likeStatus as keyof typeof likeStatuses]))
        })


        return {
            pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount,
            items: itemsQuery
        }
    }

    async findCommentById(id: string, userId: string | undefined): Promise<CommentsViewType | null> {

        const commentDb = await CommentsModel.findOne({id: new ObjectId(id)}).select({_id: 0, __v: 0, postId: 0}).lean()
        if (!commentDb) return null

        console.log(commentDb.likesInfo)

        const ratesCount = this.commentsServices.UpdateLikesDislikes(commentDb)


        let likeStatus: string;

        if (!userId) {
            likeStatus = 'None'
        }

        const rateIsDefined = commentDb.likesInfo.filter((rate) => {
            return rate.userId.toString() === userId
        })

        if (rateIsDefined.length === 0) {
            likeStatus = 'None'
        } else {

            likeStatus = rateIsDefined[0]?.rate
        }

        const likesInfo = new LikeInfoView(ratesCount.likesCount, ratesCount.dislikesCount, likeStatuses[likeStatus as keyof typeof likeStatuses])

        return new CommentsViewType(
            commentDb.id,
            commentDb.content,
            commentDb.commentatorInfo,
            commentDb.createdAt,
            likesInfo
        )
    }
}
