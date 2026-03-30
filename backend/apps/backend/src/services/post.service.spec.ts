import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { NotFoundException, ForbiddenException } from '@nestjs/common'
import { PostService } from './post.service'
import { Post } from '@app/models/posts/post.schema'
import { Comment } from '@app/models/comments/comment.schema'

describe('PostService', () => {
    let service: PostService

    const mockUser = { _id: { toString: () => 'user-id' } } as any

    const mockPost = {
        _id: 'post-id',
        title: 'Test Post',
        text: 'Test content',
        author: { toString: () => 'user-id' },
        deleteOne: jest.fn().mockResolvedValue({}),
    }

    const mockPostModel = {
        find: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn().mockResolvedValue({}),
        create: jest.fn(),
    }

    const mockCommentModel = {
        deleteMany: jest.fn().mockResolvedValue({}),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PostService,
                { provide: getModelToken(Post.name), useValue: mockPostModel },
                { provide: getModelToken(Comment.name), useValue: mockCommentModel },
            ],
        }).compile()

        service = module.get<PostService>(PostService)
        jest.clearAllMocks()
    })

    describe('findAll', () => {
        it('should return all posts', async () => {
            mockPostModel.find.mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    sort: jest.fn().mockReturnValue({
                        exec: jest.fn().mockResolvedValue([mockPost]),
                    }),
                }),
            })

            const result = await service.findAll()

            expect(result).toEqual([mockPost])
            expect(mockPostModel.find).toHaveBeenCalled()
        })
    })

    describe('findOne', () => {
        it('should return a post by id', async () => {
            mockPostModel.findById.mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    exec: jest.fn().mockResolvedValue(mockPost),
                }),
            })

            const result = await service.findOne('post-id')

            expect(result).toEqual(mockPost)
            expect(mockPostModel.findById).toHaveBeenCalledWith('post-id')
        })

        it('should throw NotFoundException if post does not exist', async () => {
            mockPostModel.findById.mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    exec: jest.fn().mockResolvedValue(null),
                }),
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
        it('should delete post and all its comments', async () => {
            mockPostModel.findById.mockResolvedValue(mockPost)

            const result = await service.delete('post-id', mockUser)

            expect(mockCommentModel.deleteMany).toHaveBeenCalledWith({ post: 'post-id' })
            expect(mockPost.deleteOne).toHaveBeenCalled()
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
            expect(mockPost.deleteOne).not.toHaveBeenCalled()
        })
    })
})
