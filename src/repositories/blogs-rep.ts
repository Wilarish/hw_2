import {blogs_db, posts_db} from "../data/DB";
import {BlogsCreateUpdate, BlogsMainType} from "../types/blogs-types";
import {ObjectId} from "mongodb";


export const blogsRepository = {

    async findBlogById(id: string): Promise<BlogsMainType | null> {

        return  await blogs_db.findOne({id: new ObjectId(id)})
    },

    async createBlog(new_blog: BlogsMainType): Promise<string> {

        await blogs_db.insertOne({...new_blog})

        return new_blog.id.toString()
    },
    async updateBlog(id: string, data: BlogsCreateUpdate): Promise<boolean> {

        const result = await blogs_db.updateOne({id: new ObjectId(id) }, {
            $set: {
                name: data.name,
                description: data.description,
                websiteUrl: data.websiteUrl
            }
        })

        await posts_db.updateMany({blogId: new ObjectId(id) }, {$set: {blogName: data.name}})

        return result.matchedCount === 1;


    },
    async deleteBlog(id: string): Promise<boolean> {

        const result = await blogs_db.deleteOne({id: new ObjectId(id)})

        return result.deletedCount === 1


    },
    async deleteAllBlogs(): Promise<boolean> {
        await blogs_db.deleteMany({})
        return true
    }

}
