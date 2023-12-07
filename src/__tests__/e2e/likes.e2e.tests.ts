import {InitApp, RouterPath} from "../../settings";
import {RunDb} from "../../data/DB";
import request from "supertest";
import {HTTP_STATUSES} from "../../data/HTTP_STATUSES";
import {createBlogUtils} from "./utils/createBlog.utils";
import {PostsCreateUpdate, PostsMainType} from "../../types/posts-types";
import {BlogsMainType} from "../../types/blogs-types";
import {CommentsMainType} from "../../types/comments-types";
import {UsersCreate} from "../../types/users-types";
import {UsersRepository} from "../../repositories/users-rep";


describe('/likes', () => {

    let createdBlog: BlogsMainType;
    let createdPost: PostsMainType;
    let createdComment: CommentsMainType;
    let password_User: string;
    let createdUser: UsersRepository;
    let token_User: string;
    let token_User2: string;
    let token_User3: string;
    let token_User4: string;


    const app = InitApp()

    beforeAll(async () => {
        await RunDb()
    })

    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(HTTP_STATUSES.NO_CONTENT_204)

    })

    it('should create users with correct data', async () => {


        const data: UsersCreate = {
            login: 'login',
            email: 'email@gmail.com',
            password: 'password',
        }
        const data2: UsersCreate = {
            login: 'login2',
            email: 'email2@gmail.com',
            password: 'password',
        }
        const data3: UsersCreate = {
            login: 'login3',
            email: 'email3@gmail.com',
            password: 'password',
        }
        const data4: UsersCreate = {
            login: 'login4',
            email: 'email4@gmail.com',
            password: 'password',
        }
        password_User = data.password

        await request(app)
            .post(RouterPath.users)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data4)
            .expect(HTTP_STATUSES.CREATED_201)

        await request(app)
            .post(RouterPath.users)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data2)
            .expect(HTTP_STATUSES.CREATED_201)

        await request(app)
            .post(RouterPath.users)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data3)
            .expect(HTTP_STATUSES.CREATED_201)

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
    })
    it('should login with email correct', async () => {
        const response = await request(app)
            .post(`${RouterPath.auth}/login`)
            .set('x-forwarded-for', "12345")
            .set('user-agent', '12345')
            .send({
                loginOrEmail: 'email@gmail.com',
                password: 'password'
            })
            .expect(HTTP_STATUSES.OK_200)

        const response2 = await request(app)
            .post(`${RouterPath.auth}/login`)
            .set('x-forwarded-for', "12345")
            .set('user-agent', '12345')
            .send({
                loginOrEmail: 'email2@gmail.com',
                password: 'password'
            })
            .expect(HTTP_STATUSES.OK_200)

        const response3 = await request(app)
            .post(`${RouterPath.auth}/login`)
            .set('x-forwarded-for', "12345")
            .set('user-agent', '12345')
            .send({
                loginOrEmail: 'email3@gmail.com',
                password: 'password'
            })
            .expect(HTTP_STATUSES.OK_200)

        const response4 = await request(app)
            .post(`${RouterPath.auth}/login`)
            .set('x-forwarded-for', "12345")
            .set('user-agent', '12345')
            .send({
                loginOrEmail: 'email4@gmail.com',
                password: 'password'
            })
            .expect(HTTP_STATUSES.OK_200)

        token_User = response.body.accessToken
        token_User2 = response2.body.accessToken
        token_User3 = response3.body.accessToken
        token_User4 = response4.body.accessToken

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
            createdAt: expect.any(String),
            extendedLikesInfo: expect.any(Object)
        })

        createdPost = response.body;

        await request(app)
            .get(`${RouterPath.posts}/${createdPost.id}`)
            .expect(HTTP_STATUSES.OK_200, createdPost)

    });
    it('should create comment for post and give 3 likes', async () => {
        const response = await request(app)
            .post(`${RouterPath.posts}/${createdPost.id}/comments`)
            .set("Authorization", `Bearer ${token_User}`)
            .send({content: 'qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiop'})
            .expect(HTTP_STATUSES.CREATED_201)

        createdComment = response.body

    });
    it('should like comment', async () => {

        await request(app)
            .put(`${RouterPath.comments}/${createdComment.id}/like-status`)
            .set("Authorization", `Bearer ${token_User}`)
            .send({likeStatus: "Like"})
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .put(`${RouterPath.comments}/${createdComment.id}/like-status`)
            .set("Authorization", `Bearer ${token_User2}`)
            .send({likeStatus: "Like"})
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .put(`${RouterPath.comments}/${createdComment.id}/like-status`)
            .set("Authorization", `Bearer ${token_User3}`)
            .send({likeStatus: "Like"})
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        // const  delay = new Promise<void>((resolve)=>{setTimeout(()=>{resolve()},5000)})
        // await delay

        const res = await request(app)
            .get(`${RouterPath.comments}/${createdComment.id}`)
            .set("Authorization", `Bearer ${token_User}`)

        expect(res.body.likesInfo.likesCount).toEqual(3)


    }, 15000);
    it('should change likes to dislikes', async () => {
        await request(app)
            .put(`${RouterPath.comments}/${createdComment.id}/like-status`)
            .set("Authorization", `Bearer ${token_User}`)
            .send({likeStatus: "Dislike"})
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .put(`${RouterPath.comments}/${createdComment.id}/like-status`)
            .set("Authorization", `Bearer ${token_User2}`)
            .send({likeStatus: "Dislike"})
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .put(`${RouterPath.comments}/${createdComment.id}/like-status`)
            .set("Authorization", `Bearer ${token_User3}`)
            .send({likeStatus: "Dislike"})
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        // const  delay = new Promise<void>((resolve)=>{setTimeout(()=>{resolve()},10000)})
        // await delay

        const res = await request(app)
            .get(`${RouterPath.comments}/${createdComment.id}`)
            .set("Authorization", `Bearer ${token_User}`)

        expect(res.body.likesInfo.dislikesCount).toEqual(3)


        const response = await request(app)
            .get(`${RouterPath.posts}/${createdPost.id}/comments`)
            .set("Authorization", `Bearer ${token_User}`)

        console.log(response.body.items)
    }, 20000);

    it('should like post', async () => {

        await request(app)
            .put(`${RouterPath.posts}/${createdPost.id}/like-status`)
            .set("Authorization", `Bearer ${token_User}`)
            .send({likeStatus: "Like"})
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        const res1 = await request(app)
            .get(`${RouterPath.posts}/${createdPost.id}`)
            .set("Authorization", `Bearer ${token_User}`)

        expect(res1.body.extendedLikesInfo.newestLikes.length).toEqual(1)
        expect(res1.body.extendedLikesInfo.newestLikes[0].login).toEqual('login')

        //--------------------------------------------------

        await request(app)
            .put(`${RouterPath.posts}/${createdPost.id}/like-status`)
            .set("Authorization", `Bearer ${token_User2}`)
            .send({likeStatus: "Like"})
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        const res2 = await request(app)
            .get(`${RouterPath.posts}/${createdPost.id}`)
            .set("Authorization", `Bearer ${token_User}`)

        console.log(res2.body.extendedLikesInfo.newestLikes)

        expect(res2.body.extendedLikesInfo.newestLikes.length).toEqual(2)
        expect(res2.body.extendedLikesInfo.newestLikes[0].login).toEqual('login')
        expect(res2.body.extendedLikesInfo.newestLikes[1].login).toEqual('login2')

        //--------------------------------------------------

        await request(app)
            .put(`${RouterPath.posts}/${createdPost.id}/like-status`)
            .set("Authorization", `Bearer ${token_User3}`)
            .send({likeStatus: "Like"})
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        const res3 = await request(app)
            .get(`${RouterPath.posts}/${createdPost.id}`)
            .set("Authorization", `Bearer ${token_User}`)

        expect(res3.body.extendedLikesInfo.newestLikes.length).toEqual(3)
        expect(res3.body.extendedLikesInfo.newestLikes[0].login).toEqual('login')
        expect(res3.body.extendedLikesInfo.newestLikes[1].login).toEqual('login2')
        expect(res3.body.extendedLikesInfo.newestLikes[2].login).toEqual('login3')

        //--------------------------------------------------

        await request(app)
            .put(`${RouterPath.posts}/${createdPost.id}/like-status`)
            .set("Authorization", `Bearer ${token_User4}`)
            .send({likeStatus: "Like"})
            .expect(HTTP_STATUSES.NO_CONTENT_204)


        const res = await request(app)
            .get(`${RouterPath.posts}/${createdPost.id}`)
            .set("Authorization", `Bearer ${token_User}`)

        expect(res.body.extendedLikesInfo.likesCount).toEqual(4)
        expect(res.body.extendedLikesInfo.newestLikes[0].login).toEqual('login')
        expect(res.body.extendedLikesInfo.newestLikes[1].login).toEqual('login2')
        expect(res.body.extendedLikesInfo.newestLikes[2].login).toEqual('login3')

        //console.log(res.body.extendedLikesInfo)


    }, 15000);
    it('should saving last 3 rates', async () => {
        await request(app)
            .put(`${RouterPath.posts}/${createdPost.id}/like-status`)
            .set("Authorization", `Bearer ${token_User2}`)
            .send({likeStatus: "Dislike"})
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        const res = await request(app)
            .get(`${RouterPath.posts}/${createdPost.id}`)
            .set("Authorization", `Bearer ${token_User}`)

        expect(res.body.extendedLikesInfo.dislikesCount).toEqual(1)
        expect(res.body.extendedLikesInfo.newestLikes[0].login).toEqual('login')
        expect(res.body.extendedLikesInfo.newestLikes[1].login).toEqual('login3')
        expect(res.body.extendedLikesInfo.newestLikes[2].login).toEqual('login4')

        console.log(res.body.extendedLikesInfo)

    });
    it('should return post for blog', async () => {
        const res = await request(app)
            .get(`${RouterPath.blogs}/${createdBlog.id}/posts`)
            .set("Authorization", `Bearer ${token_User4}`)


        console.log(res.body.items[0].extendedLikesInfo)

    });
})