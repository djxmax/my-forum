import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document, HydratedDocument, Types } from 'mongoose'
import { User } from '../users/user.schema'
import { Post } from '../posts/post.schema'

export type CommentDocument = HydratedDocument<Comment>

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
    },
})
export class Comment {
    @Prop({ required: true })
    text: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
    author: User

    @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
    post: Post // rattachement au post parent

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    likes: Types.ObjectId[] // tableau des userId qui ont liké
}

export const CommentSchema = SchemaFactory.createForClass(Comment)

CommentSchema.index({ createdAt: -1 })
