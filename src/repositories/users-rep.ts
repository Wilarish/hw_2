import {UsersMainType} from "../types/users/users-main-type";
import { users_db} from "../data/DB";
import {Paginated, UsersPaginationType} from "../types/pagination.type";
import {Filter, ObjectId} from "mongodb";



export const usersRepository = {
    async findUsers(pagination: UsersPaginationType): Promise<Paginated<UsersMainType>> {

        const filter: Filter<UsersMainType> = {$or:[{ login: {$regex: pagination.searchLoginTerm, $options: 'i'}},{email: {$regex: pagination.searchEmailTerm, $options: 'i'}}]}

        const [items, totalCount] = await Promise.all([
            users_db
                .find(filter, {projection: {_id: 0, passwordSalt: 0, passwordHash: 0, emailConfirmation:0}})
                .sort({[pagination.sortBy]: pagination.sortDirection})
                .skip(pagination.skip)
                .limit(pagination.pageSize)
                .toArray(),

            users_db.countDocuments(filter)
        ])

        const pagesCount: number = Math.ceil(totalCount / pagination.pageSize)

        return {
            pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount,
            items
        }
    },
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UsersMainType | null> {
        const user = await users_db.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})

        return user
    },
    async findUserById(id: string) {
        const user: UsersMainType | null = await users_db.findOne({id: new ObjectId(id)},{projection: {_id: 0, passwordSalt: 0, passwordHash: 0}})

        return user
    },
    async findUserByConfirmationCode(code:string){
        const user: UsersMainType | null = await users_db.findOne({'emailConfirmation.confirmationCode': code})

        return user
    },
    async createUser(user: UsersMainType): Promise<UsersMainType| null> {
        await users_db.insertOne({...user})


        return await this.findUserById(user.id.toString())
    },
    async deleteUser(id: string): Promise<boolean> {

        const result = await users_db.deleteOne({id: new ObjectId(id)})

        return result.deletedCount === 1


    },
    async deleteAllUsers():Promise<boolean>{
        users_db.deleteMany({})
        return true
    },
    async updateConfirmation(id:ObjectId):Promise<boolean>{
        const result = await users_db.updateOne({id:id},{$set:{'emailConfirmation.isConfirmed': true}})

        return result.modifiedCount === 1
    },
    async updateConfirmationCode(id:ObjectId, code:string):Promise<boolean>{
        const result = await users_db.updateOne({id:id},{$set:{'emailConfirmation.confirmationCode': code}})

        return result.modifiedCount === 1
    }
}