import {BlogsMainType} from "../types/blogs/blogs-main-type";
import {BlogsCreateUpdate} from "../types/blogs/blogs-create-update-type";
import {blogsRepository} from "../repositories/blogs-rep";
import {ObjectId} from "mongodb";



export const blogsServise = {

    async createBlog(data: BlogsCreateUpdate): Promise<BlogsMainType> {

        const new_blog: BlogsMainType = {
            id: new ObjectId(),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        const createdBlog= await blogsRepository.createBlog(new_blog)
        return createdBlog
    },
    async updateBlog(id:string, data: BlogsCreateUpdate): Promise<BlogsMainType | null> {

        return await blogsRepository.updateBlog(id, data)
    },
    async deleteBlog(id: string): Promise<boolean> {

        return await blogsRepository.deleteBlog(id)
    }

}
