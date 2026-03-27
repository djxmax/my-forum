import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, Types } from 'mongoose'
import { User } from '../users/user.schema'

export type PostDocument = HydratedDocument<Post>

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
    },
})
export class Post {
    @Prop({ required: true, trim: true })
    title: string

    @Prop({ required: true })
    text: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User, required: true })
    author: User

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    likes: Types.ObjectId[] // tableau des userId qui ont liké
}

export const PostSchema = SchemaFactory.createForClass(Post)

PostSchema.index({ createdAt: -1 })
