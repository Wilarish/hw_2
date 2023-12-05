import {paramsCheckingBlogsBody} from "./input_valid/input_blogs";
import {uriBlogIdPostsChecking, paramsCheckingPostsBody} from "./input_valid/input_posts";
import {paramsCheckingUsersBody} from "./input_valid/input_users";
import {paramsCheckingCommentsBody} from "./input_valid/input_comments";
import {paramsCheckingAuth} from "./input_valid/input_auth";
import {reqIdValidation} from "./req_id/id_valid";

export const InputValidBlogs = {
    post: [paramsCheckingBlogsBody.websiteUrl, paramsCheckingBlogsBody.name, paramsCheckingBlogsBody.description,],
    put: [paramsCheckingBlogsBody.websiteUrl, paramsCheckingBlogsBody.name, paramsCheckingBlogsBody.description, reqIdValidation.id],
}
export const InputValidPosts = {
    post: [paramsCheckingPostsBody.title, paramsCheckingPostsBody.shortDescription, paramsCheckingPostsBody.content, paramsCheckingPostsBody.blogId,],
    postWithUriBlogId: [paramsCheckingPostsBody.title, paramsCheckingPostsBody.shortDescription, paramsCheckingPostsBody.content, uriBlogIdPostsChecking],
    put: [paramsCheckingPostsBody.title, paramsCheckingPostsBody.shortDescription, paramsCheckingPostsBody.content, paramsCheckingPostsBody.blogId, reqIdValidation.id],
}
export const InputValidationUsers = {
    post: [paramsCheckingUsersBody.email, paramsCheckingUsersBody.login, paramsCheckingUsersBody.password],
}


export const InputValidationComments = {
    post: [paramsCheckingCommentsBody.content],
    put:[paramsCheckingCommentsBody.content, reqIdValidation.id],
    putRateComment:[paramsCheckingCommentsBody.likeStatus, reqIdValidation.id]
}
export const InputValidationAuth = {
    registrationConfirmation: [paramsCheckingAuth.code],
    registrationEmailResending: [paramsCheckingAuth.email],
    login:[paramsCheckingAuth.loginOrEmail, paramsCheckingAuth.password],
    password_recovery:[paramsCheckingAuth.emailShort],
    new_password:[paramsCheckingAuth.newPassword, paramsCheckingAuth.recoveryCode]
}