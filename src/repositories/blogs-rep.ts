import {BlogsCreateUpdate, BlogsMainType} from "../types/blogs-types";
import {ObjectId} from "mongodb";
import {BlogsModel, PostsModel} from "../domain/models/models";
import "reflect-metadata"
import {injectable} from "inversify";
@injectable()
export class BlogsRepository {
    async findBlogById(id: string): Promise<BlogsMainType | null> {

        return BlogsModel.findOne({id: new ObjectId(id)})
    }

    async createBlog(new_blog: BlogsMainType): Promise<string> {

        await BlogsModel.create(new_blog)

        return new_blog.id.toString()
    }
    async updateBlog(id: string, data: BlogsCreateUpdate): Promise<boolean> {

        const result = await BlogsModel.updateOne({id: new ObjectId(id)},
            {
                name: data.name,
                description: data.description,
                websiteUrl: data.websiteUrl
            }
        )

        await PostsModel.updateMany({blogId: new ObjectId(id)}, {blogName: data.name})

        return result.matchedCount === 1;


    }
    async deleteBlog(id: string): Promise<boolean> {

        const result = await BlogsModel.deleteOne({id: new ObjectId(id)})

        return result.deletedCount === 1


    }
    async deleteAllBlogs(): Promise<boolean> {
        await BlogsModel.deleteMany({})
        return true
    }
}
