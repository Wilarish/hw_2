import {Response, Request, Router} from "express";
import {getUsersPagination} from "../helpers/pagination.helper";
import {usersRepository} from "../repositories/users-rep";
import {Paginated, UsersPaginationType} from "../types/pagination.type";
import {UsersCreate} from "../types/users/users-create";
import {UsersMainType} from "../types/users/users-main-type";
import {authBasic} from "../middleware/middleware_input_validation";
import {usresServises} from "../domain/users-servises";

export const UsersRouter = Router({})

UsersRouter.get('/', authBasic, async (req: Request, res:Response) =>{
    const pagination: UsersPaginationType = getUsersPagination(req.query)
    const users:Paginated<UsersMainType> = await usersRepository.findUsers(pagination)

    return users
})
UsersRouter.post('/', authBasic, async (req:Request<{},{},{login: string, email: string, password: string},{}>, res:Response)=>{
    const data:UsersCreate = {
        login: req.body.login,
        email: req.body.email,
        password: req.body.password
    }
    return await usresServises.createUser(data)
})

UsersRouter.delete('/:id', authBasic, (req:Request<{id:string}>,res:Response)=>{

    return usresServises.deleteUser(req.params.id)
})