import jwt from 'jsonwebtoken'

const secret = process.env.SECRET_JWT || "123"
export const jwtServices = {

    async createJwt (userId:string){
        const token = jwt.sign({userId},secret,{expiresIn:'1h'})
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