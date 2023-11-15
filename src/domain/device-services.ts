import {deviceRepository} from "../repositories/devices-rep";
import {DeviceMainType} from "../types/devices-types";

export const deviceServices = {
    async addNewDevice (device:DeviceMainType):Promise<boolean>{

        return await deviceRepository.addNewDevice(device)
    },
    async changeDevice(deviseId:string, lastActiveDate:string):Promise<boolean>{

        return await deviceRepository.changeDevice(deviseId, lastActiveDate)
    },
    async deleteDevice(deviseId:string):Promise<boolean>{

        return await deviceRepository.deleteDevice(deviseId)
    },
    async deleteAllOtherDevices(userId:string, deviceId:string):Promise<boolean>{
        return await deviceRepository.deleteAllOtherDevices(userId,deviceId)
    },
    async deleteDeviceById(deviceId: string):Promise<boolean> {

        return await deviceRepository.deleteDeviceById(deviceId)
    }
}