import {body} from "express-validator";
import {UsersMainType} from "../../types/users-types";
import {jwtAdapter} from "../../adapters/jwt-adapet";
import {UsersRepository} from "../../repositories/users-rep";

export const paramsCheckingAuth = {
    code: body('code').isString().trim().isLength({min: 1}).withMessage('middleware error').custom(async (code) => {

        const usersRepository = new UsersRepository()

        const user: UsersMainType | null = await usersRepository.findUserByConfirmationCode(code)
        if (!user) throw new Error("this code is not exist")
        if (user.emailConfirmation.isConfirmed) throw new Error("this code is already confirmed")
        if (user.emailConfirmation.expirationDate < new Date()) throw new Error("This code is not valid")
        return true
    }),
    email: body('email').isString().trim().isEmail().isLength({min: 1, max: 50}).custom(async (email) => {

        const usersRepository = new UsersRepository()

        const user: UsersMainType | null = await usersRepository.findUserByLoginOrEmail(email);
        if (!user) throw new Error("User with this email does not exist");
        if (user.emailConfirmation.isConfirmed) throw new Error("This email is already confirmed");
        return true
    }),
    loginOrEmail: body('loginOrEmail').isString().trim().isLength({min: 1, max: 50}),
    password: body('password').isString().trim().isLength({min: 6, max: 20}),
    newPassword:body('newPassword').isString().trim().isLength({min: 6, max: 20}),
    emailShort:body('email').isString().trim().isEmail().isLength({min: 1, max: 50}),
    recoveryCode:body('recoveryCode').isString().trim().isLength({min: 3}).custom(async (code)=>{
        const userId:string|null = await jwtAdapter.findUserByToken(code)
        if(!userId) throw new Error('not valid code')

        return true
    }),
}
