import {UsersCreate} from "../types/users/users-create";
import {UsersMainType} from "../types/users/users-main-type";
import {usersRepository} from "../repositories/users-rep";


export const usresServises = {
    async createUser(data: UsersCreate) {


        const new_user: UsersMainType = {

            id: new Date().toISOString(),
            login: data.login,
            email: data.email,
            createdAt: new Date().toISOString()
        }

        return usersRepository.createUser(new_user)

    },
    async deleteUser(id:string){

        return usersRepository.deleteUser(id)
    }

}