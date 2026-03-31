import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { NotFoundException, ForbiddenException } from '@nestjs/common'
import { CommentService } from './comment.service'
import { Comment } from '@app/models/comments/comment.schema'
import { Post } from '@app/models/posts/post.schema'
import { Like } from '@app/models/likes/like.schema'
import { LikeHelperService } from './like-helper.service'

describe('CommentService', () => {
    let service: CommentService

    const mockUser = { _id: { toString: () => 'user-id' } } as any

    const mockPost = { _id: 'post-id' }

    const mockComment = {
        _id: 'comment-id',
        text: 'Test comment',
        author: { toString: () => 'user-id' },
        delete: jest.fn().mockResolvedValue({}),
        populate: jest.fn().mockResolvedValue({ _id: 'comment-id', text: 'Test comment' }),
        toJSON: jest.fn().mockReturnValue({ _id: 'comment-id', text: 'Test comment' }),
    }

    const mockCommentModel = {
        find: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        countDocuments: jest.fn().mockResolvedValue(1),
    }

    const mockPostModel = {
        findById: jest.fn(),
    }

    const mockLikeModel = {
        deleteMany: jest.fn().mockResolvedValue({}),
    }

    const mockLikeHelperService = {
        appendHasLiked: jest.fn().mockResolvedValue([{ ...mockComment, hasLiked: false }]),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CommentService,
                { provide: getModelToken(Comment.name), useValue: mockCommentModel },
                { provide: getModelToken(Post.name), useValue: mockPostModel },
                { provide: getModelToken(Like.name), useValue: mockLikeModel },
                { provide: LikeHelperService, useValue: mockLikeHelperService },
            ],
        }).compile()

        service = module.get<CommentService>(CommentService)
        jest.clearAllMocks()
    })

    describe('findByPost', () => {
        it('should return paginated comments for a post', async () => {
            mockCommentModel.find.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([mockComment]),
            })
            mockCommentModel.countDocuments.mockResolvedValue(1)
            mockLikeHelperService.appendHasLiked.mockResolvedValue([{ ...mockComment, hasLiked: false }])

            const result = await service.findByPost('post-id')

            expect(result.data).toBeDefined()
            expect(result.total).toBe(1)
            expect(mockCommentModel.find).toHaveBeenCalledWith({ post: 'post-id' })
        })
    })

    describe('create', () => {
        it('should create and return a comment', async () => {
            mockPostModel.findById.mockResolvedValue(mockPost)
            mockCommentModel.create.mockResolvedValue(mockComment)

            const result = await service.create({ text: 'Test comment', postId: 'post-id' }, mockUser)

            expect(mockCommentModel.create).toHaveBeenCalledWith({
                text: 'Test comment',
                author: mockUser._id,
                post: 'post-id',
            })
            expect(result).toBeDefined()
        })

        it('should throw NotFoundException if post does not exist', async () => {
            mockPostModel.findById.mockResolvedValue(null)

            await expect(service.create({ text: 'Test', postId: 'nonexistent' }, mockUser)).rejects.toThrow(NotFoundException)
            expect(mockCommentModel.create).not.toHaveBeenCalled()
        })
    })

    describe('delete', () => {
        it('should soft delete a comment', async () => {
            mockCommentModel.findById.mockResolvedValue(mockComment)

            const result = await service.delete('comment-id', mockUser)

            expect(mockLikeModel.deleteMany).toHaveBeenCalledWith({ parentId: 'comment-id', parentType: 'comment' })
            expect(mockComment.delete).toHaveBeenCalled()
            expect(result).toEqual({ message: 'Comment deleted successfully' })
        })

        it('should throw NotFoundException if comment does not exist', async () => {
            mockCommentModel.findById.mockResolvedValue(null)

            await expect(service.delete('nonexistent-id', mockUser)).rejects.toThrow(NotFoundException)
        })

        it('should throw ForbiddenException if user is not the author', async () => {
            const otherUser = { _id: { toString: () => 'other-user-id' } } as any
            mockCommentModel.findById.mockResolvedValue(mockComment)

            await expect(service.delete('comment-id', otherUser)).rejects.toThrow(ForbiddenException)
            expect(mockComment.delete).not.toHaveBeenCalled()
        })
    })
})
