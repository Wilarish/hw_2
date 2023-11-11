import {UsersMainType} from "../types/users-types";
import { users_db} from "../data/DB";
import {Paginated, UsersPaginationType} from "../types/pagination.type";
import {Filter, ObjectId} from "mongodb";



export const usersRepository = {

    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UsersMainType | null> {
        const user: UsersMainType | null = await users_db.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]} )

        return user
    },
    async findUserById(id: string) {
        const user: UsersMainType | null = await users_db.findOne({id: new ObjectId(id)},{projection: {_id: 0, passwordSalt: 0, passwordHash: 0, emailConfirmation:0}})

        return user
    },
    async findUserByConfirmationCode(code:string){
        const user: UsersMainType | null = await users_db.findOne({'emailConfirmation.confirmationCode': code})

        return user
    },
    async createUser(user: UsersMainType): Promise<string> {
        await users_db.insertOne(user)
        return user.id.toString()
    },
    async deleteUser(id: string): Promise<boolean> {

        const result = await users_db.deleteOne({id: new ObjectId(id)})

        return result.deletedCount === 1


    },
    async deleteAllUsers():Promise<boolean>{
        await users_db.deleteMany({})
        return true
    },
    async updateConfirmation(id:ObjectId):Promise<boolean>{
        const result = await users_db.updateOne({id:id},{$set:{'emailConfirmation.isConfirmed': true}})

        return result.modifiedCount === 1
    },
    async updateConfirmationCode(id:ObjectId, code:string):Promise<boolean>{
        const result = await users_db.updateOne({id:id},{$set:{'emailConfirmation.confirmationCode': code}})

        return result.modifiedCount === 1
    },

}