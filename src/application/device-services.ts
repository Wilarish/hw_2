import { DevicesRepository} from "../repositories/devices-rep";
import {DeviceMainType} from "../types/devices-types";
export class DeviceServices {
    private deviceRepository: DevicesRepository;
    constructor() {
        this.deviceRepository =new DevicesRepository()
    }
    async addNewDevice (device:DeviceMainType):Promise<boolean>{

        return await this.deviceRepository.addNewDevice(device)
    }
    async changeDevice(deviseId:string, lastActiveDate:number):Promise<boolean>{

        const changeLastActiveDate  = new Date(lastActiveDate * 1000).toISOString()

        return await this.deviceRepository.changeDevice(deviseId, changeLastActiveDate)
    }
    async deleteDevice(deviseId:string):Promise<boolean>{

        return await this.deviceRepository.deleteDevice(deviseId)
    }
    async deleteAllOtherDevices(userId:string, deviceId:string):Promise<boolean>{
        return await this.deviceRepository.deleteAllOtherDevices(userId,deviceId)
    }
    async deleteDeviceById(deviceId: string):Promise<boolean> {

        return await this.deviceRepository.deleteDeviceById(deviceId)
    }
}
