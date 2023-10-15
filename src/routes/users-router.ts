import {Response, Request, Router} from "express";
import {getUsersPagination} from "../helpers/pagination.helper";
import {usersRepository} from "../repositories/users-rep";
import {Paginated, UsersPaginationType} from "../types/pagination.type";
import {UsersCreate} from "../types/users/users-create";
import {UsersMainType} from "../types/users/users-main-type";
import {authBasic, errorsChecking} from "../middleware/middleware_input_validation";
import {usresServises} from "../domain/users-servises";
import {InputValidationUsers} from "../middleware/arrays_of_input_validation";
import {HTTP_statuses} from "../data/HTTP_statuses";
import {UsersViewType} from "../types/users/users-view-type";
import {PostsMainType} from "../types/posts/posts-main-type";
import {postsRepository} from "../repositories/posts-rep";

export const UsersRouter = Router({})

UsersRouter.get('/', authBasic, async (req: Request, res:Response) =>{
    const pagination: UsersPaginationType = getUsersPagination(req.query)
    const users:Paginated<UsersMainType> = await usersRepository.findUsers(pagination)

    res.status(HTTP_statuses.OK_200).send(users)
})

UsersRouter.get('/:id', authBasic, async (req:Request<{id:string}>, res:Response)=>{
    const user: UsersViewType | null = await usersRepository.findUserById(req.params.id)

    if (!user)
        res.sendStatus(HTTP_statuses.NOT_FOUND_404)

    else
        res.send(user)
})
UsersRouter.post('/', authBasic,  InputValidationUsers.post, errorsChecking,  async (req:Request<{},{},{login: string, email: string, password: string},{}>, res:Response)=>{
    const data:UsersCreate = {
        login: req.body.login,
        email: req.body.email,
        password: req.body.password
    }
    const user:UsersViewType | null =  await usresServises.createUser(data)
    res.status(HTTP_statuses.CREATED_201).send(user)
})

UsersRouter.delete('/:id', authBasic, async (req:Request<{id:string}>,res:Response)=>{

    const del: boolean = await usresServises.deleteUser(req.params.id)

    if (!del) {
        res.sendStatus(HTTP_statuses.NOT_FOUND_404)
    } else {
        res.sendStatus(HTTP_statuses.NO_CONTENT_204)
    }

})