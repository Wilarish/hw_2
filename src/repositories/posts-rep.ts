import {PostsCreateUpdate} from "../types/posts/posts-create-update";
import {DB} from "../data/DB";
import {PostsMainType} from "../types/posts/posts-main-type";
import {blogsRepository} from "./blogs-rep";

export const  postsRepository = {
    findPost(id: string){
        const video =  DB.posts.find(p => p.id === id)
        if(video){
            return video
        }
        else {
            return false
        }
    },
    createPost(data: PostsCreateUpdate ){

        const find_blog = blogsRepository.findBlog(data.blogId)

        const new_post:PostsMainType ={
            id: new Date().toISOString(),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName: find_blog!.name
        }
        return new_post
    },
    updatePost(post: PostsMainType,data:PostsCreateUpdate){

        const find_blog = blogsRepository.findBlog(data.blogId)

        post.title =data.title
        post.shortDescription =data.shortDescription
        post.content= data.content
        post.blogId = data.blogId
        post.blogName = find_blog!.name

        return post
    },
    deletePost(id: string){

        const post: any = DB.posts.find(p => p.id === id)
        if(!post)
            return false
        else {
            DB.posts.splice(DB.posts.indexOf(post), 1)
            return  true
        }


    }

}