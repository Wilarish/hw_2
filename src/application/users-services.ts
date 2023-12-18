import {UsersCreate, UsersMainType} from "../types/users-types";
import {UsersRepository} from "../repositories/users-rep";
import bcrypt from 'bcrypt';
import {ObjectId} from "mongodb";
import {HashAdapter} from "../adapters/hash-adapter";

export class UsersServices {

    constructor(protected usersRepository:UsersRepository) {
    }
    async getInformationAboutMe(userId: string) {
        const user: UsersMainType | null = await this.usersRepository.findUserById(userId)
        return {
            email: user?.email,
            login: user?.login,
            userId: user?.id
        }
    }

    async createUser(data: UsersCreate): Promise<string> {

        const passwordSalt: string = await bcrypt.genSalt(10)
        const passwordHash: string = await HashAdapter.passwordHash(data.password, passwordSalt)


        const new_user: UsersMainType = new UsersMainType(
            new ObjectId(),
            data.login,
            data.email,
            passwordSalt,
            passwordHash,
            new Date().toISOString(),
            {
                confirmationCode: "SuperUs erCode",
                expirationDate: new Date().toISOString(),
                isConfirmed: true
            })

        return await this.usersRepository.createUser(new_user)

    }

    async deleteUser(id: string): Promise<boolean> {

        return this.usersRepository.deleteUser(id)
    }
}

