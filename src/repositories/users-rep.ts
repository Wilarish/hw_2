import {UsersMainType} from "../types/users-types";
import {ObjectId} from "mongodb";
import {UsersModel} from "../domain/models/models";
import "reflect-metadata"
import {injectable} from "inversify";
@injectable()
export class  UsersRepository {
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UsersMainType | null> {
        return UsersModel.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
    }

    async findUserById(id: string) {
        return UsersModel.findOne({id: new ObjectId(id)})
    }

    async findUserByConfirmationCode(code:string){
        return  UsersModel.findOne({'emailConfirmation.confirmationCode': code})
    }

    async createUser(user: UsersMainType): Promise<string> {
        await UsersModel.create(user)
        return user.id.toString()
    }
    async deleteUser(id: string): Promise<boolean> {

        const result = await UsersModel.deleteOne({id: new ObjectId(id)})

        return result.deletedCount === 1


    }
    async deleteAllUsers():Promise<boolean>{
        await UsersModel.deleteMany({})
        return true
    }
    async updateConfirmation(id:ObjectId):Promise<boolean>{
        const result = await UsersModel.updateOne({id:id},{'emailConfirmation.isConfirmed': true})

        return result.modifiedCount === 1
    }
    async updateConfirmationCode(id:ObjectId, code:string):Promise<boolean>{
        const result = await UsersModel.updateOne({id:id},{'emailConfirmation.confirmationCode': code})

        return result.modifiedCount === 1
    }
    async changeHashAndSalt(userId:string, hash:string, salt:string){
        const result = await UsersModel.updateOne({id:new ObjectId(userId)}, {passwordHash:hash, passwordSalt:salt})
        return result.modifiedCount === 1
    }
}