import {cookie} from "express-validator";
import {jwtRepository} from "../../repositories/jwt-rep";
import {jwtAdapter} from "../../adapters/jwt-adapet";
import {UsersMainType} from "../../types/users-types";

export const CheckJwtToken = {
    refreshToken: cookie('refreshToken').isString().trim().isLength({min: 3}).custom(async (token) => {

        const valid: boolean = await jwtRepository.findRefreshTokenInBlackList(token)
        const user: UsersMainType | null = await jwtAdapter.findUserByToken(token)

        if (valid) throw new Error('not valid token...valid')
        if (!user) throw new Error('not valid token...user')

        return true

    }),

}