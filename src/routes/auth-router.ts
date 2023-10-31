import {Response, Request, Router} from "express";
import {HTTP_statuses} from "../data/HTTP_statuses";
import {errorsChecking, paramsCheckingAuth} from "../middleware/middleware_input_validation";
import {InputValidationLogin, InputValidationUsers} from "../middleware/arrays_of_input_validation";
import {jwtServises} from "../application/jwt-servises";
import {UsersMainType} from "../types/users/users-main-type";
import {AuthService} from "../domain/auth-services";


export const AuthRouter = Router({})

AuthRouter.post('/login', InputValidationLogin.post, errorsChecking, async (req: Request<{}, {}, {
    loginOrEmail: string,
    password: string
}>, res: Response) => {
    const user: UsersMainType | null = await AuthService.login(req.body.loginOrEmail, req.body.password)

    if (!user) {
        return res.sendStatus(HTTP_statuses.UNAUTHORIZED_401)
    }

    console.log('user in login:', user)
    const token = await jwtServises.createJwt(user.id.toString())
    return res.status(HTTP_statuses.OK_200).send({
        accessToken: token
    })
})

AuthRouter.post('/registration', InputValidationUsers.post, errorsChecking, async (req: Request<{}, {}, {
    login: string,
    password: string,
    email: string
}>, res: Response) => {

    const user: UsersMainType|null  = await AuthService.createUser({

        login: req.body.login,
        password: req.body.password,
        email: req.body.email
    })

    if(!user) return res.sendStatus(HTTP_statuses.SERVER_ERROR_500)

    return res.sendStatus(HTTP_statuses.NO_CONTENT_204)

})

AuthRouter.post('/registration-confirmation',paramsCheckingAuth.code, errorsChecking, async (req:Request<{},{},{code:string}>, res:Response)=>{

    const result: boolean = await AuthService.confirmEmail(req.body.code)

    if (!result) return res.sendStatus(HTTP_statuses.BAD_REQUEST_400)

    return res.sendStatus(HTTP_statuses.NO_CONTENT_204)

})

AuthRouter.post('registration-email-resending', paramsCheckingAuth.email, errorsChecking , async (req:Request<{},{},{email:string}>, res:Response)=>{
    const result: boolean = await AuthService.resendCode(req.body.email)

    if (!result) return res.sendStatus(HTTP_statuses.BAD_REQUEST_400)

    return res.sendStatus(HTTP_statuses.NO_CONTENT_204)
})