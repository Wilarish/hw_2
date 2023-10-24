import {ObjectId} from "mongodb";

export type UsersMainType = {
    id: ObjectId,
    login: string,
    email: string,
    passwordSalt: string,
    passwordHash:string,
    createdAt: string
}