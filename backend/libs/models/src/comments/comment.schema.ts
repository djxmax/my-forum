import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose'
import mongoose, { Document, HydratedDocument, Types } from 'mongoose'
import { User } from '../users/user.schema'
import { Post } from '../posts/post.schema'
import { LikeParentType } from '../likes/like.schema'

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
    post: Post

    @Prop({ default: null })
    deletedAt: Date | null

    @Virtual()
    likeCount: number
}

export const CommentSchema = SchemaFactory.createForClass(Comment)

CommentSchema.index({ createdAt: -1 })
CommentSchema.index({ deletedAt: 1 })

CommentSchema.virtual('likesCount', {
    ref: 'Like',
    localField: '_id',
    foreignField: 'parentId',
    count: true,
    match: { parentType: LikeParentType.COMMENT },
})
