import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CommentController } from './controllers/comment.controller'
import { CommentService } from './services/comment.service'
import { Comment, CommentSchema } from '@app/models/comments/comment.schema'
import { Post, PostSchema } from '@app/models/posts/post.schema'
import { AuthModule } from '@app/auth'

@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([
            { name: Comment.name, schema: CommentSchema },
            { name: Post.name, schema: PostSchema },
        ]),
    ],
    controllers: [CommentController],
    providers: [CommentService],
})
export class CommentModule {}
