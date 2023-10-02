import request from "supertest";
import {app, RouterPath} from "../../settings";
import {HTTP_statuses} from "../../data/HTTP_statuses";
import {createBlogUtils} from "./utils/createBlog.utils";
import {PostsCreateUpdate} from "../../types/posts/posts-create-update";
import {BlogsMainType} from "../../types/blogs/blogs-main-type";
import {PostsMainType} from "../../types/posts/posts-main-type";
describe('/posts', ()=>{
    let createdPost:PostsMainType
    let createdBlog: BlogsMainType

    it('should create post and blog with correct data', async () => {


        createdBlog = await createBlogUtils();

        const data: PostsCreateUpdate = {
            title: 'string',
            shortDescription: 'string',
            content: 'string',
            blogId: createdBlog.id,
        }


        const response = await request(app)
            .post(RouterPath.posts)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(HTTP_statuses.CREATED_201)

        expect(response.body).toEqual({
            id: expect.any(String),
            ...data,
            blogName: createdBlog.name,
            createdAt: expect.any(String)
        })

        createdPost = response.body;

        await request(app)
            .get(`${RouterPath.posts}/${createdPost.id}`)
            .expect(HTTP_statuses.OK_200, createdPost)

    });


    it('should response 401 in blogs', async () => {

        //without auth

        await request(app)
            .post(RouterPath.posts)
            .expect(HTTP_statuses.UNAUTHORIZED_401)

        await request(app)
            .put(`${RouterPath.posts}/${createdBlog.id}`)
            .expect(HTTP_statuses.UNAUTHORIZED_401)

        await request(app)
            .delete(`${RouterPath.posts}/${createdBlog.id}`)
            .expect(HTTP_statuses.UNAUTHORIZED_401)

//______________________

        //wrong pass

        await request(app)
            .post(RouterPath.posts)
            .set("Authorization", "Basic YWRtaW46cXdnR5")
            .expect(HTTP_statuses.UNAUTHORIZED_401)

        await request(app)
            .put(`${RouterPath.posts}/${createdBlog.id}`)
            .set("Authorization", "Basic YWRtaW46cXdnR5")
            .expect(HTTP_statuses.UNAUTHORIZED_401)

        await request(app)
            .delete(`${RouterPath.posts}/${createdBlog.id}`)
            .set("Authorization", "Basic YWRtaW46cXdnR5")
            .expect(HTTP_statuses.UNAUTHORIZED_401)

//______________________

        //wrong auth

        await request(app)
            .post(RouterPath.posts)
            .set("Authorization", "Bas YWRtaW46cXdlcnR5")
            .expect(HTTP_statuses.UNAUTHORIZED_401)

        await request(app)
            .put(`${RouterPath.blogs}/${createdBlog.id}`)
            .set("Authorization", "Bas YWRtaW46cXdlcnR5")
            .expect(HTTP_statuses.UNAUTHORIZED_401)

        await request(app)
            .delete(`${RouterPath.blogs}/${createdBlog.id}`)
            .set("Authorization", "Bas YWRtaW46cXdlcnR5")
            .expect(HTTP_statuses.UNAUTHORIZED_401)

//_______________________

        //wrong header

        await request(app)
            .post(RouterPath.posts)
            .set("Authortion", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_statuses.UNAUTHORIZED_401)

        await request(app)
            .put(`${RouterPath.blogs}/${createdBlog.id}`)
            .set("Authortion", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_statuses.UNAUTHORIZED_401)

        await request(app)
            .delete(`${RouterPath.blogs}/${createdBlog.id}`)
            .set("Authortion", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_statuses.UNAUTHORIZED_401)

    });

    it('should response 401 in posts', async () => {

        //without auth

        await request(app)
            .post(RouterPath.posts)
            .expect(HTTP_statuses.UNAUTHORIZED_401)

        await request(app)
            .put(`${RouterPath.posts}/${createdPost.id}`)
            .expect(HTTP_statuses.UNAUTHORIZED_401)

        await request(app)
            .delete(`${RouterPath.posts}/${createdPost.id}`)
            .expect(HTTP_statuses.UNAUTHORIZED_401)

//______________________

        //wrong pass

        await request(app)
            .post(RouterPath.posts)
            .set("Authorization", "Basic YWRtaW46cXdnR5")
            .expect(HTTP_statuses.UNAUTHORIZED_401)

        await request(app)
            .put(`${RouterPath.posts}/${createdPost.id}`)
            .set("Authorization", "Basic YWRtaW46cXdnR5")
            .expect(HTTP_statuses.UNAUTHORIZED_401)

        await request(app)
            .delete(`${RouterPath.posts}/${createdPost.id}`)
            .set("Authorization", "Basic YWRtaW46cXdnR5")
            .expect(HTTP_statuses.UNAUTHORIZED_401)

//______________________

        //wrong auth

        await request(app)
            .post(RouterPath.posts)
            .set("Authorization", "Bas YWRtaW46cXdlcnR5")
            .expect(HTTP_statuses.UNAUTHORIZED_401)

        await request(app)
            .put(`${RouterPath.posts}/${createdPost.id}`)
            .set("Authorization", "Bas YWRtaW46cXdlcnR5")
            .expect(HTTP_statuses.UNAUTHORIZED_401)

        await request(app)
            .delete(`${RouterPath.posts}/${createdPost.id}`)
            .set("Authorization", "Bas YWRtaW46cXdlcnR5")
            .expect(HTTP_statuses.UNAUTHORIZED_401)

//_______________________

        //wrong header

        await request(app)
            .post(RouterPath.posts)
            .set("Authortion", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_statuses.UNAUTHORIZED_401)

        await request(app)
            .put(`${RouterPath.posts}/${createdPost.id}`)
            .set("Authortion", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_statuses.UNAUTHORIZED_401)

        await request(app)
            .delete(`${RouterPath.posts}/${createdPost.id}`)
            .set("Authortion", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_statuses.UNAUTHORIZED_401)

    });

})