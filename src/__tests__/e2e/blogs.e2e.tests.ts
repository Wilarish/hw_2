import request from "supertest";
import {app, RouterPath} from "../../settings";
import {HTTP_STATUSES} from "../../data/HTTP_STATUSES";
import {BlogsMainType} from "../../types/blogs/blogs-main-type";
import {BlogsCreateUpdate} from "../../types/blogs/blogs-create-update-type";
import {Paginated} from "../../types/pagination.type";


describe('/blogs', ()=>{

    beforeAll(async ()=>{
        await request(app)
            .delete('/testing/all-data')
            .expect(HTTP_STATUSES.NO_CONTENT_204)

    })


    let expectedRes: Paginated<BlogsMainType> = {
        pagesCount: expect.any(Number),
        page: expect.any(Number),
        pageSize: expect.any(Number),
        totalCount: expect.any(Number),
        items: expect.any(Array)
    }


    it('should return 200 and empty array', async () => {

       const res = await request(app)
            .get(RouterPath.blogs)
            .expect(HTTP_STATUSES.OK_200)
        expect(res.body).toEqual(expectedRes)
    })

    let createdBlog: BlogsMainType;
    let createdBlog_2: BlogsMainType;

    it('should create blog with correct data', async () => {

        const data: BlogsCreateUpdate = {
            name: 'string',
            description: 'string',
            websiteUrl: 'https://www.google.com'
        }

         const response = await request(app)
             .post(RouterPath.blogs)
             .set("Authorization", "Basic YWRtaW46cXdlcnR5")
             .send(data)
             .expect(HTTP_STATUSES.CREATED_201)

        createdBlog = response.body;



        await request(app)
            .get(`${RouterPath.blogs}/${createdBlog.id}`)
            .expect(HTTP_STATUSES.OK_200, createdBlog)

    });
    it('should create blog_2 with correct data', async () => {

        const data: BlogsCreateUpdate = {
            name: 'string_2',
            description: 'string_2',
            websiteUrl: 'https://www.amazon.com'
        }


        const response = await  request(app)
            .post(RouterPath.blogs)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        createdBlog_2 = response.body;


       const res = await request(app)
            .get(RouterPath.blogs)
            .expect(HTTP_STATUSES.OK_200, )


        expect(res.body).toEqual({...expectedRes, totalCount: 2})
        expect(res.body.items).toEqual([ createdBlog_2, createdBlog])
    });
    it('shouldn`t сreate blog with incorrect data', async () => {

        const data: BlogsCreateUpdate = {
            name: 'string_2',
            description: 'string_2',
            websiteUrl: 'https://www.amazon.com'
        }

        await request(app)
            .post(RouterPath.blogs)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send({...data, name:123})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
    });
    it('shouldn`t update blog ', async () => {

        const data:BlogsCreateUpdate = {
            name: 'string_put',
            description: 'string_put',
            websiteUrl: 'https://www.amazon.com'
        }

        const notStringName = await request(app)
            .put(`${RouterPath.blogs}/${createdBlog.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send({...data, name: 123})
            .expect(HTTP_STATUSES.BAD_REQUEST_400 )

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
            .expect(HTTP_STATUSES.BAD_REQUEST_400 )

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
            .expect(HTTP_STATUSES.BAD_REQUEST_400 )

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
            .expect(HTTP_STATUSES.OK_200, createdBlog)
    });
    it('shouldn`t update unexpected blog ', async () => {

        const data:BlogsCreateUpdate = {
            name: 'string_put_@',
            description: 'string_put_@',
            websiteUrl: 'https://www.amazon.com/users/types'
        }

        await request(app)
            .put(`${RouterPath.blogs}/${-100}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

    });
    it('should update blog correct ', async () => {

        const data:BlogsCreateUpdate = {
            name: 'string_put_@',
            description: 'string_put_@',
            websiteUrl: 'https://www.amazon.com/users/types'
        }
        await request(app)
            .put(`${RouterPath.blogs}/${createdBlog.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204)


        const result =  await request(app)
            .get(`${RouterPath.blogs}/${createdBlog.id}`)
            .expect(HTTP_STATUSES.OK_200 )

        expect(result.body).toEqual({
            ...createdBlog,
            ...data
        })
    });
    it('should delete blog', async () => {

        await request(app)
            .delete(`${RouterPath.blogs}/${createdBlog.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPath.blogs}/${createdBlog.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

    });
    it('shouldn`t delete unexpected blog', async () => {


        await request(app)
            .delete(`${RouterPath.blogs}/${-100}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPath.blogs}/${-100}`)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

    });


})