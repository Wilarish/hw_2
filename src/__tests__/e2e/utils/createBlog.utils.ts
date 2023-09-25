import {create_update_Blogs} from "../../../types/blogs/blogs-create-update-type";
import request from "supertest";
import {app, RouterPath} from "../../../settings";
import {HTTP_statuses} from "../../../data/HTTP_statuses";
import {blogs} from "../constants/blogsConstants";

export const createBlogUtils = async(num: number) => {

    //const createdBlogs = []

    const res = await request(app)
        .post(RouterPath.blogs)
        .set("Authorization", "Basic YWRtaW46cXdlcnR5")
        .send(blogs.correctBlog1)
        .expect(HTTP_statuses.CREATED_201)

    return res.body

}