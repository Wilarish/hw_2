import {BlogsMainType} from "../types/blogs-types";
import {BlogsRepository} from "../repositories/blogs-rep";
import {PostsCreateUpdate, PostsMainType} from "../types/posts-types";
import {PostsRepository} from "../repositories/posts-rep";
import {ObjectId} from "mongodb";

export class PostsServices {

    constructor(protected blogsRepository: BlogsRepository,
                protected postsRepository: PostsRepository) {
    }

    async createPost(data: PostsCreateUpdate): Promise<string> {

        const find_blog: BlogsMainType | null = await this.blogsRepository.findBlogById(data.blogId.toString())

        const new_post: PostsMainType = new PostsMainType(new ObjectId(),
            data.title,
            data.shortDescription,
            data.content,
            new ObjectId(data.blogId),
            find_blog!.name,
            new Date().toISOString()
        )


        return this.postsRepository.createPost(new_post)

    }

    async updatePost(id: string, data: PostsCreateUpdate): Promise<string | null> {

        return this.postsRepository.updatePost(id, data)

    }

    async deletePost(id: string) {

        return this.postsRepository.deletePost(id)

    }
}

