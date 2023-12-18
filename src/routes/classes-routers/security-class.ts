import {DevicesRepository} from "../../repositories/devices-rep";
import {QueryDevicesRepository} from "../../repositories/query/query-devices-rep";
import {DeviceServices} from "../../application/device-services";
import {Request, Response} from "express";
import {DeviceMainType, DeviceViewType} from "../../types/devices-types";
import {HTTP_STATUSES} from "../../data/HTTP_STATUSES";

export class SecurityControllerInstance {

    constructor(protected deviceRepository: DevicesRepository,
                protected queryDevicesRepository: QueryDevicesRepository,
                protected deviceServices: DeviceServices) {
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