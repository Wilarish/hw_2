import request from "supertest";
import {InitApp, RouterPath} from "../../settings";
import {HTTP_STATUSES} from "../../data/HTTP_STATUSES";
import {createBlogUtils} from "./utils/createBlog.utils";
import {BlogsMainType} from "../../types/blogs-types";
import {PostsCreateUpdate, PostsMainType} from "../../types/posts-types";
import {RunDb} from "../../data/DB";
describe('/authBasic', ()=>{

    const app = InitApp()

    beforeAll(async()=> {
        await RunDb()
    })

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
            .expect(HTTP_STATUSES.CREATED_201)

        expect(response.body).toEqual({
            id: expect.any(String),
            ...data,
            blogName: createdBlog.name,
            createdAt: expect.any(String),
            extendedLikesInfo:expect.any(Object)
        })

        createdPost = response.body;

        await request(app)
            .get(`${RouterPath.posts}/${createdPost.id}`)
            .expect(HTTP_STATUSES.OK_200, createdPost)

    });


    it('should response 401 in blogs', async () => {

        //without auth

        await request(app)
            .post(RouterPath.posts)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        await request(app)
            .put(`${RouterPath.posts}/${createdBlog.id}`)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        await request(app)
            .delete(`${RouterPath.posts}/${createdBlog.id}`)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

//______________________

        //wrong pass

        await request(app)
            .post(RouterPath.posts)
            .set("Authorization", "Basic YWRtaW46cXdnR5")
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        await request(app)
            .put(`${RouterPath.posts}/${createdBlog.id}`)
            .set("Authorization", "Basic YWRtaW46cXdnR5")
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        await request(app)
            .delete(`${RouterPath.posts}/${createdBlog.id}`)
            .set("Authorization", "Basic YWRtaW46cXdnR5")
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

//______________________

        //wrong auth

        await request(app)
            .post(RouterPath.posts)
            .set("Authorization", "Bas YWRtaW46cXdlcnR5")
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        await request(app)
            .put(`${RouterPath.blogs}/${createdBlog.id}`)
            .set("Authorization", "Bas YWRtaW46cXdlcnR5")
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        await request(app)
            .delete(`${RouterPath.blogs}/${createdBlog.id}`)
            .set("Authorization", "Bas YWRtaW46cXdlcnR5")
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

//_______________________

        //wrong header

        await request(app)
            .post(RouterPath.posts)
            .set("Authortion", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        await request(app)
            .put(`${RouterPath.blogs}/${createdBlog.id}`)
            .set("Authortion", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        await request(app)
            .delete(`${RouterPath.blogs}/${createdBlog.id}`)
            .set("Authortion", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

    });

    it('should response 401 in posts', async () => {

        //without auth

        await request(app)
            .post(RouterPath.posts)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        await request(app)
            .put(`${RouterPath.posts}/${createdPost.id}`)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        await request(app)
            .delete(`${RouterPath.posts}/${createdPost.id}`)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

//______________________

        //wrong pass

        await request(app)
            .post(RouterPath.posts)
            .set("Authorization", "Basic YWRtaW46cXdnR5")
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        await request(app)
            .put(`${RouterPath.posts}/${createdPost.id}`)
            .set("Authorization", "Basic YWRtaW46cXdnR5")
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        await request(app)
            .delete(`${RouterPath.posts}/${createdPost.id}`)
            .set("Authorization", "Basic YWRtaW46cXdnR5")
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

//______________________

        //wrong auth

        await request(app)
            .post(RouterPath.posts)
            .set("Authorization", "Bas YWRtaW46cXdlcnR5")
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        await request(app)
            .put(`${RouterPath.posts}/${createdPost.id}`)
            .set("Authorization", "Bas YWRtaW46cXdlcnR5")
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        await request(app)
            .delete(`${RouterPath.posts}/${createdPost.id}`)
            .set("Authorization", "Bas YWRtaW46cXdlcnR5")
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

//_______________________

        //wrong header

        await request(app)
            .post(RouterPath.posts)
            .set("Authortion", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        await request(app)
            .put(`${RouterPath.posts}/${createdPost.id}`)
            .set("Authortion", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        await request(app)
            .delete(`${RouterPath.posts}/${createdPost.id}`)
            .set("Authortion", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

    });

})