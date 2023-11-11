import {blackList_db} from "../data/DB";
import {RefreshTokenDBType} from "../types/refresh-token-DB-type";


export const jwtRepository = {
    async addRefreshTokenToBlackList(token:string):Promise<RefreshTokenDBType> {

        const tokenObj: RefreshTokenDBType = {refreshToken:token}
        await blackList_db.insertOne({...tokenObj})
        return tokenObj
    },
    async findRefreshTokenInBlackList(token:string): Promise<boolean>{
        const tokenFind: RefreshTokenDBType| null =  await blackList_db.findOne({refreshToken:token}, {projection: {_id: 0}})
        if(!tokenFind) return false

        return true
    }

}