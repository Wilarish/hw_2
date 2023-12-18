import {Router} from "express";
import {CheckJwtToken} from "../middleware/auth/refresh_token";
import {securityController} from "../composition-root";



export const SecurityRouter = Router({})

SecurityRouter.get('/devices', CheckJwtToken.rT, securityController.getDevices.bind(securityController))
SecurityRouter.delete('/devices', CheckJwtToken.rT, securityController.deleteAllOtherDevices.bind(securityController))
SecurityRouter.delete('/devices/:id', CheckJwtToken.rT, securityController.deleteDeviceById.bind(securityController))