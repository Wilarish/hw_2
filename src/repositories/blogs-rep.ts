import {DB} from "../data/DB";

export const  blogsRepository = {
    findBlog(id: string){
        const blog =  DB.blogs.find(p => p.id === id)
        if(blog){
            return blog
        }
        else {
            return false
        }
    }
}