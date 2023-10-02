import request from "supertest";
import {app, RouterPath} from "../../settings";
import {HTTP_statuses} from "../../data/HTTP_statuses";
import {BlogsMainType} from "../../types/blogs/blogs-main-type";
import {create_update_Blogs} from "../../types/blogs/blogs-create-update-type";
describe('/blogs', ()=>{
    beforeAll(async ()=>{
        await request(app).delete('/testing/all-data')
    })


    it('should return 200 and empty array', async () => {
        await request(app)
            .get(RouterPath.blogs)
            .expect(HTTP_statuses.OK_200, [])
    })

    let createdBlog: BlogsMainType;
    let createdBlog_2: BlogsMainType;

    it('should create blog with correct data', async () => {

        const data: create_update_Blogs = {
            name: 'string',
            description: 'string',
            websiteUrl: 'https://www.google.com'
        }

         const response = await request(app)
             .post(RouterPath.blogs)
             .set("Authorization", "Basic YWRtaW46cXdlcnR5")
             .send(data)
             .expect(HTTP_statuses.CREATED_201)

        createdBlog = response.body;



        await request(app)
            .get(`${RouterPath.blogs}/${createdBlog.id}`)
            .expect(HTTP_statuses.OK_200, createdBlog)

    });
    it('should create blog_2 with correct data', async () => {

        const data: create_update_Blogs = {
            name: 'string_2',
            description: 'string_2',
            websiteUrl: 'https://www.amazon.com'
        }
        // // Don`t understand this one
        // const {created_Video_Manager} = await video_test_manager.createUser(data)

        const response = await  request(app)
            .post(RouterPath.blogs)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(HTTP_statuses.CREATED_201)

        createdBlog_2 = response.body;


       const res = await request(app)
            .get(RouterPath.blogs)
            .expect(HTTP_statuses.OK_200, )

        console.log(res.body)

        expect(res.body).toEqual([createdBlog, createdBlog_2])
    });
    it('shouldn`t сreate blog with incorrect data', async () => {

        const data: create_update_Blogs = {
            name: 'string_2',
            description: 'string_2',
            websiteUrl: 'https://www.amazon.com'
        }

        await request(app)
            .post(RouterPath.blogs)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send({...data, name:123})
            .expect(HTTP_statuses.BAD_REQUEST_400)
    });
    it('shouldn`t update blog ', async () => {

        const data:create_update_Blogs = {
            name: 'string_put',
            description: 'string_put',
            websiteUrl: 'https://www.amazon.com'
        }

        const notStringName = await request(app)
            .put(`${RouterPath.blogs}/${createdBlog.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send({...data, name: 123})
            .expect(HTTP_statuses.BAD_REQUEST_400 )

        expect(notStringName.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'name'
                }
            ]
        })

        const descriptionIsNotString = await request(app)
            .put(`${RouterPath.blogs}/${createdBlog.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send({...data, description: 1111})
            .expect(HTTP_statuses.BAD_REQUEST_400 )

        expect(descriptionIsNotString.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'description'
                }
            ]
        })
        const notUrl = await request(app)
            .put(`${RouterPath.blogs}/${createdBlog.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send({...data, websiteUrl: '-----/////'})
            .expect(HTTP_statuses.BAD_REQUEST_400 )

        expect(notUrl.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'websiteUrl'
                }
            ]
        })


        await request(app)
            .get(`${RouterPath.blogs}/${createdBlog.id}`)
            .expect(HTTP_statuses.OK_200, createdBlog)
    });
    it('shouldn`t update unexpected blog ', async () => {

        const data:create_update_Blogs = {
            name: 'string_put_@',
            description: 'string_put_@',
            websiteUrl: 'https://www.amazon.com/users/types'
        }

        await request(app)
            .put(`${RouterPath.blogs}/${-100}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(HTTP_statuses.NOT_FOUND_404)

    });
    it('should update blog correct ', async () => {

        const data:create_update_Blogs = {
            name: 'string_put_@',
            description: 'string_put_@',
            websiteUrl: 'https://www.amazon.com/users/types'
        }
        const res = await request(app)
            .put(`${RouterPath.blogs}/${createdBlog.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(HTTP_statuses.NO_CONTENT_204)


        const result =  await request(app)
            .get(`${RouterPath.blogs}/${createdBlog.id}`)
            .expect(HTTP_statuses.OK_200 )

        expect(result.body).toEqual({
            ...createdBlog,
            ...data
        })
    });
    it('should delete blog', async () => {

        await request(app)
            .delete(`${RouterPath.blogs}/${createdBlog.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_statuses.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPath.blogs}/${createdBlog.id}`)
            .expect(HTTP_statuses.NOT_FOUND_404)

    });
    it('shouldn`t delete unexpected blog', async () => {


        await request(app)
            .delete(`${RouterPath.blogs}/${-100}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_statuses.NOT_FOUND_404)

        await request(app)
            .get(`${RouterPath.blogs}/${-100}`)
            .expect(HTTP_statuses.NOT_FOUND_404)

    });


})