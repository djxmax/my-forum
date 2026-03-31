import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, Types } from 'mongoose'
import { User } from '../users/user.schema'
import { Post } from '../posts/post.schema'
import { LikeParentType } from '../likes/like.schema'
import { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
const MongooseDelete = require('mongoose-delete')

export type CommentDocument = HydratedDocument<Comment> & SoftDeleteDocument
export type CommentModel = SoftDeleteModel<CommentDocument>

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
    },
    toObject: { virtuals: true },
})
export class Comment {
    @Prop({ required: true })
    text: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
    author: User

    @Prop({ type: Types.ObjectId, ref: Post.name, required: true })
    post: Post

    @Virtual()
    likesCount: number
}

export const CommentSchema = SchemaFactory.createForClass(Comment)

CommentSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: true })

CommentSchema.index({ createdAt: -1 })

CommentSchema.virtual('likesCount', {
    ref: 'Like',
    localField: '_id',
    foreignField: 'parentId',
    count: true,
    match: { parentType: LikeParentType.COMMENT },
})
