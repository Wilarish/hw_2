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
import {BlogsControllerInstance} from "./routes/classes-routers/blogs-class";
import {CommentsControllerInstance} from "./routes/classes-routers/comments-class";
import {PostsControllerInstance} from "./routes/classes-routers/posts-class";
import {SecurityControllerInstance} from "./routes/classes-routers/security-class";
import {UsersControllerInstance} from "./routes/classes-routers/users-class";


const blogsRepository: BlogsRepository = new BlogsRepository()
const commentsRepository: CommentsRepository = new CommentsRepository()
export const devicesRepository: DevicesRepository = new DevicesRepository()
const likesRepository: LikesRepository = new LikesRepository()
const usersRepository: UsersRepository = new UsersRepository()
export const postsRepository: PostsRepository = new PostsRepository(blogsRepository)

const queryBlogsRepository: QueryBlogsRepository = new QueryBlogsRepository()
const queryCommentsRepository: QueryCommentsRepository = new QueryCommentsRepository(postsRepository)
const queryDevicesRepository: QueryDevicesRepository = new QueryDevicesRepository()
export const queryPostsRepository: QueryPostsRepository = new QueryPostsRepository(likesRepository)
const queryUsersRepository: QueryUsersRepository = new QueryUsersRepository()


const emailServices: EmailServices = new EmailServices()
const deviceServices: DeviceServices = new DeviceServices(devicesRepository)
const authServices: AuthServices = new AuthServices(usersRepository, emailServices, deviceServices)
const blogsServices: BlogsServices = new BlogsServices(blogsRepository)
const commentsServices: CommentsServices = new CommentsServices(commentsRepository, usersRepository, postsRepository)
const likesServices: LikesServices = new LikesServices(likesRepository, commentsRepository, postsRepository, usersRepository)
const postsServices: PostsServices = new PostsServices(blogsRepository, postsRepository)
const usersServices: UsersServices = new UsersServices(usersRepository)


export const authController: AuthControllerInstance = new AuthControllerInstance(authServices, usersServices)
export const blogsController: BlogsControllerInstance = new BlogsControllerInstance(blogsRepository, queryBlogsRepository, blogsServices, queryPostsRepository, postsServices)
export const commentsController:CommentsControllerInstance = new CommentsControllerInstance(commentsRepository, queryCommentsRepository,commentsServices,likesServices)
export const postsController: PostsControllerInstance = new PostsControllerInstance(postsRepository,postsServices,queryPostsRepository,queryCommentsRepository,commentsServices,likesServices)
export const securityController: SecurityControllerInstance = new SecurityControllerInstance(devicesRepository, queryDevicesRepository, deviceServices)
export const usersController: UsersControllerInstance = new UsersControllerInstance(usersRepository, usersServices, queryUsersRepository)


