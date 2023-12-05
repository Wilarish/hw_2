import {ObjectId} from "mongodb";


export class UsersViewType  {
    constructor(public id: ObjectId,
                public login: string,
                public email: string,
                public createdAt: string) {
    }

}

export class UsersMainType  {
    constructor(public id: ObjectId,
                public login: string,
                public email: string,
                public passwordSalt: string,
                public passwordHash: string,
                public createdAt: string,
                public emailConfirmation: ConfirmationEmailType) {
    }

}

export class ConfirmationEmailType  {
    constructor(public confirmationCode: string,
                public expirationDate: Date | string,
                public isConfirmed: boolean) {
    }
}

export class UsersCreate {
    constructor(public login: string,
                public password: string,
                public email: string) {
    }
}
