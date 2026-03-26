import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { NotFoundException, ForbiddenException } from '@nestjs/common'
import { CommentService } from './comment.service'
import { Comment } from '@app/models/comments/comment.schema'
import { Post } from '@app/models/posts/post.schema'

describe('CommentService', () => {
    let service: CommentService

    const mockUser = { _id: { toString: () => 'user-id' } } as any

    const mockPost = { _id: 'post-id' }

    const mockComment = {
        _id: 'comment-id',
        text: 'Test comment',
        author: { toString: () => 'user-id' },
        deleteOne: jest.fn().mockResolvedValue({}),
        populate: jest.fn(),
    }

    const mockCommentModel = {
        find: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
    }

    const mockPostModel = {
        findById: jest.fn(),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CommentService,
                { provide: getModelToken(Comment.name), useValue: mockCommentModel },
                { provide: getModelToken(Post.name), useValue: mockPostModel },
            ],
        }).compile()

        service = module.get<CommentService>(CommentService)
        jest.clearAllMocks()
    })

    describe('findByPost', () => {
        it('should return all comments for a post', async () => {
            mockCommentModel.find.mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    sort: jest.fn().mockReturnValue({
                        exec: jest.fn().mockResolvedValue([mockComment]),
                    }),
                }),
            })

            const result = await service.findByPost('post-id')

            expect(result).toEqual([mockComment])
            expect(mockCommentModel.find).toHaveBeenCalledWith({ post: 'post-id' })
        })
    })

    describe('create', () => {
        it('should create and return a comment', async () => {
            mockPostModel.findById.mockResolvedValue(mockPost)
            mockCommentModel.create.mockResolvedValue(mockComment)
            mockComment.populate.mockResolvedValue(mockComment)

            const result = await service.create({ text: 'Test comment', postId: 'post-id' }, mockUser)

            expect(mockCommentModel.create).toHaveBeenCalledWith({
                text: 'Test comment',
                author: mockUser._id,
                post: 'post-id',
            })
            expect(result).toEqual(mockComment)
        })

        it('should throw NotFoundException if post does not exist', async () => {
            mockPostModel.findById.mockResolvedValue(null)

            await expect(
                service.create({ text: 'Test', postId: 'nonexistent' }, mockUser)
            ).rejects.toThrow(NotFoundException)

            expect(mockCommentModel.create).not.toHaveBeenCalled()
        })
    })

    describe('delete', () => {
        it('should delete a comment', async () => {
            mockCommentModel.findById.mockResolvedValue(mockComment)

            const result = await service.delete('comment-id', mockUser)

            expect(mockComment.deleteOne).toHaveBeenCalled()
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
            expect(mockComment.deleteOne).not.toHaveBeenCalled()
        })
    })
})
