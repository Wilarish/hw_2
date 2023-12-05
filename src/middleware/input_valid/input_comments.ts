import {body} from "express-validator";
import {likeStatuses} from "../../types/likes-types";

export const paramsCheckingCommentsBody ={
    content: body('content').isString().trim().isLength({min:20,max:300}),
    likeStatus:body('likeStatus').isString().trim().isLength({min:3,max:3}).custom((status)=>{
        if(!(status in likeStatuses)) throw new Error('not a like status')
        return true
    })

}