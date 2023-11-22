import {emailAdapter} from "../adapters/email-adapter";

export const emailServices={
    async SendEmailForRegistration(email:string, confirmationCode:string){

        const subject: string = "Registration"

        const message: string =`<h1>Thanks for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
        </p>`
        return emailAdapter.SendEmail(email, subject, message)
    },
    async SendEmailForRefreshPassword(email:string, recoveryCode:string){

        const subject: string = "Refreshing password"

        const message: string =`<h1>Thanks for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${recoveryCode}'>refreshing password</a>
        </p>`
        return emailAdapter.SendEmail(email, subject, message)
    }
}