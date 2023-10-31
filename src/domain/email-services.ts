import {EmailAdapter} from "../adapters/email-adapter";
import {UsersMainType} from "../types/users/users-main-type";

export const EmailServices={
    async SendEmailForRegistration(user:UsersMainType){

        const subject: string = "Registration"

        const message: string =`<h1>Thanks for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${user.emailConfirmation.confirmationCode}'>complete registration</a>
        </p>`

        //const message = 'https://hw-00qb.onrender.com/auth/registration-confirmation?code='+ user.emailConfirmation.confirmationCode

        return EmailAdapter.SendEmail(user.email, subject, message)
    }
}