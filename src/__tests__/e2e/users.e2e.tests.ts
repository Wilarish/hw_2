import request from "supertest";
import {UsersMainType} from "../../types/users/users-main-type";
import {UsersCreate} from "../../types/users/users-create";
import {app, RouterPath} from "../../settings";
import {HTTP_statuses} from "../../data/HTTP_statuses";
import {Paginated} from "../../types/pagination.type";
import {PostsMainType} from "../../types/posts/posts-main-type";
import {createBlogUtils} from "./utils/createBlog.utils";
import {PostsCreateUpdate} from "../../types/posts/posts-create-update";
import {BlogsCreateUpdate} from "../../types/blogs/blogs-create-update-type";
import {postsRepository} from "../../repositories/posts-rep";

describe('/users', ()=>{

    let createdUser:UsersMainType;
    let createdUser_2:UsersMainType

    beforeAll(async ()=>{
        await request(app)
            .delete('/testing/all-data')
            .expect(HTTP_statuses.NO_CONTENT_204)

    })

    let expectedRes: Paginated<UsersMainType> = {
        pagesCount: expect.any(Number),
        page: expect.any(Number),
        pageSize: expect.any(Number),
        totalCount: expect.any(Number),
        items: expect.any(Array)
    }


    it('should return 200 and empty array', async () => {
        const res = await request(app)
            .get(RouterPath.users)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_statuses.OK_200)
        expect(res.body).toEqual(expectedRes)

    })


    it('should create user with correct data', async () => {


        const data: UsersCreate = {
            login:'login',
            password:'password',
            email:'email@gmail.com'
        }


        const response = await request(app)
            .post(RouterPath.users)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(HTTP_statuses.CREATED_201 )

        expect(response.body).toEqual({
            id: expect.any(String),
            login:'login',
            email:expect.any(String),
            createdAt: expect.any(String)
        })

        createdUser = response.body;

        const  res = await request(app)
            .get(RouterPath.users)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_statuses.OK_200)

        expect(res.body).toEqual(expectedRes)
        expect(res.body.items).toEqual([createdUser])

    });
    it('should create user_2 with correct data', async () => {


        const data: UsersCreate = {
            login:'login_2',
            password:'password_2',
            email:'email_2@gmail.com'
        }


        const response = await request(app)
            .post(RouterPath.users)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(HTTP_statuses.CREATED_201 )

        expect(response.body).toEqual({
            id: expect.any(String),
            login:'login_2',
            email:expect.any(String),
            createdAt: expect.any(String)
        })

        createdUser_2 = response.body;

        const  res = await request(app)
            .get(RouterPath.users)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_statuses.OK_200)

        expect(res.body).toEqual(expectedRes)
        expect(res.body.items).toEqual([createdUser_2, createdUser])

    });
    it('shouldn`t сreate user with incorrect data', async () => {

        const data: UsersCreate = {
            login:'login_@',
            password:'password_@',
            email:'email_N@gmail.com'
        }

        const notStringLogin = await request(app)
            .post(RouterPath.users)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send({...data, login:123})
            .expect(HTTP_statuses.BAD_REQUEST_400)

        expect(notStringLogin.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'login'
                }
            ]
        })

        const notStringEmail = await request(app)
            .post(RouterPath.users)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send({...data, email:12345})
            .expect(HTTP_statuses.BAD_REQUEST_400)

        expect(notStringEmail.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'email'
                }
            ]
        })

        const notStringPassword = await request(app)
            .post(RouterPath.users)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send({...data, password:123456})
            .expect(HTTP_statuses.BAD_REQUEST_400)

        expect(notStringPassword.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'password'
                }
            ]
        })
    });


    it('should delete user', async () => {

        await request(app)
            .delete(`${RouterPath.users}/${createdUser.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_statuses.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPath.users}/${createdUser.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_statuses.NOT_FOUND_404)

    });
    it('shouldn`t delete unexpected user', async () => {


        await request(app)
            .delete(`${RouterPath.users}/${-100}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_statuses.NOT_FOUND_404)

        await request(app)
            .get(`${RouterPath.users}/${-100}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_statuses.NOT_FOUND_404)

    });

})