import {emailAdapter} from "../adapters/email-adapter";

export const emailServices={
    async SendEmailForRegistration(email:string, confirmationCode:string){

        const subject: string = "Registration"

        const message: string =`<h1>Thanks for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
        </p>`
        return emailAdapter.SendEmail(email, subject, message)
    }
}