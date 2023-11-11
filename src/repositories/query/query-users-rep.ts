import {UsersMainType, UsersViewType} from "../../types/users-types";
import {users_db} from "../../data/DB";
import {Filter, ObjectId} from "mongodb";
import {Paginated, UsersPaginationType} from "../../types/pagination.type";


export const queryUsersRepository = {
    async queryFindPaginatedUsers(pagination: UsersPaginationType): Promise<Paginated<UsersViewType>> {

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
    async queryFindUserById(id: string):Promise<UsersViewType|null> {
        const userDb: UsersMainType | null = await users_db.findOne({id: new ObjectId(id)},{projection: {_id: 0, passwordSalt: 0, passwordHash: 0, emailConfirmation:0}})

        if(!userDb) return null

        return {
            id: userDb.id,
            login: userDb?.login,
            email: userDb?.email,
            createdAt: userDb?.createdAt
        }
    },
}