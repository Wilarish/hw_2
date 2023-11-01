import {body} from "express-validator";

export const paramsCheckingCommentsBody ={
    content: body('content').isString().trim().isLength({min:20,max:300})

}