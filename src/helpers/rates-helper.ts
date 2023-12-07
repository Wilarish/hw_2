import {LikesRepository} from "../repositories/likes-rep";
import {
    ExtendedLikesPostsView,
    LikeInfoView,
    LikesMainType,
    likeStatuses,
    likeTypes,
    NewestPostLikes
} from "../types/likes-types";
import {CommentsViewType} from "../types/comments-types";
import {el} from "date-fns/locale";
import {PostsViewType} from "../types/posts-types";

const likesRepository = new LikesRepository()

export const RateHelpComments = async (id:string, userId:string|undefined):Promise<LikeInfoView> => {

    let rates: LikesMainType[]= await likesRepository.getAllCommentsRates()

    console.log(rates)

    let likeStatus = 'None'

    let likesCount: number = 0
    let dislikesCount: number = 0

    rates.map((value:LikesMainType) => {
        if(value.commentOrPostId.toString()===id){
            if(value.rate === "Like") likesCount++
            if(value.rate === "Dislike") dislikesCount++
            if(userId && value.userId.toString() === userId) likeStatus = value.rate
        }
    })

    return new LikeInfoView(likesCount, dislikesCount, likeStatuses[likeStatus as keyof typeof likeStatuses])
}

export const RateHelpCommentsArr = async (itemsDb:any[], userId:string|undefined) => {

    const rates: LikesMainType[] = await likesRepository.getAllCommentsRates()

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
export const RateHelpPosts = async (id:string, userId:string|undefined):Promise<ExtendedLikesPostsView> => {

    let rates: LikesMainType[]= await likesRepository.getAllPostsRates()

    let likeStatus = 'None'

    let lastRates:NewestPostLikes[] = []

    let likesCount: number = 0
    let dislikesCount: number = 0

    rates.map((value:LikesMainType) => {

        if(value.rate === "Like" && lastRates.length < 3) lastRates.push(new NewestPostLikes(value.createdAt, value.userId, value.login))

        if(value.commentOrPostId.toString()===id){
            if(value.rate === "Like") likesCount++
            if(value.rate === "Dislike") dislikesCount++
            if(userId && value.userId.toString() === userId) likeStatus = value.rate
        }
    })
    return  new ExtendedLikesPostsView(likesCount, dislikesCount, likeStatuses[likeStatus as keyof typeof likeStatuses],lastRates)
}
export const RateHelpPostsArr = async (itemsDb:any[], userId:string|undefined):Promise<PostsViewType[]> => {

    const rates: LikesMainType[] = await likesRepository.getAllPostsRates()

    const items:PostsViewType[] =itemsDb.map( (post)=>{

        let likeStatus = 'None'

        let lastRates:NewestPostLikes[] = []

        let likesCount: number = 0
        let dislikesCount: number = 0

        rates.map((value:LikesMainType) => {

            if(value.rate === "Like" && lastRates.length < 3) lastRates.push(new NewestPostLikes(value.createdAt, value.userId, value.login))

            if(value.commentOrPostId.toString()===post.id.toString()){
                if(value.rate === "Like") likesCount++
                if(value.rate === "Dislike") dislikesCount++
                if(userId && value.userId.toString() === userId) likeStatus = value.rate
            }
        })
        const extendedLikesInfo=  new ExtendedLikesPostsView(likesCount, dislikesCount, likeStatuses[likeStatus as keyof typeof likeStatuses],lastRates)

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

    })

    return items
}