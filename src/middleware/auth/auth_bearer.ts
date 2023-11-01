import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../../data/HTTP_STATUSES";
import {jwtServices} from "../../application/jwt-services";

export const authBearer = async (req: Request, res: Response, next: NextFunction)=>{
    const authorization = req.headers.authorization //'Bearer fdgnodfgn.gfgsgfsdgfsdg.ggsdsdgsd     // it`s jwt

    if (!authorization) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)

    const token = authorization.split(' ')[1]
    if( authorization.split(' ')[0] !== "Bearer") return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    const userId = await jwtServices.findUserByToken(token)
    if(!userId){
        return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    }
    req.userId = userId

    return next()

}