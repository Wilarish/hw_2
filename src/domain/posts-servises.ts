import {PostsCreateUpdate} from "../types/posts/posts-create-update";
import {BlogsMainType} from "../types/blogs/blogs-main-type";
import {blogsRepository} from "../repositories/blogs-rep";
import {PostsMainType} from "../types/posts/posts-main-type";
import {postsRepository} from "../repositories/posts-rep";
import {create_update_Blogs} from "../types/blogs/blogs-create-update-type";

export const postsServises = {
    async createPost(data: PostsCreateUpdate) {

        const find_blog: BlogsMainType | null = await blogsRepository.findBlogById(data.blogId)

        const new_post: PostsMainType = {

            id: new Date().toISOString(),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName: find_blog!.name,
            createdAt: new Date().toISOString()
        }

        return postsRepository.createPost(new_post)

    },
    async updatePost(id:string, data: PostsCreateUpdate){

        return postsRepository.updatePost(id, data)

    },
    async deletePost(id:string){

        return postsRepository.deletePost(id)

    }
}