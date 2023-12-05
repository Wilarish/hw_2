
import request from "supertest";
import {InitApp, RouterPath} from "../../../settings";
import {HTTP_STATUSES} from "../../../data/HTTP_STATUSES";
import {blogs} from "../constants/blogsConstants";

export const createBlogUtils = async() => {

    //const createdBlogs = []
    const app = InitApp()

    const res = await request(app)
        .post(RouterPath.blogs)
        .set("Authorization", "Basic YWRtaW46cXdlcnR5")
        .send(blogs.correctBlog1)
        .expect(HTTP_STATUSES.CREATED_201)

    return res.body

}