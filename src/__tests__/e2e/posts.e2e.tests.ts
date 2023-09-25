import request from "supertest";
import {app, RouterPath} from "../../settings";
import {HTTP_statuses} from "../../data/HTTP_statuses";
import {PostsMainType} from "../../types/posts/posts-main-type";
import {PostsCreateUpdate} from "../../types/posts/posts-create-update";
import {BlogsMainType} from "../../types/blogs/blogs-main-type";
import {DB} from "../../data/DB";
import {create_update_Blogs} from "../../types/blogs/blogs-create-update-type";


describe('/videos', ()=>{

    beforeAll(async ()=>{
        await request(app).delete('/testing/all-data');

        let createdBlog:BlogsMainType;

    })


    it('should return 200 and empty array', async () => {
        await request(app)
            .get(RouterPath.posts)
            .expect(HTTP_statuses.OK_200, [])
    })

    let createdPost: PostsMainType;
    let createdPost_2: PostsMainType;

    DB.blogs = [{
        id: "any_id",
        name: "any_name",
        description: "any_description",
        websiteUrl: "any_websiteUrl"
    }]

    it('should create post with correct data', async () => {

        const data: PostsCreateUpdate = {
            title: 'string',
            shortDescription: 'string',
            content: 'string',
            blogId: 'any_id',
        }
        // Don`t understand this one
        //const {created_Video_Manager} = await video_test_manager.createUser(data)

        const response = await request(app)
            .post(RouterPath.posts)
            .send(data)
            .expect(HTTP_statuses.CREATED_201)

        createdPost = response.body;

        await request(app)
            .get(`${RouterPath.posts}/${createdPost.id}`)
            .expect(HTTP_statuses.OK_200, createdPost)

    });
    // it('should create video_2 with correct data', async () => {
    //
    //     const data: create_update_Blogs = {
    //         name: 'string_2',
    //         description: 'string_2',
    //         websiteUrl: 'https://www.amazon.com'
    //     }
    //     // // Don`t understand this one
    //     // const {created_Video_Manager} = await video_test_manager.createUser(data)
    //
    //     const response = await  request(app)
    //         .post(RouterPath.blogs)
    //         .send(data)
    //         .expect(HTTP_statuses.CREATED_201)
    //
    //     createdBlog_2 = response.body;
    //
    //
    //     await request(app)
    //         .get(RouterPath.blogs)
    //         .expect(HTTP_statuses.OK_200, [createdBlog, createdBlog_2])
    // });
    // it('shouldn`t сreate video with incorrect data', async () => {
    //
    //     const data: create_update_Blogs = {
    //         name: 'string_2',
    //         description: 'string_2',
    //         websiteUrl: 'https://www.amazon.com'
    //     }
    //
    //     await request(app)
    //         .post(RouterPath.blogs)
    //         .send({...data, name:123})
    //         .expect(HTTP_statuses.BAD_REQUEST_400)
    // });
    // it('shouldn`t update video ', async () => {
    //
    //     const data:create_update_Blogs = {
    //         name: 'string_put',
    //         description: 'string_put',
    //         websiteUrl: 'https://www.amazon.com'
    //     }
    //
    //     const notStringTitle = await request(app)
    //         .put(`${RouterPath.blogs}/${createdBlog.id}`)
    //         .send({...data, name: 123})
    //         .expect(HTTP_statuses.BAD_REQUEST_400 )
    //
    //     expect(notStringTitle.body).toEqual({
    //         errorsMessages: [
    //             {
    //                 message: expect.any(String),
    //                 field: 'name'
    //             }
    //         ]
    //     })
    //
    //     const notULR = await request(app)
    //         .put(`${RouterPath.blogs}/${createdBlog.id}`)
    //         .send({...data, description: 'qwerioqweqweqweqweqweqweqweqweqweqweqweqwerqwerqwreqrwerqwerqwerqwerqwre'})
    //         .expect(HTTP_statuses.BAD_REQUEST_400 )
    //
    //     expect(notULR.body).toEqual({
    //         errorsMessages: [
    //             {
    //                 message: expect.any(String),
    //                 field: 'description'
    //             }
    //         ]
    //     })
    //     const longDescription = await request(app)
    //         .put(`${RouterPath.blogs}/${createdBlog.id}`)
    //         .send({...data, websiteUrl: '-----/////'})
    //         .expect(HTTP_statuses.BAD_REQUEST_400 )
    //
    //     expect(longDescription.body).toEqual({
    //         errorsMessages: [
    //             {
    //                 message: expect.any(String),
    //                 field: 'websiteUrl'
    //             }
    //         ]
    //     })
    //
    //     await request(app)
    //         .get(`${RouterPath.blogs}/${createdBlog.id}`)
    //         .expect(HTTP_statuses.OK_200, createdBlog)
    // });
    // it('should update unexpected video ', async () => {
    //
    //     const data:create_update_Blogs = {
    //         name: 'string_put_@',
    //         description: 'string_put_@',
    //         websiteUrl: 'https://www.amazon.com/users/types'
    //     }
    //
    //     await request(app)
    //         .put(`${RouterPath.blogs}/${-100}`)
    //         .send(data)
    //         .expect(HTTP_statuses.NOT_FOUND_404)
    //
    // });
    // it('should update video correct ', async () => {
    //
    //     const data:create_update_Blogs = {
    //         name: 'string_put_@',
    //         description: 'string_put_@',
    //         websiteUrl: 'https://www.amazon.com/users/types'
    //     }
    //     const res = await request(app)
    //         .put(`${RouterPath.blogs}/${createdBlog.id}`)
    //         .send(data)
    //         .expect(HTTP_statuses.NO_CONTENT_204)
    //
    //     console.log('RESULT:',res.body)
    //
    //     const result =  await request(app)
    //         .get(`${RouterPath.blogs}/${createdBlog.id}`)
    //         .expect(HTTP_statuses.OK_200 )
    //
    //     expect(result.body).toEqual({
    //         ...createdBlog,
    //         ...data
    //     })
    // });
    // it('should delete video', async () => {
    //
    //     await request(app)
    //         .delete(`${RouterPath.blogs}/${createdBlog.id}`)
    //         .expect(HTTP_statuses.NO_CONTENT_204)
    //
    //     await request(app)
    //         .get(`${RouterPath.blogs}/${createdBlog.id}`)
    //         .expect(HTTP_statuses.NOT_FOUND_404)
    //
    // });
    // it('shouldn`t delete unexpected video', async () => {
    //
    //
    //     await request(app)
    //         .delete(`${RouterPath.blogs}/${-100}`)
    //         .expect(HTTP_statuses.NOT_FOUND_404)
    //
    //     await request(app)
    //         .get(`${RouterPath.blogs}/${-100}`)
    //         .expect(HTTP_statuses.NOT_FOUND_404)
    //
    // });
    //

})