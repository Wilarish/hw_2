import {UsersCreate, UsersMainType} from "../../types/users-types";
import {HTTP_STATUSES} from "../../data/HTTP_STATUSES";
import request from "supertest";
import {app, RouterPath} from "../../settings";
import {usersRepository} from "../../repositories/users-rep";

describe('/auth', () => {
    let createdUser: UsersMainType;
    let createdRegUser: UsersMainType
    let regUserFromDb:UsersMainType|null
    let token_User: string
    let password_User: string


    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(HTTP_STATUSES.NO_CONTENT_204)

    })

    it('should create user with correct data', async () => {


        const data: UsersCreate = {
            login: 'login',
            password: 'password',
            email: 'email@gmail.com'
        }
        password_User = data.password


        const response = await request(app)
            .post(RouterPath.users)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)


        expect(response.body).toEqual({
            id: expect.any(String),
            login: 'login',
            email: expect.any(String),
            createdAt: expect.any(String)

        })

        createdUser = response.body;

        const res = await request(app)
            .get(RouterPath.users)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_STATUSES.OK_200)

        expect(res.body.items).toEqual([createdUser])
    })
    it('should create user with registration', async () => {
        await request(app)
            .post(`${RouterPath.auth}/registration`)
            .send({
                login: 'login1234',
                password: 'password12345',
                email: 'tararammmm2004@gmail.com',

            })
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        regUserFromDb = await usersRepository.findUserByLoginOrEmail('login1234')



        const response = await request(app)
            .get(`${RouterPath.users}/${regUserFromDb?.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_STATUSES.OK_200)

        expect(response.body).toEqual(  {
            id:regUserFromDb?.id.toString(),
            login: regUserFromDb?.login,
            email: regUserFromDb?.email,
            createdAt: regUserFromDb?.createdAt,
        })
    });
    it('shouldn`t create user with registration and incorrect data', async () => {
        const errData =  await request(app)
            .post(`${RouterPath.auth}/registration`)
            .send({
                login: 'login1234',
                password: 123,
                email: 'tararammmm2004@gmail.com',

            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(errData.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'email'
                },
                {
                    message: expect.any(String),
                    field: 'login'
                },{
                    message: expect.any(String),
                    field: 'password'
                },
            ]
        })
    })
    it('should resend email with new code correct', async () => {
        await request(app)
            .post(`${RouterPath.auth}/registration-email-resending`)
            .send({email: regUserFromDb?.email})
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        let updatedUser = await usersRepository.findUserByLoginOrEmail('login1234')

        expect(regUserFromDb?.emailConfirmation.confirmationCode).not.toEqual(updatedUser?.emailConfirmation.confirmationCode)

        regUserFromDb!.emailConfirmation.confirmationCode = updatedUser!.emailConfirmation.confirmationCode
    });

    it('shouldn`t resend email with new code correct', async () => {
        await request(app)
            .post(`${RouterPath.auth}/registration-email-resending`)
            .send({email: 123})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

    });

    it('shouldn`n confirm registration correct', async () => {
        const response = await request(app)
            .post(`${RouterPath.auth}/registration-confirmation`)
            .send({code: regUserFromDb!.emailConfirmation.confirmationCode+'jjiopjopi'})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
    });

    it('should confirm registration correct', async () => {
        await request(app)
            .post(`${RouterPath.auth}/registration-confirmation`)
            .send({code: regUserFromDb!.emailConfirmation.confirmationCode})
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    });


})