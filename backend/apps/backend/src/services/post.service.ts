import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Post, PostDocument } from '@app/models/posts/post.schema'
import { Comment, CommentDocument } from '@app/models/comments/comment.schema'
import { UserDocument } from '@app/models/users/user.schema'
import { CreatePostDto } from '../dto/post.dto'

@Injectable()
export class PostService {
    constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>, @InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

    async findAll() {
        return this.postModel
            .find()
            .populate('author', 'username email')
            .sort({ createdAt: -1 }) // les plus récents en premier
            .exec()
    }

    async findOne(id: string) {
        const post = await this.postModel.findById(id).populate('author', 'username email').exec()
        if (!post) throw new NotFoundException('Post not found')
        return post
    }

    async create(dto: CreatePostDto, user: UserDocument) {
        return this.postModel.create({
            title: dto.title,
            content: dto.content,
            author: user._id,
        })
    }

    async delete(id: string, user: UserDocument) {
        const post = await this.postModel.findById(id)
        if (!post) throw new NotFoundException('Post not found')

        if (post.author.toString() !== user._id.toString()) {
            throw new ForbiddenException('You can only delete your own posts')
        }

        await this.commentModel.deleteMany({ post: id })

        await post.deleteOne()
        return { message: 'Post deleted successfully' }
    }
}
