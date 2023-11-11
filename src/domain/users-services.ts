
import {UsersCreate, UsersMainType} from "../types/users-types";
import {usersRepository} from "../repositories/users-rep";
import bcrypt from 'bcrypt';
import {ObjectId} from "mongodb";


export const usersServices = {
    async createUser(data: UsersCreate): Promise<string> {

        const passwordSalt: string = await bcrypt.genSalt(10)
        const passwordHash: string = await this.passwordHash(data.password, passwordSalt)


        const new_user: UsersMainType = {

            id: new ObjectId(),
            login: data.login,
            email: data.email,
            passwordSalt,
            passwordHash,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: "SuperUs erCode",
                expirationDate:new Date().toISOString(),
                isConfirmed: true
            }

        }

        return await usersRepository.createUser(new_user)

    },
    async passwordHash(password: string, passwordSalt: string): Promise<string> {
        return await bcrypt.hash(password, passwordSalt)
    },
    async deleteUser(id: string): Promise<boolean> {

        return usersRepository.deleteUser(id)
    },


}