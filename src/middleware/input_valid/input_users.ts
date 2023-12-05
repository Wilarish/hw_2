import {body} from "express-validator";
import {UsersRepository} from "../../repositories/users-rep";

export const paramsCheckingUsersBody = {
    email: body('email').isString().trim().isEmail().isLength({min:1, max:50}).custom(async(email) => {

        const usersRepository = new UsersRepository()

        const user = await usersRepository.findUserByLoginOrEmail(email);
        if(user) throw new Error('User with this email already exist')
        return true;
    }),
    login: body('login').isString().trim().isLength({min:3, max:10}).custom(async (login)=>{
        const usersRepository = new UsersRepository()

        const user = await usersRepository.findUserByLoginOrEmail(login);
        if(user) throw new Error('User with this login already exist')
        return true;
    }),
    password: body('password').isString().trim().isLength({min:6, max: 20})
}