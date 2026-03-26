import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { PostController } from './controllers/post.controller'
import { PostService } from './services/post.service'
import { Post, PostSchema } from '@app/models/posts/post.schema'
import { Comment, CommentSchema } from '@app/models/comments/comment.schema'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Post.name, schema: PostSchema },
            { name: Comment.name, schema: CommentSchema }, // nécessaire pour la suppression en cascade
        ]),
    ],
    controllers: [PostController],
    providers: [PostService],
})
export class PostModule {}
