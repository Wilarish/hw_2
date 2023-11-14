
import {UsersCreate, UsersMainType} from "../types/users-types";
import {usersRepository} from "../repositories/users-rep";
import bcrypt from 'bcrypt';
import {ObjectId} from "mongodb";
import {HashAdapter} from "../adapters/hash-adapter";


export const usersServices = {
    async getInformationAboutMe(userId:string){
        const user:UsersMainType|null = await usersRepository.findUserById(userId)
        return{
            email:user?.email,
            login:user?.login,
            userId:user?.id
        }
    },
    async createUser(data: UsersCreate): Promise<string> {

        const passwordSalt: string = await bcrypt.genSalt(10)
        const passwordHash: string = await HashAdapter.passwordHash(data.password, passwordSalt)


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
    async deleteUser(id: string): Promise<boolean> {

        return usersRepository.deleteUser(id)
    },


}