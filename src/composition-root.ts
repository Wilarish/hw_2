import "reflect-metadata"
import {BlogsRepository} from "./repositories/blogs-rep";
import {CommentsRepository} from "./repositories/comments-rep";
import {DevicesRepository} from "./repositories/devices-rep";
import {LikesRepository} from "./repositories/likes-rep";
import {PostsRepository} from "./repositories/posts-rep";
import {UsersRepository} from "./repositories/users-rep";
import {QueryBlogsRepository} from "./repositories/query/query-blogs-rep";
import {QueryCommentsRepository} from "./repositories/query/query-comments-rep";
import {QueryDevicesRepository} from "./repositories/query/query-devices-rep";
import {QueryPostsRepository} from "./repositories/query/query-posts-rep";
import {QueryUsersRepository} from "./repositories/query/query-users-rep";
import {AuthServices} from "./application/auth-services";
import {EmailServices} from "./application/email-services";
import {DeviceServices} from "./application/device-services";
import {BlogsServices} from "./application/blogs-services";
import {CommentsServices} from "./application/comments-services";
import {LikesServices} from "./application/likes-services";
import {PostsServices} from "./application/posts-services";
import {UsersServices} from "./application/users-services";
import {AuthControllerInstance} from "./routes/classes-routers/auth-class";
import {CommentsControllerInstance} from "./routes/classes-routers/comments-class";
import {PostsControllerInstance} from "./routes/classes-routers/posts-class";
import {SecurityControllerInstance} from "./routes/classes-routers/security-class";
import {UsersControllerInstance} from "./routes/classes-routers/users-class";
import {Container} from "inversify";

export const container = new Container()

// controllers
container.bind(AuthControllerInstance).to(AuthControllerInstance)
container.bind(CommentsControllerInstance).to(CommentsControllerInstance)
container.bind(PostsControllerInstance).to(PostsControllerInstance)
container.bind(SecurityControllerInstance).to(SecurityControllerInstance)
container.bind(UsersControllerInstance).to(UsersControllerInstance)


//services
container.bind(AuthServices).to(AuthServices)
container.bind(UsersServices).to(UsersServices)
container.bind(DeviceServices).to(DeviceServices)
container.bind(EmailServices).to(EmailServices)
container.bind(BlogsServices).to(BlogsServices)
container.bind(CommentsServices).to(CommentsServices)
container.bind(LikesServices).to(LikesServices)
container.bind(PostsServices).to(PostsServices)


//repositories
container.bind(UsersRepository).to(UsersRepository)
container.bind(DevicesRepository).to(DevicesRepository)
container.bind(BlogsRepository).to(BlogsRepository)
container.bind(CommentsRepository).to(CommentsRepository)
container.bind(LikesRepository).to(LikesRepository)
container.bind(PostsRepository).to(PostsRepository)

//query repositories
container.bind(QueryBlogsRepository).to(QueryBlogsRepository)
container.bind(QueryCommentsRepository).to(QueryCommentsRepository)
container.bind(QueryDevicesRepository).to(QueryDevicesRepository)
container.bind(QueryPostsRepository).to(QueryPostsRepository)
container.bind(QueryUsersRepository).to(QueryUsersRepository)




