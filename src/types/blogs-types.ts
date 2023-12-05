import {ObjectId} from "mongodb";


export class BlogsMainType{
    constructor(public id: ObjectId,
                public name: string,
                public description: string,
                public websiteUrl: string,
                public createdAt: string,
                public isMembership: boolean) {
    }
}

export class BlogsViewType{
    constructor(public id: ObjectId,
                public name: string,
                public description: string,
                public websiteUrl: string,
                public createdAt: string,
                public isMembership: boolean) {
    }
}


export class BlogsCreateUpdate  {
    constructor(public name: string,
                public description: string,
                public websiteUrl: string){

    }
}
