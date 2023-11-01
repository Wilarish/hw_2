import {Response, Request, Router} from "express";
import {getUsersPagination} from "../helpers/pagination.helper";
import {usersRepository} from "../repositories/users-rep";
import {Paginated, UsersPaginationType} from "../types/pagination.type";
import {UsersCreate} from "../types/users/users-create";
import {UsersMainType} from "../types/users/users-main-type";
import {usersServices} from "../domain/users-services";
import {InputValidationUsers} from "../middleware/arrays_of_input_validation";
import {HTTP_STATUSES} from "../data/HTTP_STATUSES";
import {authBasic} from "../middleware/auth/auth_basic";
import {errorsChecking} from "../middleware/errors_checking";

export const UsersRouter = Router({})

UsersRouter.get('/', authBasic, async (req: Request, res: Response) => {
    const pagination: UsersPaginationType = getUsersPagination(req.query)
    const users: Paginated<UsersMainType> = await usersRepository.findUsers(pagination)

    res.status(HTTP_STATUSES.OK_200).send(users)
})

UsersRouter.get('/:id', authBasic, async (req: Request<{ id: string }>, res: Response) => {
    const user: UsersMainType | null = await usersRepository.findUserById(req.params.id)

    if (!user)
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

    else
        res.send(user)
})
UsersRouter.post('/', authBasic, InputValidationUsers.post, errorsChecking, async (req: Request<{}, {}, {
    login: string,
    email: string,
    password: string
}, {}>, res: Response) => {
    const data: UsersCreate = {
        login: req.body.login,
        email: req.body.email,
        password: req.body.password
    }
    const user: UsersMainType | null = await usersServices.createUser(data)
    res.status(HTTP_STATUSES.CREATED_201).send(user)
})

UsersRouter.delete('/:id', authBasic, async (req: Request<{ id: string }>, res: Response) => {

    const del: boolean = await usersServices.deleteUser(req.params.id)

    if (!del) {
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)


})