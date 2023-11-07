import {cookie} from "express-validator";
import {jwtRepository} from "../../repositories/jwt-rep";
import {jwtServices} from "../../application/jwt-services";
import {UsersMainType} from "../../types/users/users-main-type";

export const CheckJwtToken = {
    refreshToken: cookie('refreshToken').isString().trim().isLength({min: 3}).custom(async (token) => {

        const valid: boolean = await jwtRepository.findRefreshTokenInBlackList(token)
        const user: UsersMainType | null = await jwtServices.findUserByToken(token)

        if (valid) throw new Error('not valid token...valid')
        if (!user) throw new Error('not valid token...user')

        return true

    }),
    accessToken: cookie('accessToken').isString().trim().isLength({min: 3}).custom(async (token) => {

        const user: UsersMainType | null = await jwtServices.findUserByToken(token)

        if (!user) throw new Error('not valid token...user')

        return true

    })
}