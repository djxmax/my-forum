import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { PostController } from '../controllers/post.controller'
import { PostService } from '../services/post.service'
import { Post, PostSchema } from '@app/models/posts/post.schema'
import { Comment, CommentSchema } from '@app/models/comments/comment.schema'
import { AuthModule } from '@app/auth'
import { Like, LikeSchema } from '@app/models/likes/like.schema'
import { LikeModule } from './like.module'

@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([
            { name: Post.name, schema: PostSchema },
            { name: Comment.name, schema: CommentSchema },
            { name: Like.name, schema: LikeSchema },
        ]),
        LikeModule,
    ],
    controllers: [PostController],
    providers: [PostService],
})
export class PostModule {}
