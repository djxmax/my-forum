import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from '@app/auth/auth.module'
import { PostModule } from './post.module'
import { CommentModule } from './comment.module'
import { ConfigModule } from '@nestjs/config'

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), MongooseModule.forRoot(process.env.MONGODB_URI), AuthModule, PostModule, CommentModule],
})
export class AppModule {}
