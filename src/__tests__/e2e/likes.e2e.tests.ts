import {InitApp} from "../../settings";
import {RunDb} from "../../data/DB";
import request from "supertest";
import {HTTP_STATUSES} from "../../data/HTTP_STATUSES";

describe('/login', () => {

    const app = InitApp()

    beforeAll(async () => {
        await RunDb()
    })

    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(HTTP_STATUSES.NO_CONTENT_204)

    })

})