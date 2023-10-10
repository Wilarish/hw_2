import {blogs_db, posts_db} from "../data/DB";
import {BlogsMainType} from "../types/blogs/blogs-main-type";
import {create_update_Blogs} from "../types/blogs/blogs-create-update-type";
import {PostsMainType} from "../types/posts/posts-main-type";
import {BlogsPaginationType, DefaultPaginationType, Paginated} from "../types/pagination.type";
import {Filter} from "mongodb";


export const blogsRepository = {

    async findBlogs(pagination: BlogsPaginationType): Promise<Paginated<BlogsMainType>> {
        const filter: Filter<BlogsMainType> = {name: {$regex: pagination.searchNameTerm, $options: 'i'}}

        const [items, totalCount] = await Promise.all([
            blogs_db
                .find(filter, {projection: {_id: 0}})
                .sort({[pagination.sortBy]: pagination.sortDirection})
                .skip(pagination.skip)
                .limit(pagination.pageSize)
                .toArray(),

            blogs_db.countDocuments(filter)
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

    async findBlogById(id: string): Promise<BlogsMainType | null> {

        const blog: BlogsMainType | null = await blogs_db.findOne({id: id}, {projection: {_id: 0}})

        return blog
    },
    // async findPostsForBlogsById(id: string): Promise<PostsMainType[]> {
    //
    //     const posts: PostsMainType[] = await posts_db.find({blogId: id}, {projection: {_id: 0}}).toArray()
    //
    //     return posts
    //
    // },
    async findPostsForBlogsById(id: string, pagination: DefaultPaginationType): Promise<Paginated<PostsMainType>> {
        const filter: Filter<PostsMainType> = {blogId: id}

        const [items, totalCount] = await Promise.all([
            posts_db
                .find(filter, {projection: {_id: 0}})
                .sort({[pagination.sortBy]: pagination.sortDirection})
                .skip(pagination.skip)
                .limit(pagination.pageSize)
                .toArray(),

            posts_db.countDocuments(filter)
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
    async createBlog(new_blog: BlogsMainType): Promise<BlogsMainType> {

        await blogs_db.insertOne({...new_blog})

        return new_blog
    },
    async updateBlog(id: string, data: create_update_Blogs): Promise<BlogsMainType | null> {

        const result = await blogs_db.updateOne({id: id}, {
            $set: {
                name: data.name,
                description: data.description,
                websiteUrl: data.websiteUrl
            }
        })

        await posts_db.updateMany({blogId: id}, {$set: {blogName: data.name}})

        if (result.matchedCount === 1)
            return blogsRepository.findBlogById(id)
        else
            return null


    },
    async deleteBlog(id: string): Promise<boolean> {

        const result = await blogs_db.deleteOne({id: id})

        return result.deletedCount === 1


    },
    async deleteAllBlogs(): Promise<boolean> {
        await blogs_db.deleteMany({})
        return true
    }

}
