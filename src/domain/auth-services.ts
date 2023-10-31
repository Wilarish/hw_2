import {UsersCreate} from "../types/users/users-create";
import {UsersMainType} from "../types/users/users-main-type";
import bcrypt from "bcrypt";
import {ObjectId, UUID} from "mongodb";
import {usersRepository} from "../repositories/users-rep";
import {randomUUID} from "crypto";
import { add } from "date-fns";
import {EmailServices} from "./email-services";

export const AuthService={
    async createUser(data: UsersCreate): Promise<UsersMainType|null> {

        const passwordSalt: string = await bcrypt.genSalt(10)
        const passwordHash: string = await this.passwordHash(data.password, passwordSalt)


        const new_user: UsersMainType = {

            id: new ObjectId(),
            login: data.login,
            email: data.email,
            passwordSalt,
            passwordHash,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate:add(new Date(),{hours:2, minutes:3}),
                isConfirmed: false
            }

        }

        const result = await usersRepository.createUser(new_user)

        try {
            await EmailServices.SendEmailForRegistration(new_user)
        }
        catch (error){
            console.error(error)
            return null
        }
        console.log(new_user)

        return result

    },
    async passwordHash(password: string, passwordSalt: string): Promise<string> {
        return await bcrypt.hash(password, passwordSalt)
    },
    async confirmEmail(code:string):Promise<boolean>{
        const user: UsersMainType | null = await usersRepository.findUserByConfirmationCode(code)

        if(!user) return false
        if(user.emailConfirmation.isConfirmed) return false
        if(user.emailConfirmation.confirmationCode !== code) return false
        if( user.emailConfirmation.expirationDate < new Date()) return false

        const result:boolean = await usersRepository.updateConfirmation(user.id)
        return result
    },
    async resendCode(email:string):Promise<boolean>{

        const user:UsersMainType|null = await usersRepository.findUserByLoginOrEmail(email)

        if(!user) return false

        const newConfirmationCode = randomUUID();
        user.emailConfirmation.confirmationCode = newConfirmationCode;
        await usersRepository.updateConfirmationCode(user.id,newConfirmationCode)

        try {
            await EmailServices.SendEmailForRegistration(user)//user.email, newConfirmationCode
        }
        catch (error){
            console.error(error)
            return false
        }

        return true
    },
    async login(loginOrEmail: string, password: string): Promise<UsersMainType| null> {
        const user: UsersMainType | null = await usersRepository.findUserByLoginOrEmail(loginOrEmail)

        if (!user) return null
        if(!user.emailConfirmation.isConfirmed) return null

        const hash: string = await this.passwordHash(password, user.passwordSalt)
        if (hash !== user.passwordHash) return null

        return user


    }
}