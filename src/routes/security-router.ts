import {Router, Request,Response} from "express";
import {CheckJwtToken} from "../middleware/auth/refresh_token";
import {errorsCheckingForStatus401} from "../middleware/errors_checking";
import {queryDevicesRepository} from "../repositories/query/query-devices-rep";
import {DeviceMainType, DeviceViewType} from "../types/devices-types";
import {HTTP_STATUSES} from "../data/HTTP_STATUSES";
import {deviceServices} from "../domain/device-services";
import {deviceRepository} from "../repositories/devices-rep";
import {de} from "date-fns/locale";

export const SecurityRouter = Router({})

SecurityRouter.get('/devices', CheckJwtToken.rT, async (req:Request, res:Response)=>{
    const devices:DeviceViewType[]|null = await queryDevicesRepository.findDevicesByUserId(req.userId)
    if(!devices) return res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
    return res.status(HTTP_STATUSES.OK_200).send(devices)
})
SecurityRouter.delete('/devices', CheckJwtToken.rT,async (req:Request, res:Response)=>{
    const result:boolean = await deviceServices.deleteAllOtherDevices(req.userId, req.deviceId)
    if(!result) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
SecurityRouter.delete('/devices/:id', CheckJwtToken.rT, async (req:Request, res:Response)=>{
    const device:DeviceMainType|null = await deviceRepository.findDeviceById(req.deviceId)
    if(!device) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    if(device.userId.toString() !== req.userId) return res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)

    const result:boolean = await deviceServices.deleteDeviceById(req.deviceId)
    if(!result) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})