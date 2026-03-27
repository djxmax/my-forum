import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { ConflictException, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { AuthService } from './auth.service'
import { User } from '@app/models/users/user.schema'

jest.mock('bcrypt')

describe('AuthService', () => {
    let service: AuthService

    const mockUser = {
        _id: 'user-id',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
    }

    const mockUserModel = {
        findOne: jest.fn(),
        create: jest.fn(),
        findByIdAndUpdate: jest.fn().mockResolvedValue({}),
    }

    const mockJwtService = {
        sign: jest.fn().mockReturnValue('mock-token'),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: getModelToken(User.name), useValue: mockUserModel },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile()

        service = module.get<AuthService>(AuthService)
        jest.clearAllMocks()
    })

    describe('register', () => {
        it('should register a new user and return a token', async () => {
            mockUserModel.findOne.mockResolvedValue(null)
            ;(bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword')
            mockUserModel.create.mockResolvedValue(mockUser)

            const result = await service.register({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
            })

            expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' })
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10)
            expect(result.access_token).toBe('mock-token')
            expect(result.user.username).toBe('testuser')
        })

        it('should throw ConflictException if email is already in use', async () => {
            mockUserModel.findOne.mockResolvedValue(mockUser)

            await expect(
                service.register({ username: 'testuser', email: 'test@example.com', password: 'password123' })
            ).rejects.toThrow(ConflictException)

            expect(mockUserModel.create).not.toHaveBeenCalled()
        })
    })

    describe('changePassword', () => {
        it('should update the password successfully', async () => {
            ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
            ;(bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword')

            const result = await service.changePassword(mockUser as any, {
                currentPassword: 'password123',
                newPassword: 'newPassword456',
            })

            expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockUser.password)
            expect(bcrypt.hash).toHaveBeenCalledWith('newPassword456', 10)
            expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(mockUser._id, { password: 'newHashedPassword' })
            expect(result).toEqual({ message: 'Password updated successfully' })
        })

        it('should throw UnauthorizedException if current password is incorrect', async () => {
            ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

            await expect(
                service.changePassword(mockUser as any, {
                    currentPassword: 'wrongPassword',
                    newPassword: 'newPassword456',
                })
            ).rejects.toThrow(UnauthorizedException)

            expect(mockUserModel.findByIdAndUpdate).not.toHaveBeenCalled()
        })
    })

    describe('login', () => {
        it('should login and return a token', async () => {
            mockUserModel.findOne.mockResolvedValue(mockUser)
            ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

            const result = await service.login({ email: 'test@example.com', password: 'password123' })

            expect(result.access_token).toBe('mock-token')
            expect(result.user.email).toBe('test@example.com')
        })

        it('should throw UnauthorizedException if user is not found', async () => {
            mockUserModel.findOne.mockResolvedValue(null)

            await expect(
                service.login({ email: 'notfound@example.com', password: 'password' })
            ).rejects.toThrow(UnauthorizedException)
        })

        it('should throw UnauthorizedException if password is incorrect', async () => {
            mockUserModel.findOne.mockResolvedValue(mockUser)
            ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

            await expect(
                service.login({ email: 'test@example.com', password: 'wrongpassword' })
            ).rejects.toThrow(UnauthorizedException)
        })
    })
})
