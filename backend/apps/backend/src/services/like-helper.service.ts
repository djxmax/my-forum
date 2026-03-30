import { Like, LikeDocument, LikeParentType } from '@app/models/likes/like.schema'
import { UserDocument } from '@app/models/users/user.schema'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Document, Types } from 'mongoose'

@Injectable()
export class LikeHelperService {
    constructor(@InjectModel(Like.name) private likeModel: Model<LikeDocument>) {}

    async appendHasLiked<T extends Document & { _id: Types.ObjectId }>(docs: T[], user: UserDocument | undefined, parentType: LikeParentType) {
        const plainDocs = docs.map((d) => d.toJSON())

        if (!user) {
            return plainDocs.map((d) => ({ ...d, hasLiked: false }))
        }

        const ids = docs.map((d) => d._id)
        const likes = await this.likeModel.find({
            author: user._id,
            parentType,
            parentId: { $in: ids },
        })

        const likedIds = new Set(likes.map((l) => l.parentId.toString()))

        return plainDocs.map((d) => ({
            ...d,
            hasLiked: likedIds.has(d._id.toString()),
        }))
    }
}
