import {UsersMainType} from "../types/users-types";
import {ObjectId} from "mongodb";
import {UsersModel} from "../data/DB";
import {usersServices} from "../domain/users-services";


export const usersRepository = {

    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UsersMainType | null> {
        const user: UsersMainType | null = await UsersModel.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]} )

        return user
    },
    async findUserById(id: string) {
        const user: UsersMainType | null = await UsersModel.findOne({id: new ObjectId(id)})

        return user
    },
    async findUserByConfirmationCode(code:string){
        const user: UsersMainType | null = await UsersModel.findOne({'emailConfirmation.confirmationCode': code})

        return user
    },
    async createUser(user: UsersMainType): Promise<string> {
        await UsersModel.insertMany(user)
        return user.id.toString()
    },
    async deleteUser(id: string): Promise<boolean> {

        const result = await UsersModel.deleteOne({id: new ObjectId(id)})

        return result.deletedCount === 1


    },
    async deleteAllUsers():Promise<boolean>{
        await UsersModel.deleteMany({})
        return true
    },
    async updateConfirmation(id:ObjectId):Promise<boolean>{
        const result = await UsersModel.updateOne({id:id},{$set:{'emailConfirmation.isConfirmed': true}})

        return result.modifiedCount === 1
    },
    async updateConfirmationCode(id:ObjectId, code:string):Promise<boolean>{
        const result = await UsersModel.updateOne({id:id},{$set:{'emailConfirmation.confirmationCode': code}})

        return result.modifiedCount === 1
    },
    async changeHashAndSalt(userId:string, hash:string, salt:string){
        const result = await UsersModel.updateOne({id:new ObjectId(userId)}, {$set:{passwordHash:hash, passwordSalt:salt}})
        return result.modifiedCount === 1
    }

}