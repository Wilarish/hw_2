import {DeviceViewType} from "../../types/devices-types";
import {ObjectId} from "mongodb";
import {DevicesModel} from "../../domain/models/models";
import "reflect-metadata"
import {injectable} from "inversify";
@injectable()
export class QueryDevicesRepository {
    async findDevicesByUserId(userId:string):Promise<DeviceViewType[]|null>{
        return DevicesModel.find({userId:new ObjectId(userId)}).select({ _id: 0, __v:0, userId:0}).lean()
    }
}
