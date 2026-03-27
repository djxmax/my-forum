import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from '@app/auth/auth.module'
import { PostModule } from './modules/post.module'
import { CommentModule } from './modules/comment.module'
import { ConfigModule } from '@nestjs/config'
import { AnalyticsModule } from './modules/analytics.module'

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGODB_URI),
        AuthModule,
        PostModule,
        CommentModule,
        AnalyticsModule,
    ],
})
export class AppModule {}
