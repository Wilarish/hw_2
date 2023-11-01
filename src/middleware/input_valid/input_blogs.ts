import {body} from "express-validator";

export const paramsCheckingBlogsBody = {
    name: body('name').isString().trim().isLength({min: 1, max: 15}),
    description: body('description').isString().trim().isLength({min: 1, max: 500}),
    websiteUrl: body('websiteUrl').isString().trim().isURL().isLength({min: 1, max: 100}),
}