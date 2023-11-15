import jwt from 'jsonwebtoken'
import {jwtRepository} from "../repositories/jwt-rep";
import {usersRepository} from "../repositories/users-rep";
import {UsersMainType} from "../types/users-types";
import {deviceServices} from "../domain/device-services";

const secret = process.env.SECRET_JWT || "123"
export const jwtAdapter = {

    async createAccessJwt (userId:string){
        return jwt.sign({userId},secret,{expiresIn:'10s'})
    },
    async createRefreshJwt (userId:string, deviceId:string){
        return jwt.sign({userId,deviceId},secret,{expiresIn:'20s'})
    },
    async decodeRefreshToken(token:string){
        return jwt.decode(token)
    },
    async findUserByToken(token:string){
        try {
            const result: any = jwt.verify(token, secret)

            return result.userId
        }catch (error){

            return null
        }
    },
    async refreshToken(token:string){
        const userId = await this.findUserByToken(token)
        const decodeOldToken:any = jwt.decode(token)

        await jwtRepository.addRefreshTokenToBlackList(token)

        const refreshToken = await this.createRefreshJwt(userId, decodeOldToken.deviceId)
        const accessToken = await this.createAccessJwt(userId)

        const decodeNewToken:any = jwt.decode(refreshToken)
        const  change:boolean = await deviceServices.changeDevice(decodeNewToken.deviceId, decodeNewToken.iat)
        if(!change) return null

        return {
            refreshToken,
            accessToken
        }
    },
    async revokeToken(token:string){
        await jwtRepository.addRefreshTokenToBlackList(token)
        return true
    },

}