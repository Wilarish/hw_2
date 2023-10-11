import {blogIdPostsChecking, paramsCheckingBlogsBody, paramsCheckingPostsBody} from "./middleware_input_validation";

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