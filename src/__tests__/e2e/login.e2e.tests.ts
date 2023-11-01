import request from "supertest";
import {app, RouterPath} from "../../settings";
import {HTTP_STATUSES} from "../../data/HTTP_STATUSES";
import {Paginated} from "../../types/pagination.type";
import {UsersMainType} from "../../types/users/users-main-type";
import {UsersCreate} from "../../types/users/users-create";

describe('/login',()=>{
    beforeAll(async ()=>{
        await request(app)
            .delete('/testing/all-data')
            .expect(HTTP_STATUSES.NO_CONTENT_204)

    })
    let createdUser:UsersMainType

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

    it('should response 401 because wrong login/email or password', async () => {
        await request(app)
            .post(RouterPath.auth + '/login')
            .send({
                loginOrEmail: "loginnnnnn",
                password: "password"
            })
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        await request(app)
            .post(RouterPath.auth + '/login')
            .send({
                loginOrEmail: "login",
                password: "passworddddd"
            })
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

    });

    it('should response 400 because wrong login/email or password', async () => {
        await request(app)
            .post(RouterPath.auth + '/login')
            .send({
                loginOrEmail: 1234,
                password: "password"
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post(RouterPath.auth + '/login')
            .send({
                loginOrEmail: "login",
                password: 12345
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

    });

    it('should response 204 because all data is true', async () => {
        await request(app)
            .post(RouterPath.auth + '/login')
            .send({
                loginOrEmail: 'login',
                password: 'password'
            })
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    });
})