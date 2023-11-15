import {DeviceMainType} from "../types/devices-types";
import {devices_db} from "../data/DB";

export const deviceRepository = {
    async addNewDevice(device: DeviceMainType){
        await devices_db.insertOne(device)
        return true
    },
    async findDeviceById(deviceId:string){
        const device:DeviceMainType|null = await devices_db.findOne({deviceId:deviceId})
        return device
    },
    async changeDevice(deviceId:string,lastActiveDate:string){
        const result = await devices_db.updateOne({deviceId:deviceId},{$set:{lastActiveDate:lastActiveDate}})
        return result.matchedCount === 1
    }
}