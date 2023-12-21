import {Router} from "express";
import {InputValidationUsers} from "../middleware/arrays_of_input_validation";
import {authBasic} from "../middleware/auth/auth_basic";
import {errorsCheckingForStatus400} from "../middleware/errors_checking";
import {reqIdValidation} from "../middleware/req_id/id_valid";
import {UsersControllerInstance} from "./classes-routers/users-class";
import {container} from "../composition-root";

const usersController = container.resolve(UsersControllerInstance)
export const UsersRouter = Router({})

UsersRouter.get('/get/:id', usersController.test.bind(usersController))
UsersRouter.get('/', authBasic, usersController.getUsers.bind(usersController))
UsersRouter.get('/:id', authBasic, reqIdValidation.id, errorsCheckingForStatus400, usersController.getUserById.bind(usersController))
UsersRouter.post('/', authBasic, InputValidationUsers.post, errorsCheckingForStatus400, usersController.createUser.bind(usersController))
UsersRouter.delete('/:id', authBasic, reqIdValidation.id, errorsCheckingForStatus400, usersController.deleteUser.bind(usersController))