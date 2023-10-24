import {PostsCreateUpdate} from "../types/posts/posts-create-update";
import {BlogsMainType} from "../types/blogs/blogs-main-type";
import {blogsRepository} from "../repositories/blogs-rep";
import {PostsMainType} from "../types/posts/posts-main-type";
import {postsRepository} from "../repositories/posts-rep";
import {BlogsCreateUpdate} from "../types/blogs/blogs-create-update-type";
import {CommentsMainType} from "../types/comments/comments-main-type";
import {CommentsCreateUpdate} from "../types/comments/comments-create-update";
import {usersRepository} from "../repositories/users-rep";
import {UsersMainType} from "../types/users/users-main-type";
import {commentsRepository} from "../repositories/comments-rep";

export const postsServises = {
    async createPost(data: PostsCreateUpdate) {

        const find_blog: BlogsMainType | null = await blogsRepository.findBlogById(data.blogId)

        const new_post: PostsMainType = {

            id: new Date().toISOString(),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName: find_blog!.name,
            createdAt: new Date().toISOString()
        }

        return postsRepository.createPost(new_post)

    },
    async createCommentForPost(userid:string, postid:string, data:CommentsCreateUpdate){

        const user:UsersMainType| null = await usersRepository.findUserById(userid)
        const post:PostsMainType| null = await postsRepository.findPostById(postid)

        if(!post) return null

        console.log("postid when created comment: "+postid)
        if(user){

            const new_comment: CommentsMainType = {
            id: new Date().toISOString(),
            content: data.content,
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login
            },
            createdAt: new Date().toISOString(),
            postId:postid
        }
            return await commentsRepository.createComment(new_comment)
        }
        return null



    },
    async updatePost(id:string, data: PostsCreateUpdate){

        return postsRepository.updatePost(id, data)

    },
    async deletePost(id:string){

        return postsRepository.deletePost(id)

    }
}