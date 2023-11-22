import {ObjectId} from "mongodb";
import mongoose from "mongoose";

export type DeviceMainType = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string,
    userId:ObjectId
}
export type DeviceViewType = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string
}
export const DevicesSchema = new mongoose.Schema<DeviceMainType>({
    ip: String,
    title: String,
    lastActiveDate: String,
    deviceId: String,
    userId:ObjectId
})