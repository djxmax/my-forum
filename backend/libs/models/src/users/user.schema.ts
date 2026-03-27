import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
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
