import {UsersCreate} from "../types/users/users-create";
import {UsersMainType} from "../types/users/users-main-type";
import {usersRepository} from "../repositories/users-rep";
import bcrypt from 'bcrypt';
import {UserDbType} from "../types/users/user-db-type";


export const usresServises = {
    async createUser(data: UsersCreate) {

        const passwordSalt: string = await bcrypt.genSalt(10)
        const passwordHash: string = await this.PasswordHash(data.password, passwordSalt)


        const new_user: UserDbType = {

            id: new Date().toISOString(),
            login: data.login,
            email: data.email,
            passwordSalt,
            passwordHash,
            createdAt: new Date().toISOString()
        }

        return usersRepository.createUser(new_user)

    },
    async PasswordHash(password:string, passwordSalt:string){
        const hash = await bcrypt.hash(password, passwordSalt)
        console.log('hash' + hash)
        return hash
    },
    async deleteUser(id:string){

        return usersRepository.deleteUser(id)
    }

}