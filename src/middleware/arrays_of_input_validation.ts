import {paramsCheckingBlogs, paramsCheckingPosts} from "./middleware_input_validation";

export const InputValidBlogs = {
    get: [],
    post: [paramsCheckingBlogs.websiteUrl, paramsCheckingBlogs.name, paramsCheckingBlogs.description,],
    put: [paramsCheckingBlogs.websiteUrl, paramsCheckingBlogs.name, paramsCheckingBlogs.description],
    delete: [],
}
export const InputValidPosts = {
    get: [],
    post: [paramsCheckingPosts.title,  paramsCheckingPosts.shortDescription,  paramsCheckingPosts.content,  paramsCheckingPosts.blogId,],
    put: [paramsCheckingPosts.title,  paramsCheckingPosts.shortDescription,  paramsCheckingPosts.content,  paramsCheckingPosts.blogId],
    delete: [],
}