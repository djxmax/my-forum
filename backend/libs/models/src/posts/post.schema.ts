import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { User } from '../users/user.schema'

export type PostDocument = Post & Document

@Schema({ timestamps: true })
export class Post {
    @Prop({ required: true, trim: true })
    title: string

    @Prop({ required: true })
    content: string

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    author: User

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    likes: Types.ObjectId[] // tableau des userId qui ont liké
}

export const PostSchema = SchemaFactory.createForClass(Post)
