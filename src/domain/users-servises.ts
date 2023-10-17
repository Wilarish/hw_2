import {UsersCreate} from "../types/users/users-create";
import {UsersMainType} from "../types/users/users-main-type";
import {usersRepository} from "../repositories/users-rep";
import bcrypt from 'bcrypt';
import {UsersViewType} from "../types/users/users-view-type";


export const usresServises = {
    async createUser(data: UsersCreate): Promise<UsersMainType|null> {

        const passwordSalt: string = await bcrypt.genSalt(10)
        const passwordHash: string = await this.passwordHash(data.password, passwordSalt)


        const new_user: UsersMainType = {

            id: new Date().toISOString(),
            login: data.login,
            email: data.email,
            passwordSalt,
            passwordHash,
            createdAt: new Date().toISOString()
        }

        return usersRepository.createUser(new_user)

    },
    async passwordHash(password: string, passwordSalt: string): Promise<string> {
        const hash = await bcrypt.hash(password, passwordSalt)

        return hash
    },
    async deleteUser(id: string): Promise<boolean> {

        return usersRepository.deleteUser(id)
    },
    async login(loginOrEmail: string, password: string): Promise<boolean> {
        const user: UsersMainType | null = await usersRepository.findUserByLoginOrEmail(loginOrEmail)

        if (!user) return false

        const hash: string = await this.passwordHash(password, user.passwordSalt)
        if (hash !== user.passwordHash) return false

        return true


    }

}