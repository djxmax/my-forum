import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { User } from '../users/user.schema'

export type PostDocument = Post & Document

@Schema({ timestamps: true,
    toJSON: {
    virtuals: true,
    transform: (_, ret: Record<string, unknown>) => {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
    },
  }, })
export class Post {
    @Prop({ required: true, trim: true })
    title: string

    @Prop({ required: true })
    text: string

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    author: User

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    likes: Types.ObjectId[] // tableau des userId qui ont liké
}

export const PostSchema = SchemaFactory.createForClass(Post)
