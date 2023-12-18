import {UsersRepository} from "../../repositories/users-rep";
import {UsersServices} from "../../application/users-services";
import {QueryUsersRepository} from "../../repositories/query/query-users-rep";
import {Request, Response} from "express";
import {HTTP_STATUSES} from "../../data/HTTP_STATUSES";
import {Paginated, UsersPaginationType} from "../../types/pagination.type";
import {getUsersPagination} from "../../helpers/pagination.helper";
import {UsersCreate, UsersViewType} from "../../types/users-types";

export class UsersControllerInstance {

    constructor(protected usersRepository: UsersRepository,
                protected usersServices: UsersServices,
                protected queryUsersRepository: QueryUsersRepository,) {
    }

    async test(req: Request<{ id: string }>, res: Response) {    // testing endpoint
        const user: any = await this.usersRepository.findUserById(req.params.id)

        res.status(HTTP_STATUSES.OK_200).send(user)
    }

    async getUsers(req: Request, res: Response) {
        const pagination: UsersPaginationType = getUsersPagination(req.query)
        const users: Paginated<UsersViewType> = await this.queryUsersRepository.queryFindPaginatedUsers(pagination)

        res.status(HTTP_STATUSES.OK_200).send(users)
    }

    async getUserById(req: Request<{
        id: string
    }>, res: Response) {
        const user: UsersViewType | null = await this.queryUsersRepository.queryFindUserById(req.params.id)

        if (!user)
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

        else
            res.status(HTTP_STATUSES.OK_200).send(user)
    }

    async createUser(req: Request<{}, {}, {
        login: string,
        email: string,
        password: string
    }, {}>, res: Response) {
        const data: UsersCreate = {
            login: req.body.login,
            email: req.body.email,
            password: req.body.password
        }
        const idOfCreatedUser: string = await this.usersServices.createUser(data)
        if (!idOfCreatedUser) return res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)

        const user: UsersViewType | null = await this.queryUsersRepository.queryFindUserById(idOfCreatedUser)

        return res.status(HTTP_STATUSES.CREATED_201).send(user)
    }

    async deleteUser(req: Request<{
        id: string
    }>, res: Response) {

        const del: boolean = await this.usersServices.deleteUser(req.params.id)

        if (!del) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}
