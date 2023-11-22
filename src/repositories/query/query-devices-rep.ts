import {DeviceViewType} from "../../types/devices-types";
import {ObjectId} from "mongodb";
import {DevicesModel} from "../../data/DB";

export const queryDevicesRepository = {
    async findDevicesByUserId(userId:string):Promise<DeviceViewType[]|null>{
        return DevicesModel.find({userId:new ObjectId(userId)}, {projection: {_id: 0, userId:0}}).lean()
    },
}
