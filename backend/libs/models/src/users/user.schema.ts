import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserDocument = User & Document

@Schema({ timestamps: true,
    toJSON: {
    virtuals: true,
    transform: (_, ret: Record<string, unknown>) => {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
    },
  },
 })
export class User {
    @Prop({ required: true, unique: true, trim: true })
    username: string

    @Prop({ required: true, unique: true, trim: true, lowercase: true })
    email: string

    @Prop({ required: true })
    password: string // stocké hashé (bcrypt)
}

export const UserSchema = SchemaFactory.createForClass(User)
