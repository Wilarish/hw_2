import {paramsCheckingBlogsBody, paramsCheckingPostsBody} from "./middleware_input_validation";

export const InputValidBlogs = {
    get: [],
    post: [paramsCheckingBlogsBody.websiteUrl, paramsCheckingBlogsBody.name, paramsCheckingBlogsBody.description,],
    put: [paramsCheckingBlogsBody.websiteUrl, paramsCheckingBlogsBody.name, paramsCheckingBlogsBody.description],
    delete: [],
}
export const InputValidPosts = {
    get: [],
    post: [paramsCheckingPostsBody.title,  paramsCheckingPostsBody.shortDescription,  paramsCheckingPostsBody.content,  paramsCheckingPostsBody.blogId,],
    post_NoBlogId:[paramsCheckingPostsBody.title,  paramsCheckingPostsBody.shortDescription,  paramsCheckingPostsBody.content],
    put: [paramsCheckingPostsBody.title,  paramsCheckingPostsBody.shortDescription,  paramsCheckingPostsBody.content,  paramsCheckingPostsBody.blogId],
    delete: [],
}