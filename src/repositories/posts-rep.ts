import {PostsCreateUpdate} from "../types/posts/posts-create-update";
import {blogs_db, posts_db} from "../data/DB";
import {PostsMainType} from "../types/posts/posts-main-type";
import {blogsRepository} from "./blogs-rep";
import {BlogsMainType} from "../types/blogs/blogs-main-type";
import {DefaultPaginationType, Paginated} from "../types/pagination.type";

export const postsRepository = {

    async findPosts(pagination: DefaultPaginationType): Promise<Paginated<PostsMainType>> {

        const [items, totalCount] = await Promise.all([
            posts_db
                .find({}, {projection: {_id: 0}})
                .sort({[pagination.sortBy]: pagination.sortDirection})
                .skip(pagination.skip)
                .limit(pagination.pageSize)
                .toArray(),

            posts_db.countDocuments()
        ])

        const pagesCount = Math.ceil(totalCount / pagination.pageSize)

        return {
            pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount,
            items
        }
    },

    async findPostById(id: string): Promise<PostsMainType | null> {
        const post: PostsMainType|null = await posts_db.findOne({id:id},{ projection: {  _id: 0 } })
        if (!post) {
            return null
        } else {
            return post
        }
    },
    async createPost(post: PostsMainType): Promise<PostsMainType> {

        await posts_db.insertOne({...post})

        return post
    },
    async updatePost(id: string, data: PostsCreateUpdate): Promise<PostsMainType | null> {

        const find_blog: BlogsMainType | null = await blogsRepository.findBlogById(data.blogId)

        const result = await posts_db.updateOne({id:id},{$set:{

            title: data.title,
            shortDescription: data.shortDescription,
            content : data.content,
            blogId : data.blogId,
            blogName : find_blog!.name
        }})


        if (result.matchedCount === 1)
            return postsRepository.findPostById(id)
        else
            return null
    },
    async deletePost(id: string): Promise<boolean> {

        const result  = await posts_db.deleteOne({id:id})

        return result.deletedCount === 1


    },
    async deleteAllPosts(): Promise<boolean> {
        await posts_db.deleteMany({})
        return true
    }

}