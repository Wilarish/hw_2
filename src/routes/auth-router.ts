import {Router} from "express";
import {
    InputValidationAuth,
    InputValidationUsers
} from "../middleware/arrays_of_input_validation";
import {errorsCheckingForStatus400, errorsCheckingForStatus401} from "../middleware/errors_checking";
import {CheckJwtToken} from "../middleware/auth/refresh_token";
import {authBearer} from "../middleware/auth/auth_bearer";
import {rateLimit} from "../middleware/rate_limit/rate-limit";
import {container} from "../composition-root";
import {AuthControllerInstance} from "./classes-routers/auth-class";

//import {authController} from "../composition-root";




export const AuthRouter = Router({})
const authController = container.resolve(AuthControllerInstance)



AuthRouter.get('/me', authBearer, authController.getInfoAboutMe.bind(authController))

AuthRouter.post('/login', rateLimit, InputValidationAuth.login, errorsCheckingForStatus400, authController.login.bind(authController))

AuthRouter.post('/refresh-token', CheckJwtToken.refreshToken, errorsCheckingForStatus401, authController.refreshToken.bind(authController))

AuthRouter.post('/logout', CheckJwtToken.refreshToken, errorsCheckingForStatus401, authController.logout.bind(authController))

AuthRouter.post('/registration', rateLimit, InputValidationUsers.post, errorsCheckingForStatus400, authController.registration.bind(authController))

AuthRouter.post('/registration-confirmation', rateLimit, InputValidationAuth.registrationConfirmation, errorsCheckingForStatus400, authController.registrationConfirmation.bind(authController))

AuthRouter.post('/registration-email-resending', rateLimit, InputValidationAuth.registrationEmailResending, errorsCheckingForStatus400, authController.registrationEmailResending.bind(authController))

AuthRouter.post('/password-recovery', rateLimit, InputValidationAuth.password_recovery, errorsCheckingForStatus400, authController.passwordRecovery.bind(authController))

AuthRouter.post('/new-password', rateLimit, InputValidationAuth.new_password, errorsCheckingForStatus400, authController.newPassword.bind(authController))