import {BlogsCreateUpdate, BlogsMainType} from "../types/blogs-types";
import {ObjectId} from "mongodb";
import {BlogsRepository} from "../repositories/blogs-rep";

export class BlogsServices {

    constructor(protected blogsRepository: BlogsRepository) {
    }
    async createBlog(data: BlogsCreateUpdate): Promise<string> {

        const new_blog = new BlogsMainType(
            new ObjectId(),
            data.name,
            data.description,
            data.websiteUrl,
            new Date().toISOString(),
            false)



        return await this.blogsRepository.createBlog(new_blog)
    }
    async updateBlog(id: string, data: BlogsCreateUpdate): Promise<boolean> {

        return await this.blogsRepository.updateBlog(id, data)
    }
    async deleteBlog(id: string): Promise<boolean> {

        return await this.blogsRepository.deleteBlog(id)
    }
}


