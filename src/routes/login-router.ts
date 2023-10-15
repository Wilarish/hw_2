import {Response,Request, Router} from "express";
import {usresServises} from "../domain/users-servises";
import {HTTP_statuses} from "../data/HTTP_statuses";

export  const LoginRouter = Router({})

LoginRouter.get('/', async (req:Request<{},{},{loginOrEmail:string, password:string}>, res:Response)=>{
    const result: boolean = await usresServises.login(req.body.loginOrEmail, req.body.password)

    if(!result) res.sendStatus(HTTP_statuses.BAD_REQUEST_400)
    res.sendStatus(HTTP_statuses.OK_200)
})