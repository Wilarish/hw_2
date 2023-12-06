import {LikesRepository} from "../repositories/likes-rep";
import {LikeInfoView, LikesMainType, likeStatuses} from "../types/likes-types";
import {CommentsMainType, CommentsViewType} from "../types/comments-types";

const likesRepository = new LikesRepository()

export const RateHelp = async (commentId:string, userId:string|undefined) => {

    const rates: LikesMainType[] = await likesRepository.getAllRates()

    let likeStatus = 'None'

    let likesCount: number = 0
    let dislikesCount: number = 0

    rates.map((value:LikesMainType) => {
        if(value.commentOrPostId.toString()===commentId){
            if(value.rate === "Like") likesCount++
            if(value.rate === "Dislike") dislikesCount++
            if(userId && value.userId.toString() === userId) likeStatus = value.rate
        }
    })

    return new LikeInfoView(likesCount, dislikesCount, likeStatuses[likeStatus as keyof typeof likeStatuses])
}
export const RateHelpArr = async (itemsDb:any[], userId:string|undefined) => {

    const rates: LikesMainType[] = await likesRepository.getAllRates()

    const items =itemsDb.map( (comment)=>{

        let likeStatus = 'None'

        let likesCount: number = 0
        let dislikesCount: number = 0

        rates.map((value:LikesMainType) => {
            if(value.commentOrPostId.toString()===comment.id.toString()){
                if(value.rate === "Like") likesCount++
                if(value.rate === "Dislike") dislikesCount++
                if(userId && value.userId.toString() === userId) likeStatus = value.rate
            }
        })

        const likesInfo:LikeInfoView = new LikeInfoView(likesCount, dislikesCount, likeStatuses[likeStatus as keyof typeof likeStatuses])

        return new CommentsViewType(
            comment.id,
            comment.content,
            comment.commentatorInfo,
            comment.createdAt,
            likesInfo
        )

    })

    return items
}