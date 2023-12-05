import request from "supertest";
import {UsersCreate, UsersMainType} from "../../types/users-types";
import {InitApp, RouterPath} from "../../settings";
import {HTTP_STATUSES} from "../../data/HTTP_STATUSES";
import {Paginated} from "../../types/pagination.type";
import {RunDb} from "../../data/DB";

describe('/users', ()=>{

    const app = InitApp()

    let createdUser:UsersMainType;
    let createdUser_2:UsersMainType

    beforeAll(async()=> {
        await RunDb()
    })

    beforeAll(async ()=>{
        await request(app)
            .delete('/testing/all-data')
            .expect(HTTP_STATUSES.NO_CONTENT_204)

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
            .expect(HTTP_STATUSES.OK_200)
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
            .expect(HTTP_STATUSES.CREATED_201 )

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
            .expect(HTTP_STATUSES.OK_200)

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
            .expect(HTTP_STATUSES.CREATED_201 )

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
            .expect(HTTP_STATUSES.OK_200)

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
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

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
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

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
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

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
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPath.users}/${createdUser.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_STATUSES.NOT_FOUND_404)

    });
    it('shouldn`t delete unexpected user', async () => {


        await request(app)
            .delete(`${RouterPath.users}/${-100}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPath.users}/111122223333444455556666`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_STATUSES.NOT_FOUND_404)

    });

})