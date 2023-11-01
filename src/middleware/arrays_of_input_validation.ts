import {paramsCheckingBlogsBody} from "./input_valid/input_blogs";
import {uriBlogIdPostsChecking, paramsCheckingPostsBody} from "./input_valid/input_posts";
import {paramsCheckingUsersBody} from "./input_valid/input_users";
import {paramsCheckingCommentsBody} from "./input_valid/input_comments";
import {paramsCheckingAuth} from "./input_valid/input_auth";

export const InputValidBlogs = {
    post: [paramsCheckingBlogsBody.websiteUrl, paramsCheckingBlogsBody.name, paramsCheckingBlogsBody.description,],
    put: [paramsCheckingBlogsBody.websiteUrl, paramsCheckingBlogsBody.name, paramsCheckingBlogsBody.description],
}
export const InputValidPosts = {
    post: [paramsCheckingPostsBody.title, paramsCheckingPostsBody.shortDescription, paramsCheckingPostsBody.content, paramsCheckingPostsBody.blogId,],
    postWithUriBlogId: [paramsCheckingPostsBody.title, paramsCheckingPostsBody.shortDescription, paramsCheckingPostsBody.content, uriBlogIdPostsChecking],
    put: [paramsCheckingPostsBody.title, paramsCheckingPostsBody.shortDescription, paramsCheckingPostsBody.content, paramsCheckingPostsBody.blogId],
}
export const InputValidationUsers = {
    post: [paramsCheckingUsersBody.email, paramsCheckingUsersBody.login, paramsCheckingUsersBody.password],
}


export const InputValidationComments = {
    any: [paramsCheckingCommentsBody.content]
}
export const InputValidationAuth = {
    registrationConfirmation: [paramsCheckingAuth.code],
    registrationEmailResending: [paramsCheckingAuth.email],
    login:[paramsCheckingAuth.loginOrEmail, paramsCheckingAuth.password]
}