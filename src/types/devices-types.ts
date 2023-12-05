import {ObjectId} from "mongodb";
import mongoose from "mongoose";

export class DeviceMainType  {
    constructor(
        public ip: string,
        public title: string,
        public lastActiveDate: string,
        public deviceId: string,
        public userId:ObjectId
    ) {
    }
}
export class DeviceViewType  {
    constructor(
        public ip: string,
        public title: string,
        public lastActiveDate: string,
        public deviceId: string,
    ) {
    }
}
