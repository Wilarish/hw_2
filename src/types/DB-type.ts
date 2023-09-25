import {BlogsMainType} from "./blogs/blogs-main-type";
import {PostsMainType} from "./posts/posts-main-type";

export type DBType ={
    blogs: BlogsMainType[],
    posts: PostsMainType[],
}