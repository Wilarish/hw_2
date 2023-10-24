export type CommentsMainType= {
    "id": string,
    "content": string,
    "commentatorInfo": commentatorInfo,
    "createdAt": string,
    "postId":string
}
type commentatorInfo = {
    "userId": string,
    "userLogin": string
}