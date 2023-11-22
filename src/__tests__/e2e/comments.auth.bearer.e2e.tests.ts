import request from "supertest";
import {UsersCreate, UsersMainType} from "../../types/users-types";
import {app, RouterPath} from "../../settings";
import {HTTP_STATUSES} from "../../data/HTTP_STATUSES";
import {createBlogUtils} from "./utils/createBlog.utils";
import {BlogsMainType} from "../../types/blogs-types";
import {PostsCreateUpdate, PostsMainType} from "../../types/posts-types";
import {CommentsMainType} from "../../types/comments-types";
import {RunDb} from "../../data/DB";

describe('/authBearer', () => {


    let createdUser: UsersMainType;
    let token_User: string
    let password_User: string
    let createdBlog: BlogsMainType
    let createdPost: PostsMainType
    let createdComment: CommentsMainType

    beforeAll(async () => {
        await RunDb()
    })

    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(HTTP_STATUSES.NO_CONTENT_204)

    })

    it('should create user with correct data', async () => {


        const data: UsersCreate = {
            login: 'login',
            email: 'email@gmail.com',
            password: 'password',
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
            email: 'email@gmail.com',
            createdAt: expect.any(String)

        })

        createdUser = response.body;

        const res = await request(app)
            .get(RouterPath.users)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_STATUSES.OK_200)

        expect(res.body.items).toEqual([createdUser])
    })
    it('shouldn`t login with incorrect data', async () => {
        await request(app)                              //incorrect EmailOrLogin
            .post(`${RouterPath.auth}/login`)
            .send({
                loginOrEmail: createdUser.login + "qw",
                password: password_User
            })
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)


        await request(app)                              //incorrect Password
            .post(`${RouterPath.auth}/login`)
            .send({
                loginOrEmail: createdUser.login,
                password: password_User + "qw"
            })
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)


        await request(app)                              //not String EmailOrLogin
            .post(`${RouterPath.auth}/login`)
            .send({
                loginOrEmail: [1, 2, 3, 4],
                password: password_User
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)                              //not String Password
            .post(`${RouterPath.auth}/login`)
            .send({
                loginOrEmail: createdUser.login,
                password: [1, 2, 3, 4]
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)


    });
    it('should login with email correct', async () => {
        const response = await request(app)
            .post(`${RouterPath.auth}/login`)
            .send({
                loginOrEmail: createdUser.email,
                password: password_User
            })
            .expect(HTTP_STATUSES.OK_200)


    });
    it('should login with login correct', async () => {
        const response = await request(app)
            .post(`${RouterPath.auth}/login`)
            .send({
                loginOrEmail: createdUser.login,
                password: 'password'
            })
            .expect(HTTP_STATUSES.OK_200)

        token_User = response.body.accessToken

    });
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
            .expect(HTTP_STATUSES.CREATED_201)

        expect(response.body).toEqual({
            id: expect.any(String),
            ...data,
            blogName: createdBlog.name,
            createdAt: expect.any(String)
        })

        createdPost = response.body;

        await request(app)
            .get(`${RouterPath.posts}/${createdPost.id}`)
            .expect(HTTP_STATUSES.OK_200, createdPost)

    });
    it('should create comment for post with using jwt', async () => {
        const response = await request(app)
            .post(`${RouterPath.posts}/${createdPost.id}/comments`)
            .set("Authorization", `Bearer ${token_User}`)
            .send({content: 'qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiop'})
            .expect(HTTP_STATUSES.CREATED_201)

        createdComment = response.body


    });
    it('shouldn`t create comment for unexpected/incorrect data post with using jwt', async () => {
        const response = await request(app)
            .post(`${RouterPath.posts}/yuibiyubu/comments`)
            .set("Authorization", `Bearer ${token_User}`)
            .send({content: 'qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiop'})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(response.body).toEqual(
            {errorsMessages: [{message: expect.any(String), field: 'id'}]}
        )

        await request(app)
            .post(`${RouterPath.posts}/111122223333444455556666/comments`)
            .set("Authorization", `Bearer ${token_User}`)
            .send({content: 'qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiop'})
            .expect(HTTP_STATUSES.NOT_FOUND_404)


    });
    it('shouldn`t update comment which is not yours', async () => {

        const data: UsersCreate = {
            login: 'loginnnn',
            password: 'passwordddd',
            email: 'emaillll@gmail.com'
        }


        await request(app)
            .post(RouterPath.users)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        const token = await request(app)
            .post(`${RouterPath.auth}/login`)
            .send({loginOrEmail: 'loginnnn', password: 'passwordddd'})
            .expect(HTTP_STATUSES.OK_200)


        const comment = await request(app)
            .post(`${RouterPath.posts}/${createdPost.id}/comments`)
            .set("Authorization", `Bearer ${token.body.accessToken}`)
            .send({content: 'qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiop'})
            .expect(HTTP_STATUSES.CREATED_201)

        await request(app)
            .put(`${RouterPath.comments}/${comment.body.id}`)
            .set("Authorization", `Bearer ${token_User}`)
            .send({content: 'qwertyuiopasdfghjkl;zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz'})
            .expect(HTTP_STATUSES.FORBIDDEN_403)
    });
    it('should update comment for post with using jwt', async () => {
        const response = await request(app)
            .put(`${RouterPath.comments}/${createdComment.id}`)
            .set("Authorization", `Bearer ${token_User}`)
            .send({content: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww'})
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPath.comments}/${createdComment.id}`)
            .expect({...createdComment, content: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww'})

    });
    it('shouldn`t update comment for post with incorrect data by using jwt', async () => {
        const response = await request(app)
            .put(`${RouterPath.comments}/${createdComment.id}`)
            .set("Authorization", `Bearer ${token_User}`)
            .send({content: 123})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(response.body).toEqual(
            {errorsMessages: [{message: expect.any(String), field: 'content'}]}
        )

        await request(app)
            .get(`${RouterPath.comments}/${createdComment.id}`)
            .expect({...createdComment, content: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww'})

    });
    it('shouldn`t delete unexpected comment or incorrect ObjectId ', async () => {
        const response = await request(app)
            .delete(`${RouterPath.comments}/${createdComment.id}1234`)
            .set("Authorization", `Bearer ${token_User}`)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(response.body).toEqual({
            errorsMessages: [{message: expect.any(String), field: 'id'}]
        })

        await request(app)
            .delete(`${RouterPath.comments}/111122223333444455556666`)
            .set("Authorization", `Bearer ${token_User}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    });

    it('should delete comment correct', async () => {
        await request(app)
            .delete(`${RouterPath.comments}/${createdComment.id}`)
            .set("Authorization", `Bearer ${token_User}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPath.comments}/${createdComment.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    });
})