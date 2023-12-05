import {UsersMainType, UsersViewType} from "../../types/users-types";
import {ObjectId} from "mongodb";
import {Paginated, UsersPaginationType} from "../../types/pagination.type";
import {UsersModel} from "../../domain/models/models";

export class QueryUsersRepository {
    async queryFindPaginatedUsers(pagination: UsersPaginationType): Promise<Paginated<UsersViewType>> {

        const filter = {$or:[{ login: {$regex: pagination.searchLoginTerm, $options: 'i'}},{email: {$regex: pagination.searchEmailTerm, $options: 'i'}}]}

        const [items, totalCount] = await Promise.all([
            UsersModel
                .find(filter)
                .select({ _id: 0, __v:0,passwordSalt: 0, passwordHash: 0, emailConfirmation:0})
                .sort({[pagination.sortBy]: pagination.sortDirection})
                .skip(pagination.skip)
                .limit(pagination.pageSize)
                .lean(),

            UsersModel.countDocuments(filter)
        ])

        const pagesCount: number = Math.ceil(totalCount / pagination.pageSize)

        return {
            pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount,
            items
        }
    }
    async queryFindUserById(id: string):Promise<UsersViewType|null> {
        const userDb:UsersMainType | null = await UsersModel.findOne({id: new ObjectId(id)}).select({ _id: 0, __v:0,passwordSalt: 0, passwordHash: 0, emailConfirmation:0}).lean()

        const user_test = await UsersModel.where('id').equals(new ObjectId(id)).select({ _id: 0, __v:0, passwordSalt: 0, passwordHash: 0, emailConfirmation:0 })

        return userDb
    }
}
