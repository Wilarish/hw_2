import {DeviceViewType} from "../../types/devices-types";
import {devices_db} from "../../data/DB";
import {ObjectId} from "mongodb";

export const queryDevicesRepository = {
    async findDevicesByUserId(userId:string):Promise<DeviceViewType[]|null>{
        return await devices_db.find({userId:new ObjectId(userId)}, {projection: {_id: 0, userId:0}}).toArray()
    },
}
