import {UsersCreate, UsersMainType} from "../types/users-types";
import bcrypt from "bcrypt";
import {ObjectId} from "mongodb";
import {randomUUID} from "crypto";
import {add} from "date-fns";
import {jwtAdapter} from "../adapters/jwt-adapet";
import {HashAdapter} from "../adapters/hash-adapter";
import {DeviceMainType} from "../types/devices-types";
import {UsersRepository} from "../repositories/users-rep";
import {EmailServices} from "./email-services";
import {DeviceServices} from "./device-services";

export class AuthServices {

    constructor(protected usersRepository: UsersRepository,
                protected emailServices: EmailServices,
                protected deviceServices: DeviceServices) {

    }

    async createUser(data: UsersCreate): Promise<boolean> {

        const passwordSalt: string = await bcrypt.genSalt(10)
        const passwordHash: string = await this.passwordHash(data.password, passwordSalt)

        const new_user: UsersMainType = new UsersMainType(
            new ObjectId(),
            data.login,
            data.email,
            passwordSalt,
            passwordHash,
            new Date().toISOString(),
            {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {hours: 2, minutes: 3}),
                isConfirmed: false
            }
        )

        await this.usersRepository.createUser(new_user)

        try {
            await this.emailServices.SendEmailForRegistration(new_user.email, new_user.emailConfirmation.confirmationCode)
        } catch (error) {
            console.error(error)
            return false
        }

        return true

    }

    async passwordHash(password: string, passwordSalt: string): Promise<string> {
        return await bcrypt.hash(password, passwordSalt)
    }

    async confirmEmail(code: string): Promise<boolean> {
        const user: UsersMainType | null = await this.usersRepository.findUserByConfirmationCode(code)

        if (!user) return false

        return await this.usersRepository.updateConfirmation(user.id)

    }

    async resendCode(email: string): Promise<boolean> {

        const user: UsersMainType | null = await this.usersRepository.findUserByLoginOrEmail(email)

        if (!user) return false

        const newConfirmationCode = randomUUID();

        await this.usersRepository.updateConfirmationCode(user.id, newConfirmationCode)

        try {
            await this.emailServices.SendEmailForRegistration(user.email, newConfirmationCode)//user.email, newConfirmationCode
        } catch (error) {
            console.error(error)
            return false
        }

        return true
    }

    async login(loginOrEmail: string, password: string): Promise<UsersMainType | null> {
        const user: UsersMainType | null = await this.usersRepository.findUserByLoginOrEmail(loginOrEmail)

        if (!user) return null
        if (!user.emailConfirmation.isConfirmed) return null

        const hash: string = await this.passwordHash(password, user.passwordSalt)
        if (hash !== user.passwordHash) return null

        return user


    }

    async createTokensAndDevice(userId: string, ip: string, title: string) {
        const accessToken: string = await jwtAdapter.createAccessJwt(userId)
        const refreshToken: string = await jwtAdapter.createRefreshJwt(userId, randomUUID())
        const decode: any = await jwtAdapter.decodeRefreshToken(refreshToken)


        const device = new DeviceMainType(
            ip,
            title,
            new Date(decode!.iat! * 1000).toISOString(),
            decode.deviceId?.toString(),
            new ObjectId(userId)
        )

        const addDevice: boolean = await this.deviceServices.addNewDevice(device)
        if (!addDevice) return null

        return {
            accessToken,
            refreshToken
        }
    }

    async refreshTokenAndChangeDevices(token: string) {
        const result = await jwtAdapter.refreshToken(token)
        if (!result) return null

        const change: boolean = await this.deviceServices.changeDevice(result.refreshToken.deviceId, result.refreshToken.iat)
        if (!change) return null
        return {
            refreshToken: result.refreshToken.token,
            accessToken: result.accessToken
        }
    }

    async revokeTokenAndDeleteDevice(token: string): Promise<boolean> {

        const decode: any = await jwtAdapter.decodeRefreshToken(token)
        return await this.deviceServices.deleteDevice(decode.deviceId);

    }

    async refreshPassword(email: string): Promise<boolean> {
        const user: UsersMainType | null = await this.usersRepository.findUserByLoginOrEmail(email)

        if (!user) {
            console.log('not existed user')
            return false
        }
        const recoveryCode: string = await jwtAdapter.createPasswordRecoveryJwt(user.id.toString())
        console.log(recoveryCode)

        await this.emailServices.SendEmailForRefreshPassword(email, recoveryCode)

        return true
    }

    async newPassword(newPassword: string, recoveryCode: string): Promise<boolean> {
        const userId: string | null = await jwtAdapter.findUserByToken(recoveryCode)
        if (!userId) return false

        const passwordSalt: string = await bcrypt.genSalt(10)
        const passwordHash: string = await HashAdapter.passwordHash(newPassword, passwordSalt)

        return this.usersRepository.changeHashAndSalt(userId, passwordHash, passwordSalt)
    }
}
