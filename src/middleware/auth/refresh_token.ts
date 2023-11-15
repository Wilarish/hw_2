import {cookie} from "express-validator";
import {jwtAdapter} from "../../adapters/jwt-adapet";
import {deviceRepository} from "../../repositories/devices-rep";
import {DeviceMainType} from "../../types/devices-types";
import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../../data/HTTP_STATUSES";

export const CheckJwtToken = {
    refreshToken: cookie('refreshToken').isJWT().custom(async (token) => {

        const userId: string | null = await jwtAdapter.findUserByToken(token)
        if (!userId) throw new Error('not valid token...user')

        const decode: any = await jwtAdapter.decodeRefreshToken(token)
        const device:DeviceMainType|null = await deviceRepository.findDeviceByUserAndDeviceId(decode.userId.toString(), decode.deviceId)
        if (!device) throw new Error('invalid userId or deviceId')

        if(device.lastActiveDate !== new Date(decode.iat *1000).toISOString()) throw new Error('invalid lastActiveDate')

        return true

    }),
    async rT(req: Request, res: Response, next: NextFunction){
        const refreshToken = req.cookies.refreshToken

        const userId: string | null = await jwtAdapter.findUserByToken(refreshToken)
        if (!userId) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)

        const decode: any = await jwtAdapter.decodeRefreshToken(refreshToken)

        const device:DeviceMainType|null = await deviceRepository.findDeviceByUserAndDeviceId(decode.userId.toString(), decode.deviceId)
        if (!device) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)

        if(device.lastActiveDate !== new Date(decode.iat *1000).toISOString()) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)

        req.userId = userId
        req.deviceId = decode.deviceId

        return next()

    }


}