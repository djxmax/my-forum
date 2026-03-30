import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document, HydratedDocument, Types } from 'mongoose'
import { User } from '../users/user.schema'

export type LikeDocument = HydratedDocument<Like>

export enum LikeParentType {
    POST = 'post',
    COMMENT = 'comment',
}

@Schema({ timestamps: true })
export class Like {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
    author: User

    @Prop({ required: true, enum: LikeParentType })
    parentType: LikeParentType

    @Prop({ type: Types.ObjectId, required: true })
    parentId: Types.ObjectId
}

export const LikeSchema = SchemaFactory.createForClass(Like)

LikeSchema.index({ author: 1, parentType: 1, parentId: 1 }, { unique: true })
