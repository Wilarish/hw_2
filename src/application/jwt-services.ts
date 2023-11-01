import jwt from 'jsonwebtoken'

const secret = process.env.SECRET_JWT || "123"
export const jwtServices = {

    async createJwt (userId:string){
        return jwt.sign({userId},secret,{expiresIn:'1h'})
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