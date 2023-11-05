import {Response, Request, Router} from "express";
import {HTTP_STATUSES} from "../data/HTTP_STATUSES";
import {
    InputValidationAuth,
    InputValidationUsers
} from "../middleware/arrays_of_input_validation";
import {jwtServices} from "../application/jwt-services";
import {UsersMainType} from "../types/users/users-main-type";
import {authServices} from "../domain/auth-services";
import {errorsChecking} from "../middleware/errors_checking";


export const AuthRouter = Router({})

AuthRouter.post('/login', InputValidationAuth.login, errorsChecking, async (req: Request<{}, {}, {
    loginOrEmail: string,
    password: string
}>, res: Response) => {
    const user: UsersMainType | null = await authServices.login(req.body.loginOrEmail, req.body.password)

    if (!user) {
        return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    }


    const token = await jwtServices.createJwt(user.id.toString())
    return res.status(HTTP_STATUSES.OK_200).send({
        accessToken: token
    })
})

AuthRouter.post('/registration', InputValidationUsers.post, errorsChecking, async (req: Request<{}, {}, {
    login: string,
    password: string,
    email: string
}>, res: Response) => {

    const user: UsersMainType|null  = await authServices.createUser({

        login: req.body.login,
        password: req.body.password,
        email: req.body.email
    })

    if(!user) return res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

})

AuthRouter.post('/registration-confirmation',InputValidationAuth.registrationConfirmation, errorsChecking, async (req:Request<{},{},{code:string}>, res:Response)=>{

    const result: boolean = await authServices.confirmEmail(req.body.code)

    if (!result) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

})

AuthRouter.post('/registration-email-resending', InputValidationAuth.registrationEmailResending, errorsChecking , async (req:Request<{},{},{email:string}>, res:Response)=>{
    const result: boolean = await authServices.resendCode(req.body.email)

    if (!result) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})