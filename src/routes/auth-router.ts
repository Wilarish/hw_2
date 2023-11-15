import {Response, Request, Router} from "express";
import {HTTP_STATUSES} from "../data/HTTP_STATUSES";
import {
    InputValidationAuth,
    InputValidationUsers
} from "../middleware/arrays_of_input_validation";
import {jwtAdapter} from "../adapters/jwt-adapet";
import {UsersMainType} from "../types/users-types";
import {authServices} from "../domain/auth-services";
import {errorsCheckingForStatus400, errorsCheckingForStatus401} from "../middleware/errors_checking";
import {CheckJwtToken} from "../middleware/auth/refresh_token";
import {authBearer} from "../middleware/auth/auth_bearer";
import {usersServices} from "../domain/users-services";


export const AuthRouter = Router({})


AuthRouter.get('/me', authBearer, async (req: Request, res: Response) => {
    const result = await usersServices.getInformationAboutMe(req.userId)
    res.status(HTTP_STATUSES.OK_200).send(result)
})
AuthRouter.post('/login', InputValidationAuth.login, errorsCheckingForStatus400, async (req: Request<{}, {}, {
    loginOrEmail: string,
    password: string
}>, res: Response) => {
    const user: UsersMainType | null = await authServices.login(req.body.loginOrEmail, req.body.password)

    if (!user) {
        return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    }

    let userIp = req.headers['x-forwarded-for'] || [req.socket.remoteAddress]
    console.log('ip headers '+userIp)
    console.log('ip request '+req.ip)


    const data:any| null =  await authServices.createTokensAndDevice(
        user.id.toString(),
        userIp.toString(),
        req.headers['user-agent']!.toString())

    return res
        .cookie('refreshToken', data.refreshToken, {httpOnly: true, secure: true})
        .status(HTTP_STATUSES.OK_200)
        .send({
            accessToken: data.accessToken
        })
})
AuthRouter.post('/refresh-token', CheckJwtToken.refreshToken, errorsCheckingForStatus401, async (req: Request, res: Response) => {

    const result = await jwtAdapter.refreshToken(req.cookies.refreshToken)
    if(!result) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)

    return res

        .cookie('refreshToken', result.refreshToken, {httpOnly: true, secure: true})
        .status(HTTP_STATUSES.OK_200)
        .send({
            accessToken: result.accessToken
        })
})
AuthRouter.post('/logout', CheckJwtToken.refreshToken, errorsCheckingForStatus401, async (req: Request, res: Response) => {
    const result: boolean = await jwtAdapter.revokeToken(req.cookies.refreshToken)

    if (!result) return res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)

    return res.clearCookie('refreshToken').sendStatus(HTTP_STATUSES.NO_CONTENT_204)


})

AuthRouter.post('/registration', InputValidationUsers.post, errorsCheckingForStatus400, async (req: Request<{}, {}, {
    login: string,
    password: string,
    email: string
}>, res: Response) => {

    const result: boolean = await authServices.createUser({

        login: req.body.login,
        password: req.body.password,
        email: req.body.email
    })

    if (!result) return res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

})

AuthRouter.post('/registration-confirmation', InputValidationAuth.registrationConfirmation, errorsCheckingForStatus400, async (req: Request<{}, {}, {
    code: string
}>, res: Response) => {

    const result: boolean = await authServices.confirmEmail(req.body.code)

    if (!result) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

})

AuthRouter.post('/registration-email-resending', InputValidationAuth.registrationEmailResending, errorsCheckingForStatus400, async (req: Request<{}, {}, {
    email: string
}>, res: Response) => {
    const result: boolean = await authServices.resendCode(req.body.email)

    if (!result) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})