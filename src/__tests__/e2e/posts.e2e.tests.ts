import request from "supertest";
import {InitApp, RouterPath} from "../../settings";
import {HTTP_STATUSES} from "../../data/HTTP_STATUSES";
import {PostsCreateUpdate, PostsMainType} from "../../types/posts-types";
import {BlogsCreateUpdate, BlogsMainType} from "../../types/blogs-types";
import {createBlogUtils} from "./utils/createBlog.utils";
import {Paginated} from "../../types/pagination.type";
import {RunDb} from "../../data/DB";
import {QueryPostsRepository} from "../../repositories/query/query-posts-rep";
import {container} from "../../composition-root";



describe('/posts', () => {

    const app = InitApp()
    const queryPostsRepository =  container.resolve(QueryPostsRepository)

    let createdPost: PostsMainType;
    let createdPost_2: PostsMainType;
    let createdBlog: BlogsMainType;

    beforeAll(async () => {
        await RunDb()
    })

    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(HTTP_STATUSES.NO_CONTENT_204)

    })

    let expectedRes: Paginated<PostsMainType> = {
        pagesCount: expect.any(Number),
        page: expect.any(Number),
        pageSize: expect.any(Number),
        totalCount: expect.any(Number),
        items: expect.any(Array)
    }


    it('should return 200 and empty array', async () => {
        const res = await request(app)
            .get(RouterPath.posts)
            .expect(HTTP_STATUSES.OK_200)
        expect(res.body).toEqual(expectedRes)

    })


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
            .expect(HTTP_STATUSES.CREATED_201)

        expect(response.body).toEqual({
            id: expect.any(String),
            ...data,
            blogName: createdBlog.name,
            createdAt: expect.any(String),
            extendedLikesInfo: expect.any(Object)
        })

        createdPost_2 = response.body;


        const res = await request(app)
            .get(RouterPath.posts)
            .expect(HTTP_STATUSES.OK_200)

        expect(res.body).toEqual({...expectedRes, totalCount: 2})
        expect(res.body.items).toEqual([createdPost_2, createdPost])

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
            .send({...data, title: 123})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
    });
    it('should update "blogName" when field "name" in blog has been updated', async () => {

        const data: BlogsCreateUpdate = {
            name: 'change',
            description: 'change',
            websiteUrl: 'https://www.change.com'
        }
        await request(app)
            .put(`${RouterPath.blogs}/${createdBlog.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204)


        const result = await request(app)
            .get(`${RouterPath.blogs}/${createdBlog.id}`)
            .expect(HTTP_STATUSES.OK_200)


        let updateDataPostFromDb = await queryPostsRepository.queryFindPostById(createdPost.id.toString(), undefined)

        if (updateDataPostFromDb) createdPost = updateDataPostFromDb


        await request(app)
            .get(`${RouterPath.posts}/${createdPost.id}`)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdPost,
                id: createdPost.id.toString(),
                blogId: createdPost.blogId.toString(),
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                    newestLikes: []
                }
            })


        await request(app)
            .get(`${RouterPath.posts}/${createdPost_2.id}`)
            .expect(HTTP_STATUSES.OK_200, {...createdPost_2, blogName: "change"})

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
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

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
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

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
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

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
            .expect(HTTP_STATUSES.OK_200, {
                ...createdPost,
                id: createdPost.id.toString(),
                blogId: createdPost.blogId.toString(),
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                    newestLikes: []
                }
            })
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
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

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
            .expect(HTTP_STATUSES.NO_CONTENT_204)


        const result = await request(app)
            .get(`${RouterPath.posts}/${createdPost.id}`)
            .expect(HTTP_STATUSES.OK_200)

        expect(result.body).toEqual({
            ...createdPost,
            ...data,
            id: createdPost.id.toString(), blogId: createdPost.blogId.toString()
        })
    });
    it('should delete post', async () => {

        await request(app)
            .delete(`${RouterPath.posts}/${createdPost.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPath.posts}/${createdPost.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

    });
    it('shouldn`t delete unexpected post', async () => {


        await request(app)
            .delete(`${RouterPath.posts}/${100}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPath.posts}/${100}`)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

    });


})