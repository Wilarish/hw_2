import jwt from 'jsonwebtoken'
import {jwtRepository} from "../repositories/jwt-rep";
import {usersRepository} from "../repositories/users-rep";
import {UsersMainType} from "../types/users-types";

const secret = process.env.SECRET_JWT || "123"
export const jwtServices = {

    async createAccessJwt (userId:string){
        return jwt.sign({userId},secret,{expiresIn:'10s'})
    },
    async createRefreshJwt (userId:string){
        return jwt.sign({userId},secret,{expiresIn:'20s'})
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

        await jwtRepository.addRefreshTokenToBlackList(token)

        const refreshToken = await this.createRefreshJwt(userId)
        const accessToken = await this.createAccessJwt(userId)

        return {
            refreshToken,
            accessToken
        }
    },
    async revokeToken(token:string){
        await jwtRepository.addRefreshTokenToBlackList(token)
        return true
    },
    async getInformationAboutMe(userId:string){
        const user:UsersMainType|null = await usersRepository.findUserById(userId)
        return{
            email:user?.email,
            login:user?.login,
            userId:user?.id
        }
    }
}