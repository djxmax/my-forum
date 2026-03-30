import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Comment, CommentDocument } from '@app/models/comments/comment.schema'
import { Post, PostDocument } from '@app/models/posts/post.schema'
import { UserDocument } from '@app/models/users/user.schema'
import { CreateCommentDto } from '../dto/comment.dto'
import { Like, LikeDocument, LikeParentType } from '@app/models/likes/like.schema'
import { LikeHelperService } from './like-helper.service'

@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
        private likeHelperService: LikeHelperService
    ) {}

    async findByPost(postId: string, user?: UserDocument) {
        const comments = await this.commentModel
            .find({ post: postId })
            .populate('author', 'username email')
            .populate('likesCount')
            .sort({ createdAt: 1 })
            .exec()
        return this.likeHelperService.appendHasLiked(comments, user, LikeParentType.COMMENT)
    }

    async create(dto: CreateCommentDto, user: UserDocument) {
        const post = await this.postModel.findById(dto.postId)
        if (!post) throw new NotFoundException('Post not found')

        const comment = await this.commentModel.create({
            text: dto.text,
            author: user._id,
            post: dto.postId,
        })

        return comment.populate('author', 'username email')
    }

    async delete(id: string, user: UserDocument) {
        const comment = await this.commentModel.findById(id)
        if (!comment) throw new NotFoundException('Comment not found')

        if (comment.author.toString() !== user._id.toString()) {
            throw new ForbiddenException('You can only delete your own comments')
        }

        await this.likeModel.deleteMany({ parentId: id, parentType: LikeParentType.COMMENT })
        await comment.deleteOne()
        return { message: 'Comment deleted successfully' }
    }
}
