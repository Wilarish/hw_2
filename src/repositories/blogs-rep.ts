import {blogs_db} from "../data/DB";
import {BlogsMainType} from "../types/blogs/blogs-main-type";
import {PostsCreateUpdate} from "../types/posts/posts-create-update";
import {PostsMainType} from "../types/posts/posts-main-type";
import {create_update_Blogs} from "../types/blogs/blogs-create-update-type";
import e from "express";


export const blogsRepository = {

    async findBlogs(): Promise<BlogsMainType[] | null> {
        return await blogs_db.find({}, {projection: {_id: 0}}).toArray();
    },

    async findBlogById(id: string): Promise<BlogsMainType | null> {

        const blog: BlogsMainType|null = await blogs_db.findOne({id:id},{ projection: {  _id: 0 } } )
        // const blog: BlogsMainType | undefined = DB.blogs.find(b => b.id === id)
        if (!blog) {
            return null
        } else {
            return blog
        }
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

        await blogs_db.insertOne({...new_blog})

        return new_blog
    },
    async updateBlog(id:string, data: create_update_Blogs): Promise<BlogsMainType | null> {

        const result = await blogs_db.updateOne({id:id},{$set:{
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl
        }})


        if(result.matchedCount === 1)
            return blogsRepository.findBlogById(id)
        else
            return null


    },
    async deleteBlog(id: string): Promise<boolean> {

        const result = await blogs_db.deleteOne({id:id})

        return result.deletedCount === 1


        }

    }
