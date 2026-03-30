import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, Types } from 'mongoose'
import { User } from '../users/user.schema'
import { LikeParentType } from '../likes/like.schema'

export type PostDocument = HydratedDocument<Post>

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
    },
    toObject: { virtuals: true },
})
export class Post {
    @Prop({ required: true, trim: true })
    title: string

    @Prop({ required: true })
    text: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
    author: User

    @Prop({ default: null })
    deletedAt: Date | null
}

export const PostSchema = SchemaFactory.createForClass(Post)

PostSchema.index({ createdAt: -1 })
PostSchema.index({ deletedAt: 1 })

PostSchema.virtual('likesCount', {
    ref: 'Like',
    localField: '_id',
    foreignField: 'parentId',
    count: true,
    match: { parentType: LikeParentType.POST },
})
