import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Comment, CommentDocument } from '@app/models/comments/comment.schema'
import { Post, PostDocument } from '@app/models/posts/post.schema'
import { UserDocument } from '@app/models/users/user.schema'
import { CreateCommentDto } from '../dto/comment.dto'

@Injectable()
export class CommentService {
    constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>, @InjectModel(Post.name) private postModel: Model<PostDocument>) {}

    async findByPost(postId: string) {
        return this.commentModel.find({ post: postId }).populate('author', 'username email').sort({ createdAt: 1 }).exec()
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

        await comment.deleteOne()
        return { message: 'Comment deleted successfully' }
    }
}
