import {blogs_db, posts_db} from "../data/DB";
import {BlogsMainType} from "../types/blogs/blogs-main-type";
import {create_update_Blogs} from "../types/blogs/blogs-create-update-type";
import {blogsRepository} from "../repositories/blogs-rep";
import {postsRepository} from "../repositories/posts-rep";
import {PostsMainType} from "../types/posts/posts-main-type";



export const blogsServise = {

    async findBlogById(id: string): Promise<BlogsMainType | null> {

        return await blogsRepository.findBlogById(id)
    },

    async findPostsForBlogsById(id:string): Promise<PostsMainType[]>{

        return await blogsRepository.findPostsForBlogsById(id)

    },
    async createBlog(data: create_update_Blogs): Promise<BlogsMainType> {

        const new_blog: BlogsMainType = {
            id: new Date().toISOString(),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        const createdBlog= await blogsRepository.createBlog(new_blog)
        return createdBlog
    },
    async updateBlog(id:string, data: create_update_Blogs): Promise<BlogsMainType | null> {

        return await blogsRepository.updateBlog(id, data)
    },
    async deleteBlog(id: string): Promise<boolean> {

        return await blogsRepository.deleteBlog(id)
    }

}
