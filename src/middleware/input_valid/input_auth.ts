import {body} from "express-validator";
import {usersRepository} from "../../repositories/users-rep";
import {UsersMainType} from "../../types/users-types";

export const paramsCheckingAuth = {
    code: body('code').isString().trim().isLength({min: 1}).withMessage('middleware error').custom(async (code) => {

        const user: UsersMainType | null = await usersRepository.findUserByConfirmationCode(code)
        if (!user) throw new Error("this code is not exist")
        if (user.emailConfirmation.isConfirmed) throw new Error("this code is already confirmed")
        if (user.emailConfirmation.expirationDate < new Date()) throw new Error("This code is not valid")
        return true
    }),
    email: body('email').isString().trim().isEmail().isLength({min: 1, max: 50}).custom(async (email) => {

        const user: UsersMainType | null = await usersRepository.findUserByLoginOrEmail(email);
        if (!user) throw new Error("User with this email does not exist");
        if (user.emailConfirmation.isConfirmed) throw new Error("This email is already confirmed");
        return true
    }),
    loginOrEmail: body('loginOrEmail').isString().trim().isLength({min: 1, max: 50}),
    password: body('password').isString().trim().isLength({min: 6, max: 20})
}
