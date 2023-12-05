import {Response, Request, Router} from "express";
import {HTTP_STATUSES} from "../data/HTTP_STATUSES";
import {
    InputValidationAuth,
    InputValidationUsers
} from "../middleware/arrays_of_input_validation";
import {UsersMainType} from "../types/users-types";
import {errorsCheckingForStatus400, errorsCheckingForStatus401} from "../middleware/errors_checking";
import {CheckJwtToken} from "../middleware/auth/refresh_token";
import {authBearer} from "../middleware/auth/auth_bearer";
import {rateLimit} from "../middleware/rate_limit/rate-limit";
import {AuthServices} from "../application/auth-services";
import {UsersServices} from "../application/users-services";


class AuthControllerInstance {
    private authServices: AuthServices;
    private usersServices: UsersServices;
    constructor() {
        this.authServices = new AuthServices()
        this.usersServices = new UsersServices()
    }
    async getInfoAboutMe(req: Request, res: Response) {
        const result = await this.usersServices.getInformationAboutMe(req.userId)
        res.status(HTTP_STATUSES.OK_200).send(result)
    }

    async login(req: Request<{}, {}, {
        loginOrEmail: string,
        password: string
    }>, res: Response) {
        const user: UsersMainType | null = await this.authServices.login(req.body.loginOrEmail, req.body.password)

        if (!user) {
            return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        }

        let userIp = req.headers['x-forwarded-for'] || [req.socket.remoteAddress]


        const data: any | null = await this.authServices.createTokensAndDevice(
            user.id.toString(),
            userIp.toString(),
            req.headers['user-agent']!.toString())


        return res
            .cookie('refreshToken', data.refreshToken, {httpOnly: true, secure: true})
            .status(HTTP_STATUSES.OK_200)
            .send({
                accessToken: data.accessToken
            })
    }

    async refreshToken(req: Request, res: Response) {

        const result = await this.authServices.refreshTokenAndChangeDevices(req.cookies.refreshToken)
        if (!result) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)

        return res

            .cookie('refreshToken', result.refreshToken, {httpOnly: true, secure: true})
            .status(HTTP_STATUSES.OK_200)
            .send({
                accessToken: result.accessToken
            })
    }

    async logout(req: Request, res: Response) {
        const result: boolean = await this.authServices.revokeTokenAndDeleteDevice(req.cookies.refreshToken)
        if (!result) return res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)

        return res.clearCookie('refreshToken').sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async registration(req: Request<{}, {}, {
        login: string,
        password: string,
        email: string
    }>, res: Response) {

        const result: boolean = await this.authServices.createUser({

            login: req.body.login,
            password: req.body.password,
            email: req.body.email
        })

        if (!result) return res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)

        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

    }

    async registrationConfirmation(req: Request<{}, {}, { code: string }>, res: Response) {

        const result: boolean = await this.authServices.confirmEmail(req.body.code)

        if (!result) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)

        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

    }

    async registrationEmailResending(req: Request<{}, {}, { email: string }>, res: Response) {
        const result: boolean = await this.authServices.resendCode(req.body.email)

        if (!result) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)

        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async passwordRecovery(req: Request<{}, {}, { email: string }>, res: Response) {
        const result: boolean = await this.authServices.refreshPassword(req.body.email)

        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async newPassword(req: Request<{}, {}, { newPassword: string, recoveryCode: string }>, res: Response) {
        const result: boolean = await this.authServices.newPassword(req.body.newPassword, req.body.recoveryCode)

        if (!result) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

    }
}

export const AuthRouter = Router({})
const authController = new AuthControllerInstance()


AuthRouter.get('/me', authBearer, authController.getInfoAboutMe)

AuthRouter.post('/login', rateLimit, InputValidationAuth.login, errorsCheckingForStatus400, authController.login.bind(authController))

AuthRouter.post('/refresh-token', CheckJwtToken.refreshToken, errorsCheckingForStatus401, authController.refreshToken.bind(authController))

AuthRouter.post('/logout', CheckJwtToken.refreshToken, errorsCheckingForStatus401, authController.logout.bind(authController))

AuthRouter.post('/registration', rateLimit, InputValidationUsers.post, errorsCheckingForStatus400, authController.registration.bind(authController))

AuthRouter.post('/registration-confirmation', rateLimit, InputValidationAuth.registrationConfirmation, errorsCheckingForStatus400, authController.registrationConfirmation.bind(authController))

AuthRouter.post('/registration-email-resending', rateLimit, InputValidationAuth.registrationEmailResending, errorsCheckingForStatus400, authController.registrationEmailResending.bind(authController))

AuthRouter.post('/password-recovery', rateLimit, InputValidationAuth.password_recovery, errorsCheckingForStatus400, authController.passwordRecovery.bind(authController))

AuthRouter.post('/new-password', rateLimit, InputValidationAuth.new_password, errorsCheckingForStatus400, authController.newPassword.bind(authController))