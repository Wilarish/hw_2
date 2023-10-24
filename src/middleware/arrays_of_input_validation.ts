import {
    blogIdPostsChecking,
    paramsCheckingBlogsBody, paramsCheckingCommentsBody, paramsCheckingLogin,
    paramsCheckingPostsBody,
    paramsCheckingUsersBody
} from "./middleware_input_validation";

export const InputValidBlogs = {
    get: [],
    post: [paramsCheckingBlogsBody.websiteUrl, paramsCheckingBlogsBody.name, paramsCheckingBlogsBody.description,],
    put: [paramsCheckingBlogsBody.websiteUrl, paramsCheckingBlogsBody.name, paramsCheckingBlogsBody.description],
    delete: [],
}
export const InputValidPosts = {
    get: [],
    post: [paramsCheckingPostsBody.title,  paramsCheckingPostsBody.shortDescription,  paramsCheckingPostsBody.content,  paramsCheckingPostsBody.blogId,],
    postWithUriBlogId:[paramsCheckingPostsBody.title,  paramsCheckingPostsBody.shortDescription,  paramsCheckingPostsBody.content, blogIdPostsChecking],
    put: [paramsCheckingPostsBody.title,  paramsCheckingPostsBody.shortDescription,  paramsCheckingPostsBody.content,  paramsCheckingPostsBody.blogId],
    delete: [],
}
export  const InputValidationUsers = {
    get:[],
    post:[paramsCheckingUsersBody.email, paramsCheckingUsersBody.login, paramsCheckingUsersBody.password],
    put:[],
    delete:[],
}

export  const InputValidationLogin={
    post:[paramsCheckingLogin.loginOrEmail, paramsCheckingLogin.password]
}
export const InputValidationCommenst = {
    any:[paramsCheckingCommentsBody.content]
}