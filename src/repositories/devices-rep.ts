import {DeviceMainType} from "../types/devices-types";
import {devices_db} from "../data/DB";
import {ObjectId} from "mongodb";

export const deviceRepository = {
    async addNewDevice(device: DeviceMainType): Promise<boolean> {
        await devices_db.insertOne(device)
        return true
    },
    async findDeviceByUserAndDeviceId(userId: string, deviceId: string): Promise<DeviceMainType | null> {
        return await devices_db.findOne({userId: new ObjectId(userId), deviceId: deviceId})
    },
    async findDeviceById(deviceId: string): Promise<DeviceMainType | null> {
        return await devices_db.findOne({deviceId: deviceId})
    },
    async changeDevice(deviceId: string, lastActiveDate: string): Promise<boolean> {
        const result = await devices_db.updateOne({deviceId: deviceId}, {$set: {lastActiveDate: lastActiveDate}})
        return result.matchedCount === 1
    },
    async deleteDevice(deviceId: string): Promise<boolean> {
        const result = await devices_db.deleteOne({deviceId: deviceId})
        return result.deletedCount === 1
    },
    async deleteAllOtherDevices(userId: string, deviceId: string): Promise<boolean> {
        const result = await devices_db.deleteMany({userId: new ObjectId(userId), deviceId: {$ne: deviceId}})
        return true
    },
    async deleteDeviceById(deviceId: string) {
        const result = await devices_db.deleteOne({deviceId: deviceId})
        return result.deletedCount === 1
    }
}
