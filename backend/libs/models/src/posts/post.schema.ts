import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { User } from '../users/user.schema'
import { LikeParentType } from '../likes/like.schema'
import { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
const MongooseDelete = require('mongoose-delete')

export type PostDocument = HydratedDocument<Post> & SoftDeleteDocument
export type PostModel = SoftDeleteModel<PostDocument>

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

    @Virtual()
    likesCount: number
}

export const PostSchema = SchemaFactory.createForClass(Post)

PostSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: true })

PostSchema.index({ createdAt: -1 })

PostSchema.virtual('likesCount', {
    ref: 'Like',
    localField: '_id',
    foreignField: 'parentId',
    count: true,
    match: { parentType: LikeParentType.POST },
})
