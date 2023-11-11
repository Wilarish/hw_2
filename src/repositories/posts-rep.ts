import {posts_db} from "../data/DB";
import {PostsCreateUpdate, PostsMainType} from "../types/posts-types";
import {blogsRepository} from "./blogs-rep";
import {BlogsMainType} from "../types/blogs-types";
import {DefaultPaginationType, Paginated} from "../types/pagination.type";
import {ObjectId} from "mongodb";

export const postsRepository = {

    async findPostById(id: string): Promise<PostsMainType | null> {


        const post: PostsMainType | null = await posts_db.findOne({id: new ObjectId(id)}, {projection: {_id: 0}})
        if (!post) return null

        return post

    },
    async createPost(post: PostsMainType): Promise<string> {

        await posts_db.insertOne(post)
        return post.id.toString()
    },
    async updatePost(id: string, data: PostsCreateUpdate): Promise<string | null> {

        const find_blog: BlogsMainType | null = await blogsRepository.findBlogById(data.blogId.toString())

        const result = await posts_db.updateOne({id: new ObjectId(id)}, {
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

        const result = await posts_db.deleteOne({id: new ObjectId(id)})

        return result.deletedCount === 1


    },
    async deleteAllPosts(): Promise<boolean> {
        await posts_db.deleteMany({})
        return true
    }

}