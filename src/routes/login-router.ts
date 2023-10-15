import {Response,Request, Router} from "express";
import {usresServises} from "../domain/users-servises";
import {HTTP_statuses} from "../data/HTTP_statuses";
import {errorsChecking} from "../middleware/middleware_input_validation";
import {InputValidationLogin} from "../middleware/arrays_of_input_validation";

export  const AuthRouter = Router({})

AuthRouter.get('/login',  InputValidationLogin.get,  errorsChecking , async (req:Request<{},{},{loginOrEmail:string, password:string}>, res:Response)=>{
    const result: boolean = await usresServises.login(req.body.loginOrEmail, req.body.password)

    if(!result) res.sendStatus(HTTP_statuses.UNAUTHORIZED_401)
    res.sendStatus(HTTP_statuses.NO_CONTENT_204)
})