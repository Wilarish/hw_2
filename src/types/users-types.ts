import {ObjectId} from "mongodb";
import mongoose from "mongoose";


export type UsersViewType = {
    id: ObjectId,
    login: string,
    email: string,
    createdAt: string,
}

export type UsersMainType = {
    id: ObjectId,
    login: string,
    email: string,
    passwordSalt: string,
    passwordHash: string,
    createdAt: string,
    emailConfirmation: ConfirmationEmailType,
}
export type ConfirmationEmailType = {
    confirmationCode: string,
    expirationDate: Date | string,
    isConfirmed: boolean
}
// export const confirmationFields = {
//     confirmationCode: String,
//     expirationDate: Date,
//     isConfirmed: Boolean
// };

export type UsersCreate = {
    login: string,
    password: string,
    email: string
}
export const UsersSchema = new mongoose.Schema<UsersMainType>({
    id: ObjectId,
    login: String,
    email: String,
    passwordSalt: String,
    passwordHash: String,
    createdAt: String,
    emailConfirmation: {
        confirmationCode: String,
        expirationDate: String,
        isConfirmed: Boolean
    }
})