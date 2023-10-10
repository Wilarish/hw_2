import request from "supertest";
import {app, RouterPath} from "../../settings";
import {HTTP_statuses} from "../../data/HTTP_statuses";
import {PostsMainType} from "../../types/posts/posts-main-type";
import {PostsCreateUpdate} from "../../types/posts/posts-create-update";
import {BlogsMainType} from "../../types/blogs/blogs-main-type";
import {createBlogUtils} from "./utils/createBlog.utils";
import {create_update_Blogs} from "../../types/blogs/blogs-create-update-type";
import {posts_db} from "../../data/DB";
import {postsRepository} from "../../repositories/posts-rep";


describe('/posts', ()=>{


    let createdPost: PostsMainType;
    let createdPost_2: PostsMainType;
    let createdBlog:BlogsMainType;


    beforeAll(async ()=>{
        await request(app)
            .delete('/testing/all-data')
            .expect(HTTP_statuses.NO_CONTENT_204)

    })


    // it('should return 200 and empty array', async () => {
    //     await request(app)
    //         .get(RouterPath.posts)
    //         .expect(HTTP_statuses.OK_200, [])
    // })


    it('should create post with correct data', async () => {


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
    it('should create post_2 with correct data', async () => {


        const data: PostsCreateUpdate = {
            title: 'string_2',
            shortDescription: 'string_2',
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

        createdPost_2 = response.body;


        await request(app)
            .get(RouterPath.posts)
            .expect(HTTP_statuses.OK_200, [createdPost, createdPost_2])

    });
    it('shouldn`t сreate post with incorrect data', async () => {

        const data: PostsCreateUpdate = {
            title: 'string_put',
            shortDescription: 'string_put',
            content: 'string_put',
            blogId: createdBlog.id,
        }

        await request(app)
            .post(RouterPath.posts)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send({...data, title:123})
            .expect(HTTP_statuses.BAD_REQUEST_400)
    });
    it('should update "blogName" when field "name" in blog has been updated', async () => {

        const data:create_update_Blogs = {
            name: 'change',
            description: 'change',
            websiteUrl: 'https://www.change.com'
        }
        await request(app)
            .put(`${RouterPath.blogs}/${createdBlog.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(HTTP_statuses.NO_CONTENT_204)


        const result =  await request(app)
            .get(`${RouterPath.blogs}/${createdBlog.id}`)
            .expect(HTTP_statuses.OK_200 )


        let updateDataPostFromDb  = await postsRepository.findPostById(createdPost.id)
        if (updateDataPostFromDb) createdPost = updateDataPostFromDb


        await request(app)
            .get(`${RouterPath.posts}/${createdPost.id}`)
            .expect(HTTP_statuses.OK_200, {...createdPost, blogName:"change"})



        await request(app)
            .get(`${RouterPath.posts}/${createdPost_2.id}`)
            .expect(HTTP_statuses.OK_200, {...createdPost_2, blogName:"change"})

    });
    it('shouldn`t update post ', async () => {

        const data: PostsCreateUpdate = {
            title: 'string_put',
            shortDescription: 'string_put',
            content: 'string_put',
            blogId: createdBlog.id,
        }

        const notStringTitle = await request(app)
            .put(`${RouterPath.posts}/${createdPost.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send({...data, title: 123})
            .expect(HTTP_statuses.BAD_REQUEST_400 )

        expect(notStringTitle.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'title'
                }
            ]
        })

        const northingInDescription = await request(app)
            .put(`${RouterPath.posts}/${createdPost.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send({...data, shortDescription: ''})
            .expect(HTTP_statuses.BAD_REQUEST_400 )

        expect(northingInDescription.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'shortDescription'
                }
            ]
        })
        const notStringContent = await request(app)
            .put(`${RouterPath.posts}/${createdPost.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send({...data, content: 123})
            .expect(HTTP_statuses.BAD_REQUEST_400 )

        expect(notStringContent.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'content'
                }
            ]
        })

        await request(app)
            .get(`${RouterPath.posts}/${createdPost.id}`)
            .expect(HTTP_statuses.OK_200, createdPost)
    });
    it('shouldn`t update unexpected post ', async () => {

        const data: PostsCreateUpdate = {
            title: 'qqqqqqq',
            shortDescription: 'qqqqqq',
            content: 'sqqqqqqq',
            blogId: createdBlog.id,
        }

        await request(app)
            .put(`${RouterPath.posts}/${-100}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(HTTP_statuses.NOT_FOUND_404)

    });
    it('should update post correct ', async () => {

        const data: PostsCreateUpdate = {
            title: 'correct',
            shortDescription: 'correct',
            content: 'correct',
            blogId: createdBlog.id,
        }
        const res = await request(app)
            .put(`${RouterPath.posts}/${createdPost.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(HTTP_statuses.NO_CONTENT_204)


        const result =  await request(app)
            .get(`${RouterPath.posts}/${createdPost.id}`)
            .expect(HTTP_statuses.OK_200 )

        expect(result.body).toEqual({
            ...createdPost,
            ...data
        })
    });
    it('should delete post', async () => {

        await request(app)
            .delete(`${RouterPath.posts}/${createdPost.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_statuses.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPath.posts}/${createdPost.id}`)
            .expect(HTTP_statuses.NOT_FOUND_404)

    });
    it('shouldn`t delete unexpected post', async () => {


        await request(app)
            .delete(`${RouterPath.posts}/${-100}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_statuses.NOT_FOUND_404)

        await request(app)
            .get(`${RouterPath.posts}/${-100}`)
            .expect(HTTP_statuses.NOT_FOUND_404)

    });


})