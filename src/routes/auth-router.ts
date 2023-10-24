import {Response, Request, Router} from "express";
import {usresServises} from "../domain/users-servises";
import {HTTP_statuses} from "../data/HTTP_statuses";
import {errorsChecking} from "../middleware/middleware_input_validation";
import {InputValidationLogin} from "../middleware/arrays_of_input_validation";
import {jwtServises} from "../application/jwt-servises";
import {UsersMainType} from "../types/users/users-main-type";

export const AuthRouter = Router({})

AuthRouter.post('/login', InputValidationLogin.post, errorsChecking, async (req: Request<{}, {}, { loginOrEmail: string, password: string }>, res: Response) => {
    const user: UsersMainType | null = await usresServises.login(req.body.loginOrEmail, req.body.password)

    if (!user) {
        return res.sendStatus(HTTP_statuses.UNAUTHORIZED_401)
    }

    console.log('user in login:', user)
    const token = await jwtServises.createJwt(user.id)
    return res.status(HTTP_statuses.OK_200).send({
        accessToken: token
    })
})