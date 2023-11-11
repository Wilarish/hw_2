import {BlogsCreateUpdate, BlogsMainType} from "../types/blogs-types";
import {blogsRepository} from "../repositories/blogs-rep";
import {ObjectId} from "mongodb";



export const blogsServices = {

    async createBlog(data: BlogsCreateUpdate): Promise<string> {

        const new_blog: BlogsMainType = {
            id: new ObjectId(),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        return  await blogsRepository.createBlog(new_blog)
    },
    async updateBlog(id:string, data: BlogsCreateUpdate): Promise<boolean> {

        return await blogsRepository.updateBlog(id, data)
    },
    async deleteBlog(id: string): Promise<boolean> {

        return await blogsRepository.deleteBlog(id)
    }

}
