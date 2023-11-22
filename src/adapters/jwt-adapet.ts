import jwt from 'jsonwebtoken'


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
    async createRecoveryJwt (userId:string){
        return jwt.sign({userId},secret,{expiresIn:'30m'})
    },
    async findUserByToken(token:string):Promise<string|null>{
        try {
            const result: any = jwt.verify(token, secret)

            return result.userId.toString()
        }catch (error){

            return null
        }
    },
    async refreshToken(token:string){
        const userId = await this.findUserByToken(token)
        const decodeOldToken:any = await this.decodeRefreshToken(token)

        if(!userId) return null

        //await jwtRepository.addRefreshTokenToBlackList(token)

        const refreshToken = await this.createRefreshJwt(userId, decodeOldToken.deviceId)
        const accessToken = await this.createAccessJwt(userId)

        const decodeNewToken:any = await this.decodeRefreshToken(refreshToken)


        return {
            refreshToken:{
                token:refreshToken,
                deviceId:decodeNewToken.deviceId,
                iat:decodeNewToken.iat
            },
            accessToken
        }
    },
    // async revokeToken(token:string){
    //     await jwtRepository.addRefreshTokenToBlackList(token)
    //     return true
    // },

}