import {param} from "express-validator";

export const reqIdValidation ={
    id:param('id').isString().trim().isLength({min:24, max:24})
}