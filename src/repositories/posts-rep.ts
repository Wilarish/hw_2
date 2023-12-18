import {PostsCreateUpdate, PostsMainType} from "../types/posts-types";
import {BlogsMainType} from "../types/blogs-types";
import {ObjectId} from "mongodb";
import {PostsModel} from "../domain/models/models";
import {BlogsRepository} from "./blogs-rep";

export class PostsRepository {
    constructor(private blogsRepository:BlogsRepository  ) {
    }
    async findPostById(id: string): Promise<PostsMainType | null> {
        return PostsModel.findOne({id: new ObjectId(id)})
    }

    async createPost(post: PostsMainType): Promise<string> {

        await PostsModel.create(post)
        return post.id.toString()
    }
    async updatePost(id: string, data: PostsCreateUpdate): Promise<string | null> {

        const find_blog: BlogsMainType | null = await this.blogsRepository.findBlogById(data.blogId.toString())

        const result = await PostsModel.updateOne({id: new ObjectId(id)},
            {
                title: data.title,
                shortDescription: data.shortDescription,
                content: data.content,
                blogId: data.blogId,
                blogName: find_blog!.name
            }
        )


        if (result.matchedCount === 1)
            return id
        else
            return null
    }
    async deletePost(id: string): Promise<boolean> {

        const result = await PostsModel.deleteOne({id: new ObjectId(id)})

        return result.deletedCount === 1


    }
    async deleteAllPosts(): Promise<boolean> {
        await PostsModel.deleteMany({})
        return true
    }

}
