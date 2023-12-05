import {Router, Request, Response} from "express";
import {CheckJwtToken} from "../middleware/auth/refresh_token";
import {QueryDevicesRepository} from "../repositories/query/query-devices-rep";
import {DeviceMainType, DeviceViewType} from "../types/devices-types";
import {HTTP_STATUSES} from "../data/HTTP_STATUSES";
import {DeviceServices } from "../application/device-services";
import {DevicesRepository} from "../repositories/devices-rep";

class SecurityControllerInstance {
    private deviceRepository: DevicesRepository;
    private queryDevicesRepository: QueryDevicesRepository;
    private deviceServices: DeviceServices;
    constructor() {
        this.deviceRepository =new DevicesRepository()
        this.queryDevicesRepository =new QueryDevicesRepository()
        this.deviceServices =new DeviceServices()
    }
    async getDevices(req: Request, res: Response) {
        const devices: DeviceViewType[] | null = await this.queryDevicesRepository.findDevicesByUserId(req.userId)
        if (!devices) return res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        return res.status(HTTP_STATUSES.OK_200).send(devices)
    }

    async deleteAllOtherDevices(req: Request, res: Response) {
        const result: boolean = await this.deviceServices.deleteAllOtherDevices(req.userId, req.deviceId)
        if (!result) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async deleteDeviceById(req: Request<{ id: string }>, res: Response) {
        const deviceId = req.params.id
        const device: DeviceMainType | null = await this.deviceRepository.findDeviceById(deviceId)
        if (!device) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        if (device.userId.toString() !== req.userId) return res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)

        const result: boolean = await this.deviceServices.deleteDeviceById(deviceId)
        if (!result) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}

export const SecurityRouter = Router({})
const securityController = new SecurityControllerInstance()

SecurityRouter.get('/devices', CheckJwtToken.rT, securityController.getDevices.bind(securityController))
SecurityRouter.delete('/devices', CheckJwtToken.rT, securityController.deleteAllOtherDevices.bind(securityController))
SecurityRouter.delete('/devices/:id', CheckJwtToken.rT, securityController.deleteDeviceById.bind(securityController))