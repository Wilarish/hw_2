import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../../data/HTTP_STATUSES";
import {jwtAdapter} from "../../adapters/jwt-adapet";

export const authBearer = async (req: Request, res: Response, next: NextFunction)=>{
    const authorization = req.headers.authorization

    if (!authorization) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)

    const token = authorization.split(' ')[1]
    if( authorization.split(' ')[0] !== "Bearer") return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    const userId = await jwtAdapter.findUserByToken(token)
    if(!userId){
        return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    }
    req.userId = userId

    return next()

}

export const authBearerWithout401 = async (req: Request, res: Response, next: NextFunction)=>{
    const authorization = req.headers.authorization

    if (!authorization) return next()

    const token = authorization.split(' ')[1]
    if( authorization.split(' ')[0] !== "Bearer") return next()
    const userId = await jwtAdapter.findUserByToken(token)
    if(!userId){
        return next()
    }
    req.userId = userId

    return next()

}