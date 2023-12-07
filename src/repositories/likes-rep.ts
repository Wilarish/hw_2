import {LikesModel} from "../domain/models/models";
import {ObjectId} from "mongodb";
import {LikesMainType} from "../types/likes-types";

export class LikesRepository{

    constructor() {
    }
    async tryFindAndUpdateRate(commentId: string, userId: string, likeStatus: string):Promise<boolean> {
        let result;
        try{
            result = await LikesModel.updateOne({commentOrPostId:new ObjectId(commentId), userId:new ObjectId(userId)},{rate:likeStatus})
        }
        catch (err){
            return false
        }
        return result.matchedCount === 1
    }

    async addRate(rate:LikesMainType):Promise<boolean> {
        await LikesModel.create(rate)
        return true
    }
    async getRates(id:string):Promise<LikesMainType[]>{
        return LikesModel.find({commentOrPostId:new ObjectId(id)})
    }
    async getAllRates():Promise<LikesMainType[]>{
        return LikesModel.find({})
    }
    async getAllCommentsRates():Promise<LikesMainType[]>{
        return LikesModel.find({likeType:"Comment"})
    }
    async  getAllPostsRates():Promise<LikesMainType[]>{
        return LikesModel.find({likeType:"Post"})//.sort({createdAt:1})
    }

    async deleteAllRates() {
        await LikesModel.deleteMany({})
    }
}