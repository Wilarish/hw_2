import {ValidationError, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../data/HTTP_STATUSES";

const errorFormatter = (error: ValidationError) => {
    switch (error.type) {
        case "field":
            return  {
                message: error.msg,
                field: error.path,
            };
        default :
            return  {
                message: error.msg,
                field: 'Not found',
            };
    }

}


export const errorsCheckingForStatus400 = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send({errorsMessages: errors.array({onlyFirstError: true})});
    } else next();
}

export const errorsCheckingForStatus401 = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
        res.status(HTTP_STATUSES.UNAUTHORIZED_401).send({errorsMessages: errors.array({onlyFirstError: true})});
    } else next();
}
