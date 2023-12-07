import {DeviceMainType} from "../types/devices-types";
import {ObjectId} from "mongodb";
import {DevicesModel} from "../domain/models/models";

export class DevicesRepository {
    async addNewDevice(device: DeviceMainType): Promise<boolean> {
        const result=  await DevicesModel.create(device)
        console.log(result)
        return true
    }

    async findDeviceByUserAndDeviceId(userId: string, deviceId: string): Promise<DeviceMainType | null> {
        return DevicesModel.findOne({userId: new ObjectId(userId), deviceId: deviceId})
    }

    async findDeviceById(deviceId: string): Promise<DeviceMainType | null> {
        return DevicesModel.findOne({deviceId: deviceId})
    }

    async changeDevice(deviceId: string, lastActiveDate: string): Promise<boolean> {
        const result = await DevicesModel.updateOne({deviceId: deviceId}, {lastActiveDate})
        return result.matchedCount === 1
    }
    async deleteDevice(deviceId: string): Promise<boolean> {
        const result = await DevicesModel.deleteOne({deviceId: deviceId})
        return result.deletedCount === 1
    }
    async deleteAllOtherDevices(userId: string, deviceId: string): Promise<boolean> {
        const result = await DevicesModel.deleteMany({userId: new ObjectId(userId), deviceId: {$ne: deviceId}})
        return true
    }
    async deleteDeviceById(deviceId: string) {
        const result = await DevicesModel.deleteOne({deviceId: deviceId})
        return result.deletedCount === 1
    }

    async deleteAllDevices() {
        await DevicesModel.deleteMany({})
    }
}


