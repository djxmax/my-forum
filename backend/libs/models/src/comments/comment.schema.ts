import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { User } from '../users/user.schema'
import { Post } from '../posts/post.schema'

export type CommentDocument = Comment & Document

@Schema({ timestamps: true })
export class Comment {
    @Prop({ required: true })
    content: string

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    author: User

    @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
    post: Post // rattachement au post parent

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    likes: Types.ObjectId[] // tableau des userId qui ont liké
}

export const CommentSchema = SchemaFactory.createForClass(Comment)
