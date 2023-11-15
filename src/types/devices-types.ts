import {ObjectId} from "mongodb";

export type DeviceMainType = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string,
    userId:ObjectId
}
// export type DeviceCreateType = {
//     ip: string,
//     title: string,
//     lastActiveDate: string,
//     userId:ObjectId
// }