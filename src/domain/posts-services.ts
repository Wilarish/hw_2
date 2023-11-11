import {BlogsMainType} from "../types/blogs-types";
import {blogsRepository} from "../repositories/blogs-rep";
import {PostsCreateUpdate, PostsMainType} from "../types/posts-types";
import {postsRepository} from "../repositories/posts-rep";
import {CommentsCreateUpdate, CommentsMainType} from "../types/comments-types";
import {usersRepository} from "../repositories/users-rep";
import {UsersMainType} from "../types/users-types";
import {commentsRepository} from "../repositories/comments-rep";
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
    async createCommentForPost(userId:string, postId:string, data:CommentsCreateUpdate):Promise<string|null>{

        const user:UsersMainType| null = await usersRepository.findUserById(userId)
        const post:PostsMainType| null = await postsRepository.findPostById(postId)

        if(!post) return null
        
        if(user){

            const new_comment: CommentsMainType = {
            id: new ObjectId(),
            content: data.content,
            commentatorInfo: {
                userId: new ObjectId(userId) ,
                userLogin: user.login
            },
            createdAt: new Date().toISOString(),
            postId:postId
        }
            return await commentsRepository.createComment(new_comment)
        }
        return null



    },
    async updatePost(id:string, data: PostsCreateUpdate):Promise<string|null>{

        return postsRepository.updatePost(id, data)

    },
    async deletePost(id:string){

        return postsRepository.deletePost(id)

    }
}