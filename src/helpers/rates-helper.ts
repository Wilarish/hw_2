import {LikesRepository} from "../repositories/likes-rep";
import {
    ExtendedLikesPostsView,
    LikeInfoView,
    LikesMainType,
    likeStatuses,
    NewestPostLikes
} from "../types/likes-types";
import {CommentsViewType} from "../types/comments-types";
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
export const RateHelpPosts = (rates:LikesMainType[], id:string, userId:string|undefined, date:Date):ExtendedLikesPostsView => {

    //let rates: LikesMainType[]= await likesRepository.getAllPostsRates()

    let likeStatus = 'None'

    let lastRates:NewestPostLikes[] = []

    let likesCount: number = 0
    let dislikesCount: number = 0

    const sortedRates:LikesMainType[] = [...rates].sort((a,b) => new Date(b.createdAt).getTime()- new Date(a.createdAt).getTime() )

    sortedRates.map((value:LikesMainType) => {

        if(value.rate === "Like" &&  lastRates.length < 3){
            lastRates.push(new NewestPostLikes(value.createdAt, value.userId, value.login))
        }

        if(value.commentOrPostId.toString()===id){
            if(value.rate === "Like") likesCount++
            if(value.rate === "Dislike") dislikesCount++
            if(userId && value.userId.toString() === userId) likeStatus = value.rate
        }
    })
    return  new ExtendedLikesPostsView(likesCount, dislikesCount, likeStatuses[likeStatus as keyof typeof likeStatuses],lastRates)
}
export const RateHelpPostsArr = async (itemsDb:any[], userId:string|undefined):Promise<PostsViewType[]> => {

    let rates: LikesMainType[];

    const items:Promise<PostsViewType[]> =Promise.all( itemsDb.map( async (post)=>{

        rates = await likesRepository.getAllPostsRates(post.id.toString())

        const sortedRates:LikesMainType[] = [...rates].sort((a,b) => new Date(b.createdAt).getTime()- new Date(a.createdAt).getTime() )

        let likeStatus = 'None'

        let lastRates:NewestPostLikes[] = []

        let likesCount: number = 0
        let dislikesCount: number = 0

        sortedRates.map((value:LikesMainType) => {

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

    }))

    return items
}