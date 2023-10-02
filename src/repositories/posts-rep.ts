import {PostsCreateUpdate} from "../types/posts/posts-create-update";
import {posts_db} from "../data/DB";
import {PostsMainType} from "../types/posts/posts-main-type";
import {blogsRepository} from "./blogs-rep";
import {BlogsMainType} from "../types/blogs/blogs-main-type";

export const postsRepository = {
    async findPost(id: string): Promise<PostsMainType | null> {
        const post: PostsMainType|null = await posts_db.findOne({id:id},{ projection: {  _id: 0 } })
        if (!post) {
            return null
        } else {
            return post
        }
    },
    async createPost(data: PostsCreateUpdate): Promise<PostsMainType> {

        const find_blog: BlogsMainType | null = await blogsRepository.findBlog(data.blogId)

        const new_post: PostsMainType = {

            id: new Date().toISOString(),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName: find_blog!.name,
            createdAt: new Date().toISOString()
        }

        await posts_db.insertOne({...new_post})

        return new_post
    },
    async updatePost(id: string, data: PostsCreateUpdate): Promise<PostsMainType | null> {

        const find_blog: BlogsMainType | null = await blogsRepository.findBlog(data.blogId)

        const result = await posts_db.updateOne({id:id},{$set:{

            title: data.title,
            shortDescription: data.shortDescription,
            content : data.content,
            blogId : data.blogId,
            blogName : find_blog!.name
        }})


        if (result.matchedCount === 1)
            return postsRepository.findPost(id)
        else
            return null
    },
    async deletePost(id: string): Promise<boolean> {

        const result  = await posts_db.deleteOne({id:id})

        return result.deletedCount === 1


    }

}