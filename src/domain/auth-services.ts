import {UsersCreate, UsersMainType} from "../types/users-types";
import bcrypt from "bcrypt";
import {ObjectId} from "mongodb";
import {usersRepository} from "../repositories/users-rep";
import {randomUUID} from "crypto";
import {add} from "date-fns";
import {emailServices} from "./email-services";
import {jwtAdapter} from "../adapters/jwt-adapet";
import {deviceServices} from "./device-services";

export const authServices = {
    async createUser(data: UsersCreate): Promise<boolean> {

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
                expirationDate: add(new Date(), {hours: 2, minutes: 3}),
                isConfirmed: false
            }

        }

        await usersRepository.createUser(new_user)

        try {
            await emailServices.SendEmailForRegistration(new_user.email, new_user.emailConfirmation.confirmationCode)
        } catch (error) {
            console.error(error)
            return false
        }

        return true

    },
    async passwordHash(password: string, passwordSalt: string): Promise<string> {
        return await bcrypt.hash(password, passwordSalt)
    },
    async confirmEmail(code: string): Promise<boolean> {
        const user: UsersMainType | null = await usersRepository.findUserByConfirmationCode(code)

        if (!user) return false

        return  await usersRepository.updateConfirmation(user.id)

    },
    async resendCode(email: string): Promise<boolean> {

        const user: UsersMainType | null = await usersRepository.findUserByLoginOrEmail(email)

        if (!user) return false

        const newConfirmationCode = randomUUID();

        await usersRepository.updateConfirmationCode(user.id, newConfirmationCode)

        try {
            await emailServices.SendEmailForRegistration(user.email, newConfirmationCode)//user.email, newConfirmationCode
        } catch (error) {
            console.error(error)
            return false
        }

        return true
    },
    async login(loginOrEmail: string, password: string): Promise<UsersMainType | null> {
        const user: UsersMainType | null = await usersRepository.findUserByLoginOrEmail(loginOrEmail)

        if (!user) return null
        if (!user.emailConfirmation.isConfirmed) return null

        const hash: string = await this.passwordHash(password, user.passwordSalt)
        if (hash !== user.passwordHash) return null

        return user


    },
    async createTokensAndDevice(userId:string, ip:string, title:string){
        const accessToken: string = await jwtAdapter.createAccessJwt(userId)
        const refreshToken: string = await jwtAdapter.createRefreshJwt(userId, randomUUID())
        const decode:any = await jwtAdapter.decodeRefreshToken(refreshToken)

        const addDevice:boolean = await deviceServices.addNewDevice({
            ip: ip,
            title: title,
            lastActiveDate: decode!.iat?.toString(),
            deviceId:decode!.deviceId?.toString(),
            userId:new ObjectId(userId)
        })
        if(!addDevice) return null

        return{
            accessToken,
            refreshToken
        }
    },

    async refreshTokenAndChangeDevices(token:string){
        const  result  = await jwtAdapter.refreshToken(token)
        if(!result) return null

        const  change:boolean = await deviceServices.changeDevice(result.refreshToken.deviceId, result.refreshToken.iat)
        if(!change) return null
        return {
            refreshToken:result.refreshToken.token,
            accessToken:result.accessToken
        }
    },
    async revokeTokenAndDeleteDevice(token:string){

        const decode:any = await jwtAdapter.decodeRefreshToken(token)
        return await deviceServices.deleteDevice(decode.deviceId);

    }
}