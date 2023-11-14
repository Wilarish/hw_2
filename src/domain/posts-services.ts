import {BlogsMainType} from "../types/blogs-types";
import {blogsRepository} from "../repositories/blogs-rep";
import {PostsCreateUpdate, PostsMainType} from "../types/posts-types";
import {postsRepository} from "../repositories/posts-rep";
import {ObjectId} from "mongodb";

export const postsServices = {
    async createPost(data: PostsCreateUpdate):Promise<string> {

        const find_blog: BlogsMainType | null = await blogsRepository.findBlogById(data.blogId.toString())

        const new_post: PostsMainType = {

            id: new ObjectId(),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: new ObjectId(data.blogId),
            blogName: find_blog!.name,
            createdAt: new Date().toISOString()
        }

        return postsRepository.createPost(new_post)

    },
    async updatePost(id:string, data: PostsCreateUpdate):Promise<string|null>{

        return postsRepository.updatePost(id, data)

    },
    async deletePost(id:string){

        return postsRepository.deletePost(id)

    }
}