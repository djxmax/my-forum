import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Like, LikeDocument, LikeParentType } from '@app/models/likes/like.schema'
import { Post, PostDocument } from '@app/models/posts/post.schema'
import { Comment, CommentDocument } from '@app/models/comments/comment.schema'
import { UserDocument } from '@app/models/users/user.schema'
import { CreateLikeDto } from '../dto/like.dto'

@Injectable()
export class LikeService {
    constructor(
        @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        @InjectModel(Comment.name) private commentModel: Model<CommentDocument>
    ) {}

    async toggleLike(dto: CreateLikeDto, user: UserDocument) {
        await this.checkParentExists(dto.parentType, dto.parentId)

        const existing = await this.likeModel.findOne({
            author: user._id,
            parentType: dto.parentType,
            parentId: new Types.ObjectId(dto.parentId),
        })

        if (existing) {
            await existing.deleteOne()
            return { liked: false }
        }

        await this.likeModel.create({
            author: user._id,
            parentType: dto.parentType,
            parentId: new Types.ObjectId(dto.parentId),
        })

        return { liked: true }
    }

    // Vérifie que le parent (post ou comment) existe bien
    private async checkParentExists(parentType: LikeParentType, parentId: string) {
        if (parentType === LikeParentType.POST) {
            const post = await this.postModel.findById(parentId)
            if (!post) throw new NotFoundException('Post not found')
        } else {
            const comment = await this.commentModel.findById(parentId)
            if (!comment) throw new NotFoundException('Comment not found')
        }
    }
}
