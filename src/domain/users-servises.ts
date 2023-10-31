import {UsersCreate} from "../types/users/users-create";
import {UsersMainType} from "../types/users/users-main-type";
import {usersRepository} from "../repositories/users-rep";
import bcrypt from 'bcrypt';
import {ObjectId} from "mongodb";


export const usresServises = {
    async createUser(data: UsersCreate): Promise<UsersMainType|null> {

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

        return usersRepository.createUser(new_user)

    },
    async passwordHash(password: string, passwordSalt: string): Promise<string> {
        return await bcrypt.hash(password, passwordSalt)
    },
    async deleteUser(id: string): Promise<boolean> {

        return usersRepository.deleteUser(id)
    },


}