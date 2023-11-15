import {deviceRepository} from "../repositories/devices-rep";
import {DeviceMainType} from "../types/devices-types";
import {ObjectId} from "mongodb";
import {randomUUID} from "crypto";

export const deviceServices = {
    async addNewDevice (device:DeviceMainType){

        return await deviceRepository.addNewDevice(device)
    },
    async changeDevice(deviseId:string, lastActiveDate:string){

        return await deviceRepository.changeDevice(deviseId, lastActiveDate)
    }
}