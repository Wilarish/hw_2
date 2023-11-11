import {Response, Request, Router} from "express";
import {getUsersPagination} from "../helpers/pagination.helper";
import {Paginated, UsersPaginationType} from "../types/pagination.type";
import {UsersCreate, UsersViewType} from "../types/users-types";
import {usersServices} from "../domain/users-services";
import {InputValidationUsers} from "../middleware/arrays_of_input_validation";
import {HTTP_STATUSES} from "../data/HTTP_STATUSES";
import {authBasic} from "../middleware/auth/auth_basic";
import {errorsCheckingForStatus400} from "../middleware/errors_checking";
import {reqIdValidation} from "../middleware/req_id/id_valid";
import {queryUsersRepository} from "../repositories/query/query-users-rep";


export const UsersRouter = Router({})

UsersRouter.get('/', authBasic, async (req: Request, res: Response) => {
    const pagination: UsersPaginationType = getUsersPagination(req.query)
    const users: Paginated<UsersViewType> = await queryUsersRepository.queryFindPaginatedUsers(pagination)

    res.status(HTTP_STATUSES.OK_200).send(users)
})

UsersRouter.get('/:id', authBasic, reqIdValidation.id, errorsCheckingForStatus400, async (req: Request<{ id: string }>, res: Response) => {
    const user: UsersViewType | null = await queryUsersRepository.queryFindUserById(req.params.id)

    if (!user)
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

    else
        res.status(HTTP_STATUSES.OK_200).send(user)
})
UsersRouter.post('/', authBasic, InputValidationUsers.post, errorsCheckingForStatus400, async (req: Request<{}, {}, {
    login: string,
    email: string,
    password: string
}, {}>, res: Response) => {
    const data: UsersCreate = {
        login: req.body.login,
        email: req.body.email,
        password: req.body.password
    }
    const idOfCreatedUser: string = await usersServices.createUser(data)
    if(!idOfCreatedUser) return res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)

    const user:UsersViewType|null = await queryUsersRepository.queryFindUserById(idOfCreatedUser)

    return res.status(HTTP_STATUSES.CREATED_201).send(user)
})

UsersRouter.delete('/:id', authBasic, reqIdValidation.id, errorsCheckingForStatus400, async (req: Request<{ id: string }>, res: Response) => {

    const del: boolean = await usersServices.deleteUser(req.params.id)

    if (!del) {
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)


})