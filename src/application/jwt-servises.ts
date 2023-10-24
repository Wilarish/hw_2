import jwt from 'jsonwebtoken'
import {UsersMainType} from "../types/users/users-main-type";

const secret = process.env.SECRET_JWT || "123"
export const jwtServises = {

    async createJwt (userId:string){
        const token = jwt.sign({userId},secret,{expiresIn:'1h'})
        console.log(token)
        return token
    },
    async findUserByToken(token:string){
        try {
            const result: any = jwt.verify(token, secret)

            return result.userId
        }catch (error){

            return null
        }
    }
}