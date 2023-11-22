import {PostsModel} from "../data/DB";
import {PostsCreateUpdate, PostsMainType} from "../types/posts-types";
import {blogsRepository} from "./blogs-rep";
import {BlogsMainType} from "../types/blogs-types";
import {ObjectId} from "mongodb";

export const postsRepository = {

    async findPostById(id: string): Promise<PostsMainType | null> {


        const post: PostsMainType | null = await PostsModel.findOne({id: new ObjectId(id)})
        if (!post) return null

        return post

    },
    async createPost(post: PostsMainType): Promise<string> {

        await PostsModel.insertMany(post)
        return post.id.toString()
    },
    async updatePost(id: string, data: PostsCreateUpdate): Promise<string | null> {

        const find_blog: BlogsMainType | null = await blogsRepository.findBlogById(data.blogId.toString())

        const result = await PostsModel.updateOne({id: new ObjectId(id)}, {
            $set: {

                title: data.title,
                shortDescription: data.shortDescription,
                content: data.content,
                blogId: data.blogId,
                blogName: find_blog!.name
            }
        })


        if (result.matchedCount === 1)
            return id
        else
            return null
    },
    async deletePost(id: string): Promise<boolean> {

        const result = await PostsModel.deleteOne({id: new ObjectId(id)})

        return result.deletedCount === 1


    },
    async deleteAllPosts(): Promise<boolean> {
        await PostsModel.deleteMany({})
        return true
    }

}