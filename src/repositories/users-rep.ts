import {UsersMainType} from "../types/users/users-main-type";
import {posts_db, users_db} from "../data/DB";
import {Paginated, UsersPaginationType} from "../types/pagination.type";

import {DeleteResult} from "mongodb";
import {UsersViewType} from "../types/users/users-view-type";
import {rejects} from "assert";


export const usersRepository = {
    async findUsers(pagination: UsersPaginationType): Promise<Paginated<UsersMainType>> {

        const [items, totalCount] = await Promise.all([
            users_db
                .find({}, {projection: {_id: 0, passwordSalt: 0, passwordHash: 0}})
                .sort({[pagination.sortBy]: pagination.sortDirection})
                .skip(pagination.skip)
                .limit(pagination.pageSize)
                .toArray(),

            users_db.countDocuments()
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
        const user: UsersViewType | null = await users_db.findOne({id: id},{projection: {_id: 0, passwordSalt: 0, passwordHash: 0}})

        return user
    },
    async createUser(user: UsersMainType): Promise<UsersViewType| null> {
        await users_db.insertOne({...user})


        return await this.findUserById(user.id)
    },
    async deleteUser(id: string): Promise<boolean> {

        const result: DeleteResult = await posts_db.deleteOne({id: id})

        return result.deletedCount === 1


    }
}