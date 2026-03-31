import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { NotFoundException, ForbiddenException } from '@nestjs/common'
import { PostService } from './post.service'
import { Post } from '@app/models/posts/post.schema'
import { Comment } from '@app/models/comments/comment.schema'
import { Like } from '@app/models/likes/like.schema'
import { LikeHelperService } from './like-helper.service'

describe('PostService', () => {
    let service: PostService

    const mockUser = { _id: { toString: () => 'user-id' } } as any

    const mockPost = {
        _id: 'post-id',
        title: 'Test Post',
        text: 'Test content',
        author: { toString: () => 'user-id' },
        delete: jest.fn().mockResolvedValue({}),
        toJSON: jest.fn().mockReturnValue({ _id: 'post-id', title: 'Test Post' }),
    }

    const mockPostModel = {
        find: jest.fn(),
        findOne: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        countDocuments: jest.fn().mockResolvedValue(1),
    }

    const mockCommentModel = {
        find: jest.fn().mockReturnValue({ select: jest.fn().mockResolvedValue([]) }),
        delete: jest.fn().mockResolvedValue({}),
    }

    const mockLikeModel = {
        deleteMany: jest.fn().mockResolvedValue({}),
    }

    const mockLikeHelperService = {
        appendHasLiked: jest.fn().mockResolvedValue([{ ...mockPost, hasLiked: false }]),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PostService,
                { provide: getModelToken(Post.name), useValue: mockPostModel },
                { provide: getModelToken(Comment.name), useValue: mockCommentModel },
                { provide: getModelToken(Like.name), useValue: mockLikeModel },
                { provide: LikeHelperService, useValue: mockLikeHelperService },
            ],
        }).compile()

        service = module.get<PostService>(PostService)
        jest.clearAllMocks()
    })

    describe('findAll', () => {
        it('should return paginated posts', async () => {
            mockPostModel.find.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([mockPost]),
            })
            mockPostModel.countDocuments.mockResolvedValue(1)
            mockLikeHelperService.appendHasLiked.mockResolvedValue([{ ...mockPost, hasLiked: false }])

            const result = await service.findAll()

            expect(result.data).toBeDefined()
            expect(result.total).toBe(1)
            expect(mockPostModel.find).toHaveBeenCalled()
        })
    })

    describe('findOne', () => {
        it('should return a post by id', async () => {
            mockPostModel.findOne.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockPost),
            })
            mockLikeHelperService.appendHasLiked.mockResolvedValue([{ ...mockPost, hasLiked: false }])

            const result = await service.findOne('post-id')

            expect(result).toBeDefined()
            expect(mockPostModel.findOne).toHaveBeenCalledWith({ _id: 'post-id' })
        })

        it('should throw NotFoundException if post does not exist', async () => {
            mockPostModel.findOne.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(null),
            })

            await expect(service.findOne('nonexistent-id')).rejects.toThrow(NotFoundException)
        })
    })

    describe('create', () => {
        it('should create and return a new post', async () => {
            mockPostModel.create.mockResolvedValue(mockPost)

            const result = await service.create({ title: 'Test Post', text: 'Test content' }, mockUser)

            expect(mockPostModel.create).toHaveBeenCalledWith({
                title: 'Test Post',
                text: 'Test content',
                author: mockUser._id,
            })
            expect(result).toEqual(mockPost)
        })
    })

    describe('delete', () => {
        it('should soft delete post and its comments', async () => {
            mockPostModel.findById.mockResolvedValue(mockPost)
            mockCommentModel.find.mockReturnValue({ select: jest.fn().mockResolvedValue([]) })

            const result = await service.delete('post-id', mockUser)

            expect(mockCommentModel.delete).toHaveBeenCalledWith({ post: 'post-id' })
            expect(mockPost.delete).toHaveBeenCalled()
            expect(result).toEqual({ message: 'Post deleted successfully' })
        })

        it('should throw NotFoundException if post does not exist', async () => {
            mockPostModel.findById.mockResolvedValue(null)

            await expect(service.delete('nonexistent-id', mockUser)).rejects.toThrow(NotFoundException)
        })

        it('should throw ForbiddenException if user is not the author', async () => {
            const otherUser = { _id: { toString: () => 'other-user-id' } } as any
            mockPostModel.findById.mockResolvedValue(mockPost)

            await expect(service.delete('post-id', otherUser)).rejects.toThrow(ForbiddenException)
            expect(mockPost.delete).not.toHaveBeenCalled()
        })
    })
})
