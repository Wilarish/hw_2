import {DBType} from "../types/DB-type";

export const DB:DBType = {
    blogs: [{
        id: "any_id",
        name: "any_name",
        description: "any_description",
        websiteUrl: "any_websiteUrl"
    }],
    posts: [{
        id: 'string',
        title: 'string',
        shortDescription: 'string',
        content: 'string',
        blogId: 'any_id',
        blogName: 'any_name'
    }]
}