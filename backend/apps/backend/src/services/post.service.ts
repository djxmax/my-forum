import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Post, PostDocument } from '@app/models/posts/post.schema'
import { Comment, CommentDocument } from '@app/models/comments/comment.schema'
import { UserDocument } from '@app/models/users/user.schema'
import { CreatePostDto } from '../dto/post.dto'
import { Like, LikeDocument, LikeParentType } from '@app/models/likes/like.schema'
import { LikeHelperService } from './like-helper.service'

@Injectable()
export class PostService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
        @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
        private likeHelperService: LikeHelperService
    ) {}

    async findAll(user?: UserDocument) {
        const posts = await this.postModel
            .find()
            .populate('author', 'username email')
            .populate('likesCount')
            .sort({ createdAt: -1 }) // les plus récents en premier
            .exec()

        return this.likeHelperService.appendHasLiked(posts, user, LikeParentType.POST)
    }

    async findOne(id: string, user?: UserDocument) {
        const post = await this.postModel.findById(id).populate('author', 'username email').populate('likesCount').exec()
        if (!post) throw new NotFoundException('Post not found')
        const [postWithLike] = await this.likeHelperService.appendHasLiked([post], user, LikeParentType.POST)
        return postWithLike
    }

    async create(dto: CreatePostDto, user: UserDocument) {
        return this.postModel.create({
            title: dto.title,
            text: dto.text,
            author: user._id,
        })
    }

    async delete(id: string, user: UserDocument) {
        const post = await this.postModel.findById(id)
        if (!post) throw new NotFoundException('Post not found')

        if (post.author.toString() !== user._id.toString()) {
            throw new ForbiddenException('You can only delete your own posts')
        }

        const comments = await this.commentModel.find({ post: id }).select('_id')
        const commentIds = comments.map((c) => c._id)

        await this.commentModel.deleteMany({ post: id })
        await this.likeModel.deleteMany({ parentId: id, parentType: LikeParentType.POST })
        ;(await this.likeModel.deleteMany({ parentId: { $in: commentIds }, parentType: LikeParentType.COMMENT }), await post.deleteOne())
        return { message: 'Post deleted successfully' }
    }
}
